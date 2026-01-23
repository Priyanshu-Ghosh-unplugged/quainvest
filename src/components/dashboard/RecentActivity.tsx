import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, CheckCircle, Clock, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";
import { useAddressTransactions, useCoinPrice } from "@/hooks/useQuaiData";
import { Skeleton } from "@/components/ui/skeleton";
import { weiToQuai, shortenAddress } from "@/lib/api/quaiscan";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  type: "buy" | "sell" | "swap" | "receive" | "send";
  asset: string;
  amount: number;
  value: number;
  status: "completed" | "pending";
  timestamp: string;
}

const mockTransactions: Transaction[] = [
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
    case "send":
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
    case "send":
      return "bg-destructive/10 text-loss";
    case "swap":
      return "bg-chart-4/10 text-chart-4";
  }
};

export const RecentActivity = () => {
  const { address, isConnected } = useWallet();
  const { data: txData, isLoading } = useAddressTransactions(address || undefined);
  const { data: coinPrice } = useCoinPrice();

  const quaiPrice = coinPrice?.result?.quai_usd 
    ? parseFloat(coinPrice.result.quai_usd) 
    : 2.45;

  // Transform API transactions to display format
  const transactions: Transaction[] = isConnected && txData?.items 
    ? txData.items.slice(0, 5).map((tx) => {
        const isReceive = tx.to?.hash?.toLowerCase() === address?.toLowerCase();
        const quaiAmount = weiToQuai(tx.value);
        
        return {
          id: tx.hash,
          type: isReceive ? "receive" : "send",
          asset: "QUAI",
          amount: quaiAmount,
          value: quaiAmount * quaiPrice,
          status: tx.result === "success" ? "completed" : "pending",
          timestamp: tx.timestamp 
            ? formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })
            : "Unknown",
        };
      })
    : mockTransactions;

  if (isConnected && isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <Skeleton className="h-6 w-36 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-2xl bg-card border border-border p-6 card-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
          {!isConnected && (
            <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded">Demo</span>
          )}
        </div>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center">
          <Wallet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      ) : (
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
                    {tx.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {tx.asset}
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
      )}
    </motion.div>
  );
};
