import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, PieChart, Download, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";

const holdings = [
  { symbol: "QUAI", name: "Quai Network", logo: "🔷", amount: 23500, value: 57575, avgCost: 2.10, currentPrice: 2.45, change: 16.67 },
  { symbol: "ETH", name: "Ethereum", logo: "⟠", amount: 9.85, value: 31969.85, avgCost: 2850, currentPrice: 3245.67, change: 13.88 },
  { symbol: "BTC", name: "Bitcoin", logo: "₿", amount: 0.45, value: 19465.55, avgCost: 38000, currentPrice: 43256.78, change: 13.83 },
  { symbol: "USDC", name: "USD Coin", logo: "💵", amount: 12834.92, value: 12834.92, avgCost: 1.0, currentPrice: 1.0, change: 0 },
  { symbol: "LINK", name: "Chainlink", logo: "⬡", amount: 400, value: 6268, avgCost: 17.50, currentPrice: 15.67, change: -10.46 },
];

const allocationData = [
  { name: "QUAI", value: 45, color: "hsl(168, 84%, 45%)" },
  { name: "ETH", value: 25, color: "hsl(262, 83%, 58%)" },
  { name: "BTC", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "USDC", value: 10, color: "hsl(199, 89%, 48%)" },
  { name: "Others", value: 5, color: "hsl(328, 85%, 70%)" },
];

const Portfolio = () => {
  const totalValue = 127845.32;
  const totalGain = 15234.56;
  const gainPercent = 13.5;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground">Manage and track your investments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Value</span>
          </div>
          <p className="text-3xl font-bold mono">${totalValue.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-success/10">
              <TrendingUp className="w-5 h-5 text-gain" />
            </div>
            <span className="text-sm text-muted-foreground">Total Gain</span>
          </div>
          <p className="text-3xl font-bold mono text-gain">+${totalGain.toLocaleString()}</p>
          <p className="text-sm text-gain">+{gainPercent}% all time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-chart-2/10">
              <PieChart className="w-5 h-5 text-chart-2" />
            </div>
            <span className="text-sm text-muted-foreground">Assets</span>
          </div>
          <p className="text-3xl font-bold mono">5</p>
          <p className="text-sm text-muted-foreground">Diversified portfolio</p>
        </motion.div>
      </div>

      {/* Holdings Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-card border border-border overflow-hidden card-shadow"
      >
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold text-foreground">Your Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Asset</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Amount</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Avg Cost</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Current Price</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Value</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">P&L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <motion.tr
                  key={holding.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                        {holding.logo}
                      </div>
                      <div>
                        <p className="font-semibold">{holding.symbol}</p>
                        <p className="text-xs text-muted-foreground">{holding.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium mono">{holding.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-medium mono text-muted-foreground">${holding.avgCost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-medium mono">${holding.currentPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-semibold mono">${holding.value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={cn("font-semibold mono", holding.change >= 0 ? "text-gain" : "text-loss")}>
                      {holding.change >= 0 ? "+" : ""}{holding.change.toFixed(2)}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Portfolio;
