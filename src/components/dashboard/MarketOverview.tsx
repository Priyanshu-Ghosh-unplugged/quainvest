import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Flame, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

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

const marketTokens: MarketToken[] = [
  {
    id: "1",
    symbol: "QUAI",
    name: "Quai Network",
    logo: "🔷",
    price: 2.45,
    change24h: 5.23,
    volume24h: 12500000,
    sparkline: [1.8, 2.1, 2.0, 2.3, 2.2, 2.4, 2.45],
    isTrending: true,
  },
  {
    id: "2",
    symbol: "ETH",
    name: "Ethereum",
    logo: "⟠",
    price: 3245.67,
    change24h: -1.24,
    volume24h: 8900000000,
    sparkline: [3300, 3280, 3290, 3260, 3250, 3240, 3245],
  },
  {
    id: "3",
    symbol: "BTC",
    name: "Bitcoin",
    logo: "₿",
    price: 43256.78,
    change24h: 2.15,
    volume24h: 25000000000,
    sparkline: [42000, 42500, 42800, 43100, 43000, 43200, 43256],
    isTrending: true,
  },
  {
    id: "4",
    symbol: "SOL",
    name: "Solana",
    logo: "◎",
    price: 98.45,
    change24h: 4.87,
    volume24h: 1200000000,
    sparkline: [92, 94, 93, 96, 95, 97, 98.45],
  },
];

export const MarketOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-card border border-border p-6 card-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Market Overview</h3>
        <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
          View Markets
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {marketTokens.map((token, index) => (
          <TokenCard key={token.id} token={token} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

interface TokenCardProps {
  token: MarketToken;
  index: number;
}

const TokenCard = ({ token, index }: TokenCardProps) => {
  const isPositive = token.change24h >= 0;
  const sparklineData = token.sparkline.map((value, i) => ({ value }));

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

      {/* Price & Change */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold mono text-foreground">
          ${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
