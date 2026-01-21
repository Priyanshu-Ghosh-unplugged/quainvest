import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Star, Flame, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const tokens = [
  { symbol: "QUAI", name: "Quai Network", logo: "🔷", price: 2.45, change24h: 5.23, volume: 12500000, marketCap: 245000000, sparkline: [1.8, 2.1, 2.0, 2.3, 2.2, 2.4, 2.45], isTrending: true, isFavorite: true },
  { symbol: "ETH", name: "Ethereum", logo: "⟠", price: 3245.67, change24h: -1.24, volume: 8900000000, marketCap: 390000000000, sparkline: [3300, 3280, 3290, 3260, 3250, 3240, 3245], isTrending: false, isFavorite: true },
  { symbol: "BTC", name: "Bitcoin", logo: "₿", price: 43256.78, change24h: 2.15, volume: 25000000000, marketCap: 850000000000, sparkline: [42000, 42500, 42800, 43100, 43000, 43200, 43256], isTrending: true, isFavorite: false },
  { symbol: "SOL", name: "Solana", logo: "◎", price: 98.45, change24h: 4.87, volume: 1200000000, marketCap: 42000000000, sparkline: [92, 94, 93, 96, 95, 97, 98.45], isTrending: true, isFavorite: false },
  { symbol: "LINK", name: "Chainlink", logo: "⬡", price: 15.67, change24h: 3.45, volume: 450000000, marketCap: 9200000000, sparkline: [14.5, 15, 14.8, 15.2, 15.4, 15.5, 15.67], isTrending: false, isFavorite: false },
  { symbol: "AVAX", name: "Avalanche", logo: "🔺", price: 37.82, change24h: -2.34, volume: 380000000, marketCap: 14000000000, sparkline: [39, 38.5, 38.2, 38, 37.5, 37.8, 37.82], isTrending: false, isFavorite: false },
  { symbol: "MATIC", name: "Polygon", logo: "💜", price: 0.89, change24h: 1.23, volume: 290000000, marketCap: 8800000000, sparkline: [0.85, 0.86, 0.87, 0.88, 0.87, 0.88, 0.89], isTrending: false, isFavorite: false },
  { symbol: "DOT", name: "Polkadot", logo: "⬣", price: 7.45, change24h: -0.89, volume: 220000000, marketCap: 9500000000, sparkline: [7.6, 7.55, 7.5, 7.48, 7.44, 7.42, 7.45], isTrending: false, isFavorite: false },
];

const categories = ["All", "Trending", "Favorites", "Top Gainers", "Top Losers"];

const Markets = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = tokens.filter(token => {
    if (searchQuery && !token.name.toLowerCase().includes(searchQuery.toLowerCase()) && !token.symbol.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeCategory === "Trending") return token.isTrending;
    if (activeCategory === "Favorites") return token.isFavorite;
    if (activeCategory === "Top Gainers") return token.change24h > 0;
    if (activeCategory === "Top Losers") return token.change24h < 0;
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Markets</h1>
        <p className="text-muted-foreground">Explore tokens on Quai Network</p>
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

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Market Cap", value: "$1.42T", change: "+2.4%" },
          { label: "24h Volume", value: "$48.2B", change: "+5.1%" },
          { label: "QUAI Dominance", value: "0.02%", change: "+0.3%" },
          { label: "Active Pairs", value: "156", change: "+3" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl bg-card border border-border p-4"
          >
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-xl font-bold mono">{stat.value}</p>
            <p className="text-xs text-gain">{stat.change}</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4 w-8">#</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Token</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Price</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">24h %</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4 hidden md:table-cell">Volume (24h)</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4 hidden lg:table-cell">Market Cap</th>
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
                    <td className="px-6 py-4 text-right font-semibold mono">${token.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn("font-medium flex items-center justify-end gap-1", isPositive ? "text-gain" : "text-loss")}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPositive ? "+" : ""}{token.change24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium mono text-muted-foreground hidden md:table-cell">
                      ${(token.volume / 1e6).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 text-right font-medium mono hidden lg:table-cell">
                      ${(token.marketCap / 1e9).toFixed(2)}B
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
                      <button className={cn("p-1.5 rounded-lg transition-colors", token.isFavorite ? "text-warning" : "text-muted-foreground hover:text-warning")}>
                        <Star className={cn("w-4 h-4", token.isFavorite && "fill-current")} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Markets;
