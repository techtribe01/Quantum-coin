
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Wallet, 
  ArrowRight, 
  Coins, 
  CheckCircle, 
  X, 
  Info, 
  CircleCheck, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw,
  Zap,
  Globe,
  Send,
  Download,
  RotateCw
} from "lucide-react";
import { toast } from "sonner";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Logo } from "@/components/layout/Logo";
import { getTranslationByNamespace } from "@/lib/translations";
import { walletTranslations } from "@/lib/translations/languages";

interface WalletProps {
  onConnect: (walletType: string) => void;
  selectedWallet: string | null;
}

const wallets = [
  { 
    id: "metamask", 
    name: "MetaMask", 
    icon: "orange", 
    description: "Connect to your MetaMask wallet",
    network: "ethereum",
    iconComponent: <div className="bg-orange-500 p-2 rounded-full mr-3"><Wallet className="h-5 w-5 text-white" /></div>
  },
  { 
    id: "trust", 
    name: "Trust Wallet", 
    icon: "blue", 
    description: "Connect using Trust Wallet",
    network: "multi-chain",
    iconComponent: <div className="bg-blue-500 p-2 rounded-full mr-3"><ShieldCheck className="h-5 w-5 text-white" /></div>
  },
  { 
    id: "phantom", 
    name: "Phantom", 
    icon: "purple", 
    description: "Connect your Solana wallet with Phantom",
    network: "solana",
    iconComponent: <div className="bg-purple-500 p-2 rounded-full mr-3"><Zap className="h-5 w-5 text-white" /></div>
  },
  { 
    id: "walletconnect", 
    name: "WalletConnect", 
    icon: "green", 
    description: "Connect using WalletConnect protocol",
    network: "mobile",
    iconComponent: <div className="bg-green-500 p-2 rounded-full mr-3"><ArrowRight className="h-5 w-5 text-white" /></div>
  },
];

