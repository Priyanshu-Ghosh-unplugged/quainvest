import { motion } from "framer-motion";
import { Shield, AlertTriangle, TrendingDown, PieChart, CheckCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";

const riskMetrics = [
  { label: "Portfolio Risk Score", value: 42, status: "moderate", description: "Based on volatility and concentration" },
  { label: "Volatility (30d)", value: "18.5%", status: "moderate", description: "Standard deviation of returns" },
  { label: "Sharpe Ratio", value: "1.42", status: "good", description: "Risk-adjusted return measure" },
  { label: "Max Drawdown", value: "-12.3%", status: "good", description: "Largest peak-to-trough decline" },
];

const riskFactors = [
  { factor: "Concentration Risk", level: "high", value: 45, description: "45% of portfolio in single asset (QUAI)" },
  { factor: "Liquidity Risk", level: "low", value: 15, description: "All assets have high trading volume" },
  { factor: "Volatility Risk", level: "moderate", value: 35, description: "Portfolio contains volatile crypto assets" },
  { factor: "Correlation Risk", level: "moderate", value: 40, description: "Assets show moderate correlation" },
];

const recommendations = [
  { type: "warning", title: "Reduce QUAI concentration", description: "Consider reducing QUAI holdings to below 30% for better diversification" },
  { type: "info", title: "Add stablecoin allocation", description: "Increase USDC holdings to 15-20% to reduce volatility" },
  { type: "success", title: "Good liquidity profile", description: "All your assets have strong trading volume" },
];

const Risk = () => {
  const overallRiskData = [{ name: "Risk", value: 42, fill: "hsl(38, 92%, 50%)" }];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Risk Management</h1>
        <p className="text-muted-foreground">Monitor and manage your portfolio risk</p>
      </motion.div>

      {/* Risk Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <h3 className="font-semibold mb-4">Overall Risk Score</h3>
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={overallRiskData} startAngle={180} endAngle={0}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-warning">42</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
            </div>
            <div className="mt-4 px-4 py-2 bg-warning/10 rounded-lg">
              <span className="text-sm font-medium text-warning">Moderate Risk</span>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Your portfolio has moderate risk exposure. Consider diversifying to reduce concentration risk.
            </p>
          </div>
        </motion.div>

        {/* Risk Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <h3 className="font-semibold mb-6">Risk Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {riskMetrics.map((metric, i) => (
              <div key={metric.label} className="p-4 bg-secondary/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    metric.status === "good" && "bg-success/10 text-gain",
                    metric.status === "moderate" && "bg-warning/10 text-warning",
                    metric.status === "high" && "bg-destructive/10 text-loss"
                  )}>
                    {metric.status}
                  </span>
                </div>
                <p className="text-2xl font-bold mono">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Risk Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <h3 className="font-semibold mb-6">Risk Factor Analysis</h3>
        <div className="space-y-4">
          {riskFactors.map((item) => (
            <div key={item.factor} className="flex items-center gap-4">
              <div className={cn(
                "p-2 rounded-lg",
                item.level === "low" && "bg-success/10",
                item.level === "moderate" && "bg-warning/10",
                item.level === "high" && "bg-destructive/10"
              )}>
                {item.level === "low" && <CheckCircle className="w-4 h-4 text-gain" />}
                {item.level === "moderate" && <AlertTriangle className="w-4 h-4 text-warning" />}
                {item.level === "high" && <XCircle className="w-4 h-4 text-loss" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{item.factor}</span>
                  <span className={cn(
                    "text-xs font-medium uppercase",
                    item.level === "low" && "text-gain",
                    item.level === "moderate" && "text-warning",
                    item.level === "high" && "text-loss"
                  )}>
                    {item.level}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-1">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      item.level === "low" && "bg-gain",
                      item.level === "moderate" && "bg-warning",
                      item.level === "high" && "bg-loss"
                    )}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <h3 className="font-semibold mb-6">Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={i} className={cn(
              "p-4 rounded-xl border-l-4",
              rec.type === "warning" && "bg-warning/5 border-warning",
              rec.type === "info" && "bg-chart-4/5 border-chart-4",
              rec.type === "success" && "bg-success/5 border-success"
            )}>
              <h4 className="font-medium mb-1">{rec.title}</h4>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Risk;
