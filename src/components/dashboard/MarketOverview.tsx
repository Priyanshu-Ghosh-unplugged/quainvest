import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Flame, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { useCoinPrice, useNetworkStats } from "@/hooks/useQuaiData";

interface MarketToken {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change24h: number;
  volume24h: number;
  sparkline: number[];
  isTrending?: boolean;
}

export const MarketOverview = () => {
  const navigate = useNavigate();
  const { data: coinPrice, isLoading: priceLoading, isError } = useCoinPrice();
  const { data: networkStats } = useNetworkStats();

  // Build QUAI token from live data
  const quaiPrice = coinPrice?.result?.coin_usd 
    ? parseFloat(coinPrice.result.coin_usd) 
    : 0;
  
  const totalTransactions = networkStats?.total_transactions 
    ? parseInt(networkStats.total_transactions) 
    : 0;

  const quaiToken: MarketToken = {
    id: "1",
    symbol: "QUAI",
    name: "Quai Network",
    logo: "🔷",
    price: quaiPrice,
    change24h: 0, // Historical data needed for real change
    volume24h: totalTransactions,
    sparkline: quaiPrice > 0 ? [quaiPrice * 0.95, quaiPrice * 0.97, quaiPrice * 0.96, quaiPrice * 0.98, quaiPrice * 0.99, quaiPrice * 1.01, quaiPrice] : [],
    isTrending: true,
  };

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to load market data</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-card border border-border p-6 card-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Market Overview</h3>
          {priceLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <button 
          onClick={() => navigate("/markets")}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View Markets
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {quaiPrice > 0 ? (
          <TokenCard token={quaiToken} index={0} />
        ) : priceLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Price data unavailable</p>
            <p className="text-sm">Check network connection</p>
          </div>
        )}
      </div>

      {/* Network Stats */}
      {networkStats && (
        <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Blocks</p>
            <p className="font-semibold mono">{parseInt(networkStats.total_blocks || "0").toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Transactions</p>
            <p className="font-semibold mono">{parseInt(networkStats.total_transactions || "0").toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Addresses</p>
            <p className="font-semibold mono">{parseInt(networkStats.total_addresses || "0").toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Transactions Today</p>
            <p className="font-semibold mono">{parseInt(networkStats.transactions_today || "0").toLocaleString()}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface TokenCardProps {
  token: MarketToken;
  index: number;
}

const TokenCard = ({ token, index }: TokenCardProps) => {
  const isPositive = token.change24h >= 0;
  const sparklineData = token.sparkline.map((value) => ({ value }));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group"
    >
      {/* Token Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg flex-shrink-0">
          {token.logo}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground">{token.symbol}</p>
            {token.isTrending && (
              <Flame className="w-3.5 h-3.5 text-warning" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{token.name}</p>
        </div>
      </div>

      {/* Sparkline */}
      {sparklineData.length > 0 && (
        <div className="w-16 h-8 hidden sm:block">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${token.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="0%" 
                    stopColor={isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 72%, 55%)"} 
                    stopOpacity={0.3}
                  />
                  <stop 
                    offset="100%" 
                    stopColor={isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 72%, 55%)"} 
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 72%, 55%)"}
                strokeWidth={1.5}
                fill={`url(#gradient-${token.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Price & Change */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold mono text-foreground">
          ${token.price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
        </p>
        <div className={cn(
          "flex items-center justify-end gap-1 text-xs font-medium",
          isPositive ? "text-gain" : "text-loss"
        )}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isPositive ? "+" : ""}{token.change24h.toFixed(2)}%
        </div>
      </div>
    </motion.div>
  );
};
