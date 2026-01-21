import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const allocationData = [
  { name: "QUAI", value: 45, color: "hsl(168, 84%, 45%)" },
  { name: "ETH", value: 25, color: "hsl(262, 83%, 58%)" },
  { name: "BTC", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "USDC", value: 10, color: "hsl(199, 89%, 48%)" },
  { name: "Others", value: 5, color: "hsl(328, 85%, 70%)" },
];

export const AssetAllocation = () => {
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
