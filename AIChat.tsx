
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/layout/Logo";
import { toast } from "sonner";
import aiService, { ChatMessage } from "@/services/aiService";
import { v4 as uuidv4 } from "uuid";
import { ChatInput } from "./components/ChatInput";
import { ChatMessageList } from "./components/ChatMessageList";
import { SuggestedQueries } from "./components/SuggestedQueries";
import { suggestedQueries } from "./data/suggestedQueries";
import { BrainCircuit } from "lucide-react";

// Integration of the new question-answer pairs data for Quantum Coin knowledge
const quantumCoinKnowledgeBase = [
  { prompt: "What is Quantum Coin?", completion: "Quantum Coin is a next-generation blockchain network designed to solve the Blockchain Trilemma (scalability, security, sustainability). Key features include high transaction throughput (10,000+ TPS), ultra-low energy consumption (0.01 kWh/transaction), and minimal transaction fees ($0.0001)." },
  { prompt: "How does Quantum Coin achieve its high energy efficiency?", completion: "Quantum Coin achieves 0.01 kWh/transaction through a hybrid Delegated Proof-of-Stake (DPoS) and Byzantine Fault Tolerance (BFT) consensus mechanism. Only 101 rotating validators consuming approximately 50 watts secure the network, avoiding energy-intensive mining." },
  { prompt: "What are the main technical components of the Quantum Coin network?", completion: "The Quantum Coin network uses a hybrid DPoS/BFT consensus, Layer-1 sharding (64 shards processing transactions in parallel), and Layer-2 Zero-Knowledge Rollups (ZK-Rollups) to optimize transaction finality, throughput, and energy efficiency." },
  { prompt: "How is the transaction throughput improved in Quantum Coin?", completion: "Quantum Coin utilizes Layer-1 sharding with 64 shards, allowing for 10,000 transactions per second. Layer-2 ZK-Rollups aggregate 1,000 transactions into a single on-chain transaction, reducing fees to $0.0001 per transaction and scaling the throughput even further." },
  { prompt: "What are the node requirements for Quantum Coin?", completion: "Quantum Coin validator nodes require a 4-core CPU, 16GB of RAM, and a 500GB SSD (pruned monthly). The low hardware requirements enable greater decentralization and accessibility." },
  { prompt: "What measures are in place to ensure the security of the Quantum Coin network?", completion: "The Quantum Coin network employs EdDSA signatures, with a roadmap for post-quantum cryptographic upgrades. Security audits are performed annually by third-party firms such as Certik and Halborn. On-chain governance mechanisms are in place for protocol enhancements and consensus modifications." },
  { prompt: "What is the annual cost for running a Quantum Coin validator node?", completion: "The estimated annual cost for running a Quantum Coin validator node including validator incentives and node hosting is $1.3M - $2.5M." },
  { prompt: "What are the validator incentives for the Quantum Coin network?", completion: "Quantum Coin validators earn 5 Quantum Coin per block which equates to 78.84M coins/year" },
  { prompt: "How is Quantum Coin different from other cryptocurrencies?", completion: "Quantum Coin balances speed, cost, and sustainability without compromising security. It offers 10,000 TPS with 0.01 kWh/tx and $0.0001 average fees, making it more energy-efficient and cost-effective than Bitcoin, Ethereum and others." },
  { prompt: "What are the potential revenue streams for the Quantum Coin network?", completion: "Potential revenue streams for the Quantum Coin network include transaction fees, exchange fees, enterprise partnerships, and token presales." },
  { prompt: "What is the projected profitability for the Quantum Coin network?", completion: "The Quantum Coin network is expected to achieve break-even at $7M revenue and achieve substantial profitability emerging by year 5" },
  { prompt: "What mitigation strategies does Quantum Coin employ for network bottlenecks, smart contract vulnerabilities, and regulatory constraints?", completion: "Quantum Coin implements adaptive sharding and ZK-Rollup integration to address network bottlenecks, formal verification and third-party security audits for smart contract vulnerabilities, and proactive multi-jurisdictional licensing and legal reserve allocation for regulatory constraints." },
  { prompt: "What strategic partnerships does Quantum Coin have?", completion: "Quantum Coin has confirmed strategic partnerships with AWS for node hosting infrastructure and Shopify for pilot Quantum Coin payments." },
  { prompt: "What is the role of E. Dhushyanth Kumar in the Quantum Coin team?", completion: "E. Dhushyanth Kumar is a Full stake developer at Quantum Coin, doing front end & Back end development and website design, Application developer and testing." },
  { prompt: "What is the role of R Karthikeyan in the Quantum Coin team?", completion: "R Karthikeyan does smart contracts, chain and crypto management for Quantum Coin." },
  { prompt: "What is the role of S Shaziya in the Quantum Coin team?", completion: "S Shaziya creates smart contracts for Quantum Coin." },
  { prompt: "What is the role of R Jeeva Sitams in the Quantum Coin team?", completion: "R Jeeva Sitams oversees the api and flow management, ethical hacking, node penetration at Quantum Coin." },
  { prompt: "Can you describe the Quantum Coin vision and goals?", completion: "The Quantum Coin blockchain network presents a robust framework for scalable and energy-efficient decentralized financial applications." },
  { prompt: "What is the long-term vision for Quantum Coin?", completion: "To achieve mass adoption and long-term viability and disrupt potential in the digital asset landscape." },
  { prompt: "Describe Quantum Coin in 100 words.", completion: "Quantum Coin is a next-generation blockchain designed to solve the blockchain trilemma by achieving high scalability, strong security, and sustainability. It uses a hybrid consensus mechanism combining Delegated Proof-of-Stake and Byzantine Fault Tolerance, enabling over 10,000 transactions per second with ultra-low energy consumption of 0.01 kWh per transaction. Quantum coin is intended to be faster than Bitcoin with low cost to make mass adoption possible." },
  { prompt: "What are the planned milestones for the Quantum Coin project in Q1 & Q2 2025?", completion: "In Q1 & Q2 2025, Quantum Coin plans to launch an educational platform, develop interactive learning modules, create community tutorials, and provide detailed developer documentation." },
  { prompt: "What are the planned milestones for the Quantum Coin project in Q3 2026?", completion: "In Q3 2026, Quantum Coin aims to launch a GameFi platform, establish an NFT marketplace, implement play-to-earn mechanics, and provide a game developer SDK." },
  { prompt: "What are the planned milestones for the Quantum Coin project in Q4 & Q5 2027?", completion: "In Q4 & Q5 2027, Quantum Coin intends to develop a governance portal, create a staking platform, organize community events, and facilitate DeFi integration." },
  { prompt: "What is the plan for Quantum Coin in Q6 & Q7 2028?", completion: "In Q6 & Q7 2028, Quantum Coin is focusing on global expansion. The company will plan to launch in 50+ countries, implement quantum resistance, scale to 100k+ validators, and deploy advanced DeFi protocols." },
  { prompt: "What is the estimated cost for building a blockchain infrastructure for Quantum Coin?", completion: "The estimated cost for building a blockchain infrastructure for Quantum Coin is $2M to $5M. This includes the core protocol, smart contract implementation, and testnets." },
  { prompt: "What is the estimated cost for building an exchange infrastructure for Quantum Coin?", completion: "The estimated cost for building an exchange infrastructure for Quantum Coin is $1.5M to $3M. This involves UI/UX refinement, liquidity integration, and API interfaces." },
  { prompt: "How much is Quantum Coin budgeting for regulatory compliance?", completion: "Quantum Coin is budgeting $500k to $1M for regulatory compliance. This allocation accounts for licensing and adherence to jurisdictional financial regulations." },
  { prompt: "What is the budget for strategic marketing for Quantum Coin?", completion: "Quantum Coin's budget for strategic marketing is $1M to $2M, allocated for community outreach, partnerships, and targeted advertising campaigns." },
  { prompt: "What are some of the strategies Quantum Coin is using to mitigate risk?", completion: "Quantum Coin is adaptive sharding, ZK-Rollup integration, formal verification, and third-party security audits. To avoid market volatility, Quantum Coin does treasury diversification." },
  { prompt: "How does Quantum Coin intend to ensure chain integrity?", completion: "Quantum coin has validators with the 10% stake slashing for malicious actors, proactive multi-jurisdictional licensing and legal reserve allocation." },
  { prompt: "Compared to Bitcoin and Ethereum, what are the benefits and drawbacks to Quantum coin?", completion: "Quantum Coin balances speed, cost, and sustainability without compromising security. Bitcoin and Ethreum can vary widely in average fee compared to Quantum Coin." },
  { prompt: "Describe some of Quantum Coin's partners.", completion: "Quantum Coin is partnered with AWS with Deloitte with potential uses." },
  { prompt: "Are the nodes for Quantum Coin designed to be high performance or low performace?", completion: "The nodes for Quantum Coin is designed to be low performace in order to make the total network lower" },
  { prompt: "When can the users expect the product from Quantum Coin?", completion: "The users should expect to see product in 2024. This includes beta with potential for enterprise contracts." }
];

