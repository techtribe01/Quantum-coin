
import React from "react";
import { Logo, LogoIconType } from "@/components/layout/Logo";
import { WalletConnect } from "@/components/wallet/WalletConnect";

interface NavBarProps {
  logoType: LogoIconType;
  onLogoClick: () => void;
  selectedWallet: string | null;
  onConnectWallet: (walletType: string) => void;
  onShowCharts: () => void;
  onShowAIChat: () => void;
  onShowSwap: () => void;
  showCharts: boolean;
  showAIChat: boolean;
  showSwap: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({
  logoType,
  onLogoClick,
  selectedWallet,
  onConnectWallet,
  onShowCharts,
  onShowAIChat,
  onShowSwap,
  showCharts,
  showAIChat,
  showSwap
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div onClick={onLogoClick}>
              <Logo iconType={logoType} />
            </div>
            <span className="text-xl font-bold text-white">Quantum Coin</span>
          </div>
          <div className="flex items-center gap-2">
            <WalletConnect onConnect={onConnectWallet} selectedWallet={selectedWallet} />
            <button 
              onClick={onShowCharts}
              className="bg-purple-500/80 hover:bg-purple-600 transition-colors px-6 py-2 rounded-full text-white font-medium mx-2"
            >
              {showCharts ? "Hide Charts" : "Price Charts"}
            </button>
            <button 
              onClick={onShowAIChat}
              className="bg-purple-500/80 hover:bg-purple-600 transition-colors px-6 py-2 rounded-full text-white font-medium mx-2"
            >
              {showAIChat ? "Hide AI Chat" : "Quantum AI"}
            </button>
            <button 
              onClick={onShowSwap}
              className="bg-purple-500 hover:bg-purple-600 transition-colors px-6 py-2 rounded-full text-white font-medium"
            >
              {showSwap ? "View Info" : "Try QuantumSwap"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