export function WalletConnect({ onConnect, selectedWallet }: WalletProps) {
  const [open, setOpen] = useState(false);
  const [balances, setBalances] = useState({
    QNTM: "25000.00",
    ETH: "1.2345",
    BTC: "0.0821",
    SOL: "45.678",
    USDT: "5000.00"
  });
  const [showBalances, setShowBalances] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<string | null>(null);

  // Get translations based on current language
  const t = (key: string) => {
    return walletTranslations[currentLanguage as keyof typeof walletTranslations]?.[key as keyof typeof walletTranslations[keyof typeof walletTranslations]] || 
           walletTranslations.en[key as keyof typeof walletTranslations.en] || 
           key;
  };

  useEffect(() => {
    if (selectedWallet) {
      setConnectionStatus('connected');
      setShowBalances(true);
      
      // Get the wallet type based on the name
      const foundWallet = wallets.find(w => w.name === selectedWallet);
      if (foundWallet) {
        setSelectedWalletType(foundWallet.id);
      }
    } else {
      setConnectionStatus('disconnected');
      setShowBalances(false);
      setSelectedWalletType(null);
    }
  }, [selectedWallet]);

  const handleConnect = (walletId: string) => {
    setConnectionStatus('connecting');
    setConnectionError(null);
    setSelectedWalletType(walletId);
    
    // Simulate connection process
    toast.loading(`${t('connecting')} ${wallets.find(w => w.id === walletId)?.name}...`);
    
    // Simulate secure connection with crypto.subtle (for frontend cryptography)
    simulateSecureConnection().then(success => {
      if (success) {
        onConnect(wallets.find(w => w.id === walletId)?.name || walletId);
        setOpen(false);
        setConnectionStatus('connected');
        
        // Simulate loading balances
        setTimeout(() => {
          setShowBalances(true);
          toast.success(`${t('connected')} ${t('activeStatus')}`);
        }, 500);
      } else {
        setConnectionError(`${t('connectError')}. ${t('learnMore')}`);
        setConnectionStatus('disconnected');
        toast.error(`${t('connectError')}. ${t('learnMore')}`);
      }
    });
  };

  // Simulate secure wallet connection using Web Crypto API
  const simulateSecureConnection = async (): Promise<boolean> => {
    try {
      // Use crypto.subtle.digest for secure message hashing (SHA-256)
      const message = new TextEncoder().encode("QuantumCoin secure connection request");
      await crypto.subtle.digest('SHA-256', message);
      
      // Simulate success rate
      return Math.random() > 0.2; // 80% success rate for demo
    } catch (error) {
      console.error("Crypto API error:", error);
      return false;
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    setShowBalances(false);
    setConnectionError(null);
    setSelectedWalletType(null);
    onConnect('');
    toast.success(t('disconnected'));
  };

  const getNetworkTranslation = (network: string) => {
    switch (network) {
      case 'ethereum': return t('ethereum');
      case 'solana': return t('solana');
      case 'multi-chain': return t('multiChain');
      case 'mobile': return t('mobileWallets');
      default: return network;
    }
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    toast.success(`Language changed to ${language}`);
    setShowLanguageSelector(false);
  };

  const refreshBalance = () => {
    setIsRefreshing(true);
    
    // Simulate refreshing balances
    setTimeout(() => {
      // Generate slightly different balances to simulate real updates
      setBalances({
        QNTM: (parseFloat(balances.QNTM) + (Math.random() * 10 - 5)).toFixed(2),
        ETH: (parseFloat(balances.ETH) + (Math.random() * 0.05 - 0.025)).toFixed(4),
        BTC: (parseFloat(balances.BTC) + (Math.random() * 0.005 - 0.0025)).toFixed(4),
        SOL: (parseFloat(balances.SOL) + (Math.random() * 0.5 - 0.25)).toFixed(3),
        USDT: (parseFloat(balances.USDT) + (Math.random() * 10 - 5)).toFixed(2)
      });
      setIsRefreshing(false);
      
      toast.success("Balance refreshed successfully");
    }, 1500);
  };

  if (!selectedWallet) {
    return (
      <>
        <Button 
          onClick={() => setOpen(true)}
          className="bg-black/40 hover:bg-black/60 text-white border border-purple-500/30 transition-all duration-300 hover:scale-105"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {t('connect')}
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-gray-900 border border-purple-500/30 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{t('connect')}</DialogTitle>
              <DialogDescription className="text-gray-300">
                {t('connectDescription')}
              </DialogDescription>
            </DialogHeader>
            
            {connectionError && (
              <div className="bg-red-500/20 p-3 rounded-md flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-200">{connectionError}</span>
              </div>
            )}
            
            <div className="grid gap-4 py-4">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  onClick={() => handleConnect(wallet.id)}
                  className={`flex justify-between items-center w-full bg-gray-800 border-purple-500/30 hover:bg-gray-700 py-6 group transition-all duration-300 ${selectedWalletType === wallet.id && connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}
                  disabled={connectionStatus === 'connecting'}
                >
                  <div className="flex items-center">
                    {wallet.iconComponent}
                    <div className="text-left">
                      <p className="font-medium text-white">{t(wallet.id)}</p>
                      <p className="text-xs text-gray-400">{getNetworkTranslation(wallet.network)}</p>
                    </div>
                  </div>
                  {connectionStatus === 'connecting' && selectedWalletType === wallet.id ? (
                    <RefreshCw className="h-4 w-4 text-purple-400 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  )}
                </Button>
              ))}
            </div>
            
            <div className="text-xs text-gray-400 border-t border-gray-800 pt-4 mt-2 flex items-center justify-between">
              <div className="flex items-center">
                <Info className="h-3 w-3 mr-1" />
                {t('terms')}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs flex items-center gap-1 text-gray-400 hover:text-white"
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              >
                <Globe className="h-3 w-3" />
                {currentLanguage.toUpperCase()}
              </Button>
            </div>
            
            {showLanguageSelector && (
              <div className="absolute right-4 bottom-12 bg-gray-800 rounded-md shadow-lg p-2 z-10 max-h-40 overflow-y-auto">
                {Object.keys(walletTranslations).map((lang) => (
                  <button
                    key={lang}
                    className={`block w-full text-left px-3 py-1 text-sm rounded-sm ${
                      currentLanguage === lang ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Card className="bg-black/40 border border-purple-500/30 text-white w-full max-w-md hover:border-purple-500/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-purple-400" />
            <span>{t('connected')}: {selectedWallet}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-green-500/80 px-2 py-1 rounded-full text-xs flex items-center">
              <CheckCircle className="mr-1 h-3 w-3" /> {t('activeStatus')}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs flex items-center gap-1 text-gray-400 hover:text-white p-1"
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              <Globe className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {showBalances && (
        <CardContent>
          <h3 className="text-sm text-gray-400 mb-2 flex items-center">
            <Coins className="mr-1 h-3 w-3" /> {t('yourBalance')}
          </h3>
          <div className="space-y-2">
            {Object.entries(balances).map(([token, amount]) => (
              <HoverCard key={token}>
                <HoverCardTrigger asChild>
                  <div className="flex justify-between items-center p-2 bg-black/30 rounded-lg hover:bg-black/50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${token === 'QNTM' ? 'bg-purple-500' : 'bg-gray-700'}`}>
                        {token.charAt(0)}
                      </div>
                      <span>{token}</span>
                    </div>
                    <span className="font-medium">{amount}</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="bg-gray-900 border border-purple-500/30 text-white">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Value (USD):</span>
                      <span className="font-medium">${
                        token === 'QNTM' ? 
                          (parseFloat(amount) * 2.85).toFixed(2) : 
                        token === 'BTC' ? 
                          (parseFloat(amount) * 65000).toFixed(2) : 
                        token === 'ETH' ? 
                          (parseFloat(amount) * 3500).toFixed(2) : 
                        token === 'SOL' ? 
                          (parseFloat(amount) * 145).toFixed(2) : 
                          parseFloat(amount).toFixed(2)
                      }</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Network:</span>
                      <span className="font-medium">{
                        token === 'ETH' ? 'Ethereum' : 
                        token === 'SOL' ? 'Solana' : 
                        token === 'BTC' ? 'Bitcoin' : 
                        token === 'QNTM' ? 'Quantum Network' : 
                        'Tether'
                      }</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Protected by Quantum-resistant encryption</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-3 mb-2">
            <h4 className="text-sm text-gray-400">{t('balance')}</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-gray-400 text-xs flex items-center gap-1 hover:text-white"
              onClick={refreshBalance}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RotateCw className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              {t('refresh')}
            </Button>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button className="w-1/2 bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              {t('send')}
            </Button>
            <Button className="w-1/2 bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              {t('receive')}
            </Button>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-3 border-red-500/30 text-red-400 hover:bg-red-950/30 hover:text-red-300 flex items-center justify-center gap-2"
            onClick={handleDisconnect}
          >
            <X className="h-4 w-4" />
            {t('disconnect')}
          </Button>
        </CardContent>
      )}
      
      {showLanguageSelector && (
        <div className="absolute right-4 top-12 bg-gray-800 rounded-md shadow-lg p-2 z-10 max-h-40 overflow-y-auto">
          {Object.keys(walletTranslations).map((lang) => (
            <button
              key={lang}
              className={`block w-full text-left px-3 py-1 text-sm rounded-sm ${
                currentLanguage === lang ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => handleLanguageChange(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
