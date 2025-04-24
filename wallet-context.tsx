import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, getWalletAddress, getWalletBalance, isMetaMaskInstalled } from '@/lib/ethers';
import { useToast } from '@/hooks/use-toast';
import { getTranslationByNamespace } from '@/lib/translations';
import { toast } from 'sonner';

export type WalletType = 'metamask' | 'phantom' | 'trust' | 'walletconnect' | null;

export interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  timestamp: string;
  usdValue: number;
  to?: string;
  from?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface WalletContextType {
  walletAddress: string | null;
  walletType: WalletType;
  isConnected: boolean;
  isConnecting: boolean;
  connectToWallet: (type: WalletType) => Promise<boolean>;
  disconnectWallet: () => void;
  balance: number;
  refreshBalance: () => Promise<void>;
  isRefreshingBalance: boolean;
  transactions: Transaction[];
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    localStorage.getItem('app-language') || 'en'
  );
  const { toast: uiToast } = useToast();

  // Load mock transactions
  useEffect(() => {
    if (walletAddress) {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'received',
          amount: 25,
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          usdValue: 31,
          from: '0x123...456',
          to: walletAddress,
          status: 'completed'
        },
        {
          id: '2',
          type: 'sent',
          amount: 10,
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          usdValue: 12.4,
          from: walletAddress,
          to: '0x789...012',
          status: 'completed'
        },
        {
          id: '3',
          type: 'sent',
          amount: 5,
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          usdValue: 6.2,
          from: walletAddress,
          to: '0xabc...def',
          status: 'completed'
        }
      ];
      
      setTransactions(mockTransactions);
    } else {
      setTransactions([]);
    }
  }, [walletAddress]);

  // Check for existing wallet connection on load
  useEffect(() => {
    const checkConnection = async () => {
      const savedWalletType = localStorage.getItem('walletType') as WalletType;
      
      if (savedWalletType) {
        try {
          setIsConnecting(true);
          
          if (savedWalletType === 'metamask' && !isMetaMaskInstalled()) {
            localStorage.removeItem('walletType');
            setIsConnecting(false);
            return;
          }
          
          const address = await getWalletAddress(savedWalletType);
          
          if (address) {
            setWalletAddress(address);
            setWalletType(savedWalletType);
            
            const walletBalance = await getWalletBalance(address);
            setBalance(walletBalance);
          } else if (savedWalletType === 'metamask') {
            localStorage.removeItem('walletType');
          }
        } catch (error) {
          console.error('Failed to reconnect wallet:', error);
          localStorage.removeItem('walletType');
        } finally {
          setIsConnecting(false);
        }
      }
    };

    checkConnection();
  }, []);

  const connectToWallet = async (type: WalletType): Promise<boolean> => {
    if (!type) return false;
    
    setIsConnecting(true);
    
    try {
      if (type === 'metamask' && !isMetaMaskInstalled()) {
        const t = (key: string) => getTranslationByNamespace(currentLanguage, 'wallet', key);
        
        uiToast({
          variant: "destructive",
          title: t('metamaskNotInstalled'),
          description: t('installMetamaskDescription'),
        });
        
        toast.error(t('metamaskNotInstalled'), {
          description: t('installMetamaskDescription'),
          action: {
            label: t('installNow'),
            onClick: () => window.open('https://metamask.io/download.html', '_blank'),
          },
        });
        
        return false;
      }
      
      const address = await connectWallet(type);
      
      if (address) {
        setWalletAddress(address);
        setWalletType(type);
        
        localStorage.setItem('walletType', type);
        
        const walletBalance = await getWalletBalance(address);
        setBalance(walletBalance);
        
        const t = (key: string) => getTranslationByNamespace(currentLanguage, 'wallet', key);
        
        uiToast({
          title: t('walletConnected'),
          description: `${t('successfullyConnected')} ${type}.`,
        });
        
        return true;
      } else {
        const t = (key: string) => getTranslationByNamespace(currentLanguage, 'wallet', key);
        
        uiToast({
          variant: "destructive",
          title: t('connectionFailed'),
          description: `${t('couldNotConnect')} ${type}. ${t('pleaseTryAgain')}`,
        });
        
        return false;
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      
      const t = (key: string) => getTranslationByNamespace(currentLanguage, 'wallet', key);
      
      uiToast({
        variant: "destructive",
        title: t('connectionError'),
        description: `${t('errorConnecting')} ${type}. ${(error as Error).message}`,
      });
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const refreshBalance = async (): Promise<void> => {
    if (!walletAddress) return;
    
    setIsRefreshingBalance(true);
    
    try {
      const walletBalance = await getWalletBalance(walletAddress);
      setBalance(walletBalance);
      
      const t = (key: string) => getTranslationByNamespace(currentLanguage, 'wallet', key);
      
      uiToast({
        title: t('balanceRefreshed'),
        description: t('balanceUpdated'),
      });
    } catch (error) {
      console.error('Error refreshing balance:', error);
      
      const t = (key: string) => getTranslationByNamespace(currentLanguage, 'wallet', key);
      
      uiToast({
        variant: "destructive",
        title: t('refreshFailed'),
        description: t('couldNotRefresh'),
      });
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  const disconnectWallet = (): void => {
    setWalletAddress(null);
    setWalletType(null);
    setBalance(0);
    setTransactions([]);
    
    localStorage.removeItem('walletType');
    
    const t = (key: string) => getTranslationByNamespace(currentLanguage, 'wallet', key);
    
    uiToast({
      title: t('walletDisconnected'),
      description: t('walletDisconnectedDesc'),
    });
  };
  
  const setLanguage = (lang: string): void => {
    setCurrentLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  return (
    <WalletContext.Provider 
      value={{ 
        walletAddress, 
        walletType, 
        isConnected: !!walletAddress, 
        isConnecting,
        connectToWallet, 
        disconnectWallet,
        balance,
        refreshBalance,
        isRefreshingBalance,
        transactions,
        currentLanguage,
        setLanguage
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
