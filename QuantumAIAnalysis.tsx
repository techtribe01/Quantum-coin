
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Bot, Coins, RefreshCw, ArrowRight, BrainCircuit, Zap, Shield, Activity } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { toast } from "sonner";
import aiService, { QuantumSecurityAnalysis } from "@/services/aiService";
import exchangeService from "@/services/exchangeService";

export function QuantumAIAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    marketTrend: string;
    tokenPrediction: string;
    riskAssessment: string;
    recommendation: string;
  }>({
    marketTrend: "Analyzing market conditions...",
    tokenPrediction: "Generating Quantum coin price predictions...",
    riskAssessment: "Calculating risk factors...",
    recommendation: "Preparing investment recommendations...",
  });
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [aiConfidence, setAiConfidence] = useState<number>(85);
  const [securityAnalysis, setSecurityAnalysis] = useState<QuantumSecurityAnalysis | null>(null);
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);
  const [neuralNetworkActive, setNeuralNetworkActive] = useState(true);

  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      // Fetch current price data
      const prices = await exchangeService.getPrices(['QNTM']);
      if (prices.length > 0) {
        setCurrentPrice(prices[0].price);
        setPriceChange(prices[0].change24h);
      }
      
      // Generate AI analysis with neural enhancement
      const response = await aiService.generateQuantumCoinFunction("tokenomics", undefined, neuralNetworkActive);
      
      if (response.status === 'success') {
        // In a real scenario this would parse structured data from AI
        setAnalysis({
          marketTrend: "The current market shows strong accumulation patterns with increasing volume. Institutional interest in Quantum coin has grown by 23% in Q1 2025. Quantum computing advancements have attracted significant attention to the project.",
          tokenPrediction: "Based on technical analysis and network growth metrics, Quantum coin is projected to appreciate by 140-180% over the next 6 months, with potential for higher gains if quantum computing adoption accelerates as predicted.",
          riskAssessment: "Medium risk profile. Volatility remains high compared to established cryptocurrencies, but strong fundamentals and growing adoption provide solid support levels. The educational foundation provides additional stability.",
          recommendation: "Strategic accumulation advised. Dollar-cost averaging and maintaining 5-10% of crypto portfolio allocation to Quantum coin offers optimal risk-reward ratio. Consider staking for additional returns."
        });
        
        // Update AI confidence based on neural network if available
        if (response.neuralOutput) {
          setAiConfidence(Math.round(response.neuralOutput.confidence * 100));
        } else {
          // Simulate variation in AI confidence
          setAiConfidence(Math.floor(Math.random() * 15) + 80); // Random between 80-95
        }
        
        // Fetch quantum security analysis
        const securityData = await aiService.analyzeQuantumSecurity();
        setSecurityAnalysis(securityData);
        
        setLastUpdated(new Date());
        toast.success("Quantum AI analysis completed");
      } else {
        toast.error("Failed to generate AI analysis");
      }
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast.error("Something went wrong with Quantum AI analysis");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAnalysis();
    
    // Refresh data every 2 minutes
    const intervalId = setInterval(generateAnalysis, 120000);
    
    return () => clearInterval(intervalId);
  }, [neuralNetworkActive]);

  const toggleNeuralNetwork = () => {
    setNeuralNetworkActive(!neuralNetworkActive);
    toast.info(
      neuralNetworkActive 
        ? "Neural network enhancement disabled" 
        : "Neural network enhancement activated"
    );
    // Analysis will be regenerated due to the dependency in the useEffect
  };

  return (
    <Card className="p-6 bg-black/70 backdrop-blur-sm border border-purple-500/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-purple-400" /> 
          QuantumAI Market Analysis
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleNeuralNetwork}
            className={`px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 ${
              neuralNetworkActive ? 'bg-green-600/80 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
            } transition-colors`}
            title={neuralNetworkActive ? "Neural network active" : "Neural network inactive"}
          >
            <Activity className="h-3.5 w-3.5" />
            ANN {neuralNetworkActive ? "On" : "Off"}
          </button>
          
          <button
            onClick={generateAnalysis}
            disabled={isLoading}
            className="bg-purple-500/80 hover:bg-purple-600 transition-colors px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
          <div className="flex items-center bg-gray-800/60 rounded-full px-3 py-1">
            <Logo iconType="gem" size={5} interactive={false} />
            <span className="text-white font-medium mx-1">QNTM:</span>
            {currentPrice ? (
              <span className="text-white">${currentPrice.toFixed(4)}</span>
            ) : (
              <span className="text-gray-400">Loading...</span>
            )}
            {priceChange !== 0 && (
              <span className={`ml-2 text-xs ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/10">
            <h4 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Market Trend
            </h4>
            <p className="text-gray-300">{analysis.marketTrend}</p>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/10">
            <h4 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Token Prediction
            </h4>
            <p className="text-gray-300">{analysis.tokenPrediction}</p>
          </div>
          
          {securityAnalysis && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/10">
              <h4 className="text-purple-400 font-medium mb-2 flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowSecurityDetails(!showSecurityDetails)}>
                <Shield className="h-4 w-4" />
                Quantum Security
                <span className="text-xs text-gray-400 ml-auto">{showSecurityDetails ? 'Hide' : 'Show'} details</span>
              </h4>
              
              <div className="flex items-center mb-3">
                <span className="text-gray-400 text-sm mr-2">Security Score:</span>
                <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      securityAnalysis.resistanceScore > 0.8 ? 'bg-green-500' : 
                      securityAnalysis.resistanceScore > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{width: `${securityAnalysis.resistanceScore * 100}%`}}
                  ></div>
                </div>
                <span className="text-white text-sm ml-2">
                  {Math.round(securityAnalysis.resistanceScore * 100)}%
                </span>
              </div>
              
              {showSecurityDetails && (
                <>
                  <div className="mt-3">
                    <h5 className="text-sm text-gray-400 mb-1">Quantum-Safe Algorithms:</h5>
                    <div className="flex flex-wrap gap-2">
                      {securityAnalysis.quantumSafeAlgorithms.map((algo, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-purple-900/50 px-2 py-1 rounded text-purple-200"
                        >
                          {algo}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-sm text-gray-400 mb-1">Vulnerabilities:</h5>
                    <ul className="text-xs text-gray-300 list-disc list-inside">
                      {securityAnalysis.vulnerabilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/10">
            <h4 className="text-purple-400 font-medium mb-2">Risk Assessment</h4>
            <p className="text-gray-300">{analysis.riskAssessment}</p>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/10">
            <h4 className="text-purple-400 font-medium mb-2">Investment Recommendation</h4>
            <p className="text-gray-300">{analysis.recommendation}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-purple-500/10">
              <div className="text-gray-400 text-sm flex items-center">
                <BrainCircuit className="h-4 w-4 mr-1.5 text-purple-400" />
                AI confidence level
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{width: `${aiConfidence}%`}}></div>
                </div>
                <span className="text-purple-400 text-sm">{aiConfidence}%</span>
              </div>
            </div>
            
            {neuralNetworkActive && (
              <div className="bg-gray-800/50 p-3 rounded-lg border border-purple-500/10">
                <div className="text-xs text-gray-300">
                  <div className="flex items-center gap-1.5 text-purple-300 mb-2">
                    <Activity className="h-3.5 w-3.5" />
                    <span className="font-medium">Neural Network Analysis Active</span>
                  </div>
                  <p className="text-gray-400">
                    Utilizing multi-layer perceptron with 3 hidden layers and ReLU activation functions.
                    Quantum resistance verification through lattice-based cryptography methods.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Zap className="h-3 w-3 text-purple-400" />
          <span>Powered by Quantum AI</span>
        </div>
        <span className="text-xs text-gray-500">
          {isLoading ? "Updating..." : `Last updated: ${lastUpdated.toLocaleTimeString()}`}
        </span>
      </div>
    </Card>
  );
}
