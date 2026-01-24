import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useWallet } from "@/contexts/WalletContext";
import { usePortfolioData } from "@/hooks/useQuaiData";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = [
  "hsl(168, 84%, 45%)",
  "hsl(262, 83%, 58%)",
  "hsl(38, 92%, 50%)",
  "hsl(199, 89%, 48%)",
  "hsl(328, 85%, 70%)",
];

export const AssetAllocation = () => {
  const { address, isConnected, connect, isConnecting } = useWallet();
  const { quaiBalance, quaiValue, tokens, totalValue, isLoading, isError } = usePortfolioData(address || undefined);

  // Build allocation data from real holdings
  const allocationData = isConnected && !isLoading ? [
    ...(quaiBalance > 0 ? [{
      name: "QUAI",
      value: totalValue > 0 ? Math.round((quaiValue / totalValue) * 100) : 100,
      color: COLORS[0],
    }] : []),
    ...(tokens.data?.items?.map((item, index) => {
      const tokenValue = parseFloat(item.value) || 0;
      return {
        name: item.token.symbol || "Unknown",
        value: totalValue > 0 ? Math.round((tokenValue / totalValue) * 100) : 0,
        color: COLORS[(index + 1) % COLORS.length],
      };
    }).filter(item => item.value > 0) || []),
  ] : [];

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Asset Allocation</h3>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Wallet className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">Connect wallet to view allocation</p>
          <Button onClick={connect} disabled={isConnecting} size="sm" variant="outline">
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="flex items-center gap-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Failed to load allocation</span>
        </div>
      </motion.div>
    );
  }

  if (allocationData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Asset Allocation</h3>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Wallet className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No assets found</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl bg-card border border-border p-6 card-shadow"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Asset Allocation</h3>
      
      <div className="flex items-center gap-6">
        {/* Pie Chart */}
        <div className="w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(222, 47%, 10%)",
                  border: "1px solid hsl(222, 30%, 16%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
                itemStyle={{ color: "hsl(210, 40%, 98%)" }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {allocationData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
              <span className="text-sm font-medium mono text-muted-foreground">{item.value}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
