import { motion } from "framer-motion";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const timeframes = ["1D", "7D", "1M", "3M", "1Y", "ALL"];

// Generate sample data
const generateData = (days: number) => {
  const data = [];
  let baseValue = 120000;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    baseValue += (Math.random() - 0.45) * 2000;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.max(baseValue, 100000),
    });
  }
  return data;
};

export const PriceChart = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("1M");
  const data = generateData(30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl bg-card border border-border p-6 card-shadow"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Portfolio Performance</h3>
          <p className="text-sm text-muted-foreground">Track your investment growth</p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTimeframe === tf
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(168, 84%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(168, 84%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              dx={-10}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(222, 47%, 10%)",
                border: "1px solid hsl(222, 30%, 16%)",
                borderRadius: "12px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                padding: "12px 16px",
              }}
              labelStyle={{ color: 'hsl(215, 20%, 55%)', marginBottom: 4 }}
              itemStyle={{ color: 'hsl(210, 40%, 98%)', fontWeight: 600 }}
              formatter={(value: number) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(168, 84%, 45%)"
              strokeWidth={2}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
