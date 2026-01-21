import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "buy" | "sell" | "swap" | "receive";
  asset: string;
  amount: number;
  value: number;
  status: "completed" | "pending";
  timestamp: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "buy",
    asset: "QUAI",
    amount: 500,
    value: 1225,
    status: "completed",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    type: "swap",
    asset: "ETH → QUAI",
    amount: 0.5,
    value: 1622.83,
    status: "completed",
    timestamp: "1 hour ago",
  },
  {
    id: "3",
    type: "sell",
    asset: "BTC",
    amount: 0.02,
    value: 865.14,
    status: "pending",
    timestamp: "2 hours ago",
  },
  {
    id: "4",
    type: "receive",
    asset: "USDC",
    amount: 2500,
    value: 2500,
    status: "completed",
    timestamp: "1 day ago",
  },
];

const getTransactionIcon = (type: Transaction["type"]) => {
  switch (type) {
    case "buy":
    case "receive":
      return ArrowDownLeft;
    case "sell":
      return ArrowUpRight;
    case "swap":
      return RefreshCw;
  }
};

const getTransactionColor = (type: Transaction["type"]) => {
  switch (type) {
    case "buy":
    case "receive":
      return "bg-success/10 text-gain";
    case "sell":
      return "bg-destructive/10 text-loss";
    case "swap":
      return "bg-chart-4/10 text-chart-4";
  }
};

export const RecentActivity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-2xl bg-card border border-border p-6 card-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((tx, index) => {
          const Icon = getTransactionIcon(tx.type);
          const colorClass = getTransactionColor(tx.type);
          
          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-4"
            >
              {/* Icon */}
              <div className={cn("p-2.5 rounded-xl", colorClass)}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground capitalize">{tx.type}</p>
                  {tx.status === "completed" ? (
                    <CheckCircle className="w-3.5 h-3.5 text-gain" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-warning animate-pulse" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {tx.amount} {tx.asset}
                </p>
              </div>

              {/* Value & Time */}
              <div className="text-right flex-shrink-0">
                <p className="font-medium mono text-foreground">
                  ${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">{tx.timestamp}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
