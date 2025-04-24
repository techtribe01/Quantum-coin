
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onTrySwap: () => void;
}

export function HeroSection({ onTrySwap }: HeroSectionProps) {
  return (
    <div className="max-w-3xl mb-20">
      <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
        Next-Generation Blockchain Platform
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {" "}Built for Global Finance
        </span>
      </h1>
      <p className="text-xl text-gray-400 mb-8">
        Quantum Coin combines advanced consensus mechanisms, sustainable operations, and enterprise-grade solutions to revolutionize cross-border payments and decentralized finance.
      </p>
      <div className="flex gap-4">
        <button className="bg-purple-500 hover:bg-purple-600 transition-colors px-8 py-3 rounded-lg text-white font-medium flex items-center gap-2">
          Technical Whitepaper <ArrowRight className="w-4 h-4" />
        </button>
        <button 
          onClick={onTrySwap}
          className="bg-white/10 hover:bg-white/20 transition-colors px-8 py-3 rounded-lg text-white font-medium"
        >
          Try QuantumSwap
        </button>
      </div>
    </div>
  );
}
