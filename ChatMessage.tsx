
import React from "react";
import { ChatMessage as ChatMessageType } from "@/services/aiService";
import { ChartData } from "../types";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChatMessageProps {
  message: ChatMessageType;
}

const renderChart = (chart: ChartData) => {
  const { type, data, xAxisKey, yAxisKey, color = "#8b5cf6" } = chart;

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey={xAxisKey} tick={{ fill: '#d1d5db' }} />
          <YAxis tick={{ fill: '#d1d5db' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
          <Line type="monotone" dataKey={yAxisKey} stroke={color} strokeWidth={2} dot={{ fill: color, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  } else if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey={xAxisKey} tick={{ fill: '#d1d5db' }} />
          <YAxis tick={{ fill: '#d1d5db' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
          <Bar dataKey={yAxisKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey={xAxisKey} tick={{ fill: '#d1d5db' }} />
          <YAxis tick={{ fill: '#d1d5db' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
          <Area type="monotone" dataKey={yAxisKey} stroke={color} fill={color} fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Fix: Properly handle the content type checking
  const isContentObject = typeof message.content === 'object' && message.content !== null;
  
  // Fix: Get text content based on whether content is an object or string
  const textContent = isContentObject 
    ? (message.content as any).text || '' 
    : message.content as string;
  
  // Fix: Only try to get charts if content is an object
  const charts = isContentObject ? (message.content as any).charts : undefined;

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-lg ${
          message.role === "user"
            ? "bg-purple-600 text-white"
            : "bg-gray-800 text-gray-100"
        }`}
      >
        <div className="whitespace-pre-wrap">{textContent}</div>
        
        {charts && charts.length > 0 && (
          <div className="mt-4 space-y-4">
            {charts.map((chart: ChartData, index: number) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-2">{chart.title}</h4>
                {renderChart(chart)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
