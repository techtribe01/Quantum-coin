
import { Card } from "@/components/ui/card";
import { Zap, Shield, Scale, Globe2 } from "lucide-react";

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all">
        <Zap className="w-8 h-8 text-purple-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
        <p className="text-gray-400">Sub-second finality with 100,000+ TPS capacity</p>
      </Card>
      <Card className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all">
        <Shield className="w-8 h-8 text-purple-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Ultra Secure</h3>
        <p className="text-gray-400">Post-quantum cryptography with formal verification</p>
      </Card>
      <Card className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all">
        <Scale className="w-8 h-8 text-purple-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">DeFi Ready</h3>
        <p className="text-gray-400">Advanced smart contracts for complex financial applications</p>
      </Card>
      <Card className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all">
        <Globe2 className="w-8 h-8 text-purple-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Global Scale</h3>
        <p className="text-gray-400">Cross-border payments with instant settlement</p>
      </Card>
    </div>
  );
}
