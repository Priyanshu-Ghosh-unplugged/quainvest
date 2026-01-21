import { motion } from "framer-motion";
import { BarChart3, TrendingUp, PieChart, Activity, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

const performanceData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  portfolio: 100000 + Math.random() * 30000,
  benchmark: 100000 + Math.random() * 20000,
}));

const volumeData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  buy: Math.floor(Math.random() * 50000) + 10000,
  sell: Math.floor(Math.random() * 40000) + 8000,
}));

const profitData = [
  { asset: "QUAI", profit: 8234.56, percentage: 16.7 },
  { asset: "ETH", profit: 4521.32, percentage: 16.5 },
  { asset: "BTC", profit: 2845.67, percentage: 17.1 },
  { asset: "LINK", profit: -234.56, percentage: -3.6 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("1M");

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your portfolio performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
            {["1W", "1M", "3M", "1Y", "ALL"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timeRange === range ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Return", value: "+$15,234", subtext: "+13.5%", icon: TrendingUp, color: "text-gain" },
          { label: "Best Month", value: "+$4,521", subtext: "March 2024", icon: Calendar, color: "text-gain" },
          { label: "Win Rate", value: "72%", subtext: "86 of 119 trades", icon: Activity, color: "text-primary" },
          { label: "Avg. Trade", value: "$1,245", subtext: "Per transaction", icon: BarChart3, color: "text-chart-4" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl bg-card border border-border p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className={cn("text-2xl font-bold mono", stat.color)}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Portfolio Performance</h3>
            <p className="text-sm text-muted-foreground">vs Market Benchmark</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Benchmark</span>
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(168, 84%, 45%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(168, 84%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(222, 47%, 10%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="portfolio" stroke="hsl(168, 84%, 45%)" strokeWidth={2} fill="url(#portfolioGradient)" />
              <Line type="monotone" dataKey="benchmark" stroke="hsl(262, 83%, 58%)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <h3 className="font-semibold mb-6">Trading Volume</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "hsl(222, 47%, 10%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px" }} />
                <Bar dataKey="buy" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sell" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Profit by Asset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <h3 className="font-semibold mb-6">Profit by Asset</h3>
          <div className="space-y-4">
            {profitData.map((item, i) => (
              <div key={item.asset} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">{item.asset}</div>
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", item.profit >= 0 ? "bg-gain" : "bg-loss")}
                    style={{ width: `${Math.min(Math.abs(item.percentage) * 5, 100)}%` }}
                  />
                </div>
                <div className={cn("w-24 text-right font-medium mono", item.profit >= 0 ? "text-gain" : "text-loss")}>
                  {item.profit >= 0 ? "+" : ""}${item.profit.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