export function AIChat() {
  // Start with empty messages array; assistant responses will be fetched via aiService using the knowledge base
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Get AI response - Fix here: the aiService.generateChatResponse only expects one argument
      const response = await aiService.generateChatResponse(messageText);
      
      if (response.status === 'success') {
        const botMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: response.text,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        toast.error(response.message || 'Failed to get a response');
      }
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Something went wrong with the AI chat');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestedQuery = (query: string) => {
    handleSend(query);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/40 border-purple-500/30">
      <CardHeader className="border-b border-purple-500/20">
        <CardTitle className="flex items-center gap-2">
          <Logo iconType="gem" size={6} interactive={false} />
          <span className="text-white flex items-center">
            <BrainCircuit className="w-5 h-5 mr-1 text-purple-400" />
            QuantumBot AI Assistant
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChatMessageList messages={messages} />
        
        {/* Suggested queries section */}
        {messages.length < 3 && (
          <SuggestedQueries 
            suggestions={suggestedQueries} 
            onSelectQuery={handleSuggestedQuery} 
            isLoading={isLoading}
          />
        )}
      </CardContent>
      <CardFooter className="border-t border-purple-500/20 p-4">
        <ChatInput onSendMessage={handleSend} isLoading={isLoading} />
      </CardFooter>
    </Card>
  );
}
