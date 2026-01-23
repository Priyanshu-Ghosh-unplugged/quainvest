import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";
import { usePortfolioData } from "@/hooks/useQuaiData";
import { Skeleton } from "@/components/ui/skeleton";

export const PortfolioOverview = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { address, isConnected } = useWallet();
  const { 
    totalValue, 
    quaiBalance, 
    quaiPrice, 
    tokens, 
    isLoading 
  } = usePortfolioData(address || undefined);

  // Mock data for demo when wallet not connected
  const portfolioValue = isConnected ? totalValue : 127845.32;
  const change24h = 2847.56;
  const changePercent = 2.28;
  const isPositive = changePercent > 0;
  const totalAssets = isConnected ? (tokens.data?.items?.length || 0) + 1 : 12;

  if (isConnected && isLoading) {
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
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">Total Portfolio Value</h2>
            {!isConnected && (
              <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded">Demo</span>
            )}
          </div>
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
              <span className="mono">${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            ) : (
              <span>$••••••</span>
            )}
          </motion.h1>
        </div>

        {/* Change Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
            isPositive ? "bg-success/10" : "bg-destructive/10"
          )}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-gain" />
            ) : (
              <TrendingDown className="w-4 h-4 text-loss" />
            )}
            <span className={cn("font-semibold mono", isPositive ? "text-gain" : "text-loss")}>
              {isPositive ? "+" : "-"}${Math.abs(change24h).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className={cn("text-sm font-medium", isPositive ? "text-gain" : "text-loss")}>
              ({isPositive ? "+" : ""}{changePercent}%)
            </span>
          </div>
          <span className="text-sm text-muted-foreground">Past 24 hours</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          {isConnected && quaiBalance > 0 ? (
            <>
              <StatCard label="QUAI Balance" value={`${quaiBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} QUAI`} />
              <StatCard label="QUAI Value" value={`$${(quaiBalance * quaiPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} isPositive />
              <StatCard label="QUAI Price" value={`$${quaiPrice.toFixed(2)}`} />
              <StatCard label="Total Assets" value={totalAssets.toString()} />
            </>
          ) : (
            <>
              <StatCard label="Today's P&L" value="+$1,234.56" isPositive />
              <StatCard label="All Time P&L" value="+$12,845.32" isPositive />
              <StatCard label="Best Performer" value="QUAI +15.2%" isPositive />
              <StatCard label="Total Assets" value={totalAssets.toString()} />
            </>
          )}
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
