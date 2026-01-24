import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Eye, EyeOff, Wallet, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";
import { usePortfolioData } from "@/hooks/useQuaiData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const PortfolioOverview = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { address, isConnected, connect, isConnecting } = useWallet();
  const { 
    totalValue, 
    quaiBalance, 
    quaiPrice, 
    tokens, 
    isLoading,
    isError
  } = usePortfolioData(address || undefined);

  const totalAssets = (tokens.data?.items?.length || 0) + (quaiBalance > 0 ? 1 : 0);

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 card-shadow"
      >
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Connect your Quai Network wallet to view your portfolio, track holdings, and monitor transactions in real-time.
            </p>
          </div>
          <Button 
            onClick={connect} 
            disabled={isConnecting}
            className="mt-2"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </motion.div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-12 w-64 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to load portfolio data. Please try again.</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 card-shadow"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground">Total Portfolio Value</h2>
          <button
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            {isBalanceVisible ? (
              <Eye className="w-4 h-4 text-muted-foreground" />
            ) : (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Main Value */}
        <div className="flex items-baseline gap-3 mb-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isBalanceVisible ? (
              <span className="mono">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            ) : (
              <span>$••••••</span>
            )}
          </motion.h1>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <StatCard 
            label="QUAI Balance" 
            value={`${quaiBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} QUAI`} 
          />
          <StatCard 
            label="QUAI Value" 
            value={`$${(quaiBalance * quaiPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            isPositive 
          />
          <StatCard 
            label="QUAI Price" 
            value={quaiPrice > 0 ? `$${quaiPrice.toFixed(4)}` : "N/A"} 
          />
          <StatCard 
            label="Total Assets" 
            value={totalAssets.toString()} 
          />
        </div>
      </div>
    </motion.div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  isPositive?: boolean;
}

const StatCard = ({ label, value, isPositive }: StatCardProps) => (
  <div className="text-center md:text-left">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className={cn(
      "font-semibold mono",
      isPositive !== undefined && (isPositive ? "text-gain" : "text-loss"),
      isPositive === undefined && "text-foreground"
    )}>
      {value}
    </p>
  </div>
);
