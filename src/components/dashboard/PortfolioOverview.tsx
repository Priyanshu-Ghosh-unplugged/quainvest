import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const PortfolioOverview = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  
  const portfolioValue = 127845.32;
  const change24h = 2847.56;
  const changePercent = 2.28;
  const isPositive = changePercent > 0;

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
          <StatCard label="Today's P&L" value="+$1,234.56" isPositive />
          <StatCard label="All Time P&L" value="+$12,845.32" isPositive />
          <StatCard label="Best Performer" value="QUAI +15.2%" isPositive />
          <StatCard label="Total Assets" value="12" />
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
