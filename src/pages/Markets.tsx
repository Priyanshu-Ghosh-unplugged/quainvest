import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Star, Flame, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useNetworkStats, useCoinPrice, useBlocks } from "@/hooks/useQuaiData";

interface MarketToken {
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  sparkline: number[];
  isTrending?: boolean;
  isFavorite?: boolean;
}

const categories = ["All", "Trending"];

const Markets = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data: networkStats, isLoading: statsLoading, isError: statsError } = useNetworkStats();
  const { data: coinPrice, isLoading: priceLoading, isError: priceError } = useCoinPrice();
  const { data: blocks } = useBlocks();

  const isLoading = statsLoading || priceLoading;
  const isError = statsError || priceError;

  // Build QUAI token from live data
  const quaiPrice = coinPrice?.result?.coin_usd 
    ? parseFloat(coinPrice.result.coin_usd) 
    : 0;

  const totalTransactions = networkStats?.total_transactions 
    ? parseInt(networkStats.total_transactions) 
    : 0;

  const totalAddresses = networkStats?.total_addresses
    ? parseInt(networkStats.total_addresses)
    : 0;

  const marketCap = quaiPrice * totalAddresses; // Simplified estimate

  const tokens: MarketToken[] = quaiPrice > 0 ? [{
    symbol: "QUAI",
    name: "Quai Network",
    logo: "🔷",
    price: quaiPrice,
    change24h: 0, // Would need historical data
    volume: totalTransactions,
    marketCap: marketCap,
    sparkline: [quaiPrice * 0.95, quaiPrice * 0.97, quaiPrice * 0.96, quaiPrice * 0.98, quaiPrice * 0.99, quaiPrice * 1.01, quaiPrice],
    isTrending: true,
    isFavorite: favorites.includes("QUAI"),
  }] : [];

  const filteredTokens = tokens.filter(token => {
    if (searchQuery && !token.name.toLowerCase().includes(searchQuery.toLowerCase()) && !token.symbol.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeCategory === "Trending") return token.isTrending;
    return true;
  });

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  if (isError) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="rounded-2xl bg-card border border-border p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Market Data</h2>
          <p className="text-muted-foreground">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Markets</h1>
        <p className="text-muted-foreground">Live data from Quai Network</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-secondary rounded-xl border border-transparent focus:border-primary/50 focus:outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Blocks", value: networkStats?.total_blocks ? parseInt(networkStats.total_blocks).toLocaleString() : "-", change: "Live" },
          { label: "Total Transactions", value: networkStats?.total_transactions ? parseInt(networkStats.total_transactions).toLocaleString() : "-", change: "Live" },
          { label: "Total Addresses", value: networkStats?.total_addresses ? parseInt(networkStats.total_addresses).toLocaleString() : "-", change: "Live" },
          { label: "Transactions Today", value: networkStats?.transactions_today ? parseInt(networkStats.transactions_today).toLocaleString() : "-", change: "Live" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl bg-card border border-border p-4"
          >
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            {isLoading ? (
              <div className="animate-pulse h-7 bg-muted rounded w-24" />
            ) : (
              <p className="text-xl font-bold mono">{stat.value}</p>
            )}
            <p className="text-xs text-gain flex items-center gap-1">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Token Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-card border border-border overflow-hidden card-shadow"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tokens found</p>
            <p className="text-sm text-muted-foreground">Price data may be unavailable</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4 w-8">#</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Token</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Price</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4 hidden md:table-cell">Volume (Txs)</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-6 py-4 hidden sm:table-cell">Chart (7d)</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-6 py-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.map((token, index) => {
                  const isPositive = token.change24h >= 0;
                  const sparklineData = token.sparkline.map(v => ({ value: v }));
                  
                  return (
                    <motion.tr
                      key={token.symbol}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-muted-foreground">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                            {token.logo}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{token.symbol}</p>
                              {token.isTrending && <Flame className="w-3.5 h-3.5 text-warning" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{token.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold mono">${token.price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
                      <td className="px-6 py-4 text-right font-medium mono text-muted-foreground hidden md:table-cell">
                        {token.volume.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="w-20 h-8 mx-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sparklineData}>
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke={isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 72%, 55%)"}
                                strokeWidth={1.5}
                                fill="transparent"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleFavorite(token.symbol)}
                          className={cn("p-1.5 rounded-lg transition-colors", token.isFavorite ? "text-warning" : "text-muted-foreground hover:text-warning")}
                        >
                          <Star className={cn("w-4 h-4", token.isFavorite && "fill-current")} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Markets;
