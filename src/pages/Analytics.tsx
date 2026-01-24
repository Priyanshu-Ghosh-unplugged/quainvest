import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity, Calendar, Download, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";
import { useAddressTransactions, useNetworkStats, useCoinPrice, useBlocks } from "@/hooks/useQuaiData";
import { weiToQuai } from "@/lib/api/quaiscan";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("1M");
  const { address, isConnected, connect, isConnecting } = useWallet();
  
  const { data: networkStats, isLoading: statsLoading, isError: statsError } = useNetworkStats();
  const { data: coinPrice, isLoading: priceLoading } = useCoinPrice();
  const { data: transactions, isLoading: txLoading, isError: txError } = useAddressTransactions(address || undefined);
  const { data: blocks, isLoading: blocksLoading } = useBlocks();

  const isLoading = statsLoading || priceLoading || blocksLoading;
  const isError = statsError;

  const quaiPrice = coinPrice?.result?.coin_usd 
    ? parseFloat(coinPrice.result.coin_usd) 
    : 0;

  // Calculate stats from transactions
  const txList = transactions?.items || [];
  const totalTxValue = txList.reduce((sum, tx) => sum + weiToQuai(tx.value), 0);
  const totalTxValueUsd = totalTxValue * quaiPrice;
  const avgTxValue = txList.length > 0 ? totalTxValueUsd / txList.length : 0;

  // Build block activity chart from real blocks
  const blockActivityData = blocks?.items?.slice(0, 20).map((block, index) => ({
    block: `#${block.number}`,
    txCount: block.tx_count || 0,
    gasUsed: parseInt(block.gas_used || "0") / 1e9,
  })).reverse() || [];

  // Build transaction volume from real data
  const txVolumeData = txList.slice(0, 10).map((tx, index) => ({
    tx: `Tx ${index + 1}`,
    value: weiToQuai(tx.value) * quaiPrice,
    type: tx.to?.hash?.toLowerCase() === address?.toLowerCase() ? "receive" : "send",
  }));

  if (!isConnected) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Insights into your portfolio performance</p>
        </motion.div>

        <div className="rounded-2xl bg-card border border-border p-12 text-center">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Connect your wallet to view detailed analytics about your transactions and portfolio performance.
          </p>
          <Button onClick={connect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="rounded-2xl bg-card border border-border p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Analytics</h2>
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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Live data from Quai Network</p>
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
          { label: "Total Tx Volume", value: `$${totalTxValueUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, subtext: `${txList.length} transactions`, icon: TrendingUp, color: "text-gain" },
          { label: "QUAI Price", value: quaiPrice > 0 ? `$${quaiPrice.toFixed(4)}` : "N/A", subtext: "Live price", icon: Calendar, color: "text-primary" },
          { label: "Transactions", value: txList.length.toString(), subtext: "In your wallet", icon: Activity, color: "text-chart-4" },
          { label: "Avg. Transaction", value: avgTxValue > 0 ? `$${avgTxValue.toFixed(2)}` : "$0", subtext: "Per transaction", icon: BarChart3, color: "text-warning" },
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
            {isLoading ? (
              <div className="animate-pulse h-8 bg-muted rounded w-20" />
            ) : (
              <>
                <p className={cn("text-2xl font-bold mono", stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Network Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Network Block Activity</h3>
            <p className="text-sm text-muted-foreground">Transaction count per block (Live)</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="h-72">
          {blocksLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : blockActivityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={blockActivityData}>
                <defs>
                  <linearGradient id="blockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(168, 84%, 45%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(168, 84%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="block" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(222, 47%, 10%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="txCount" stroke="hsl(168, 84%, 45%)" strokeWidth={2} fill="url(#blockGradient)" name="Transactions" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No block data available
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <h3 className="font-semibold mb-6">Your Transaction Values</h3>
          <div className="h-56">
            {txLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : txVolumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={txVolumeData}>
                  <XAxis dataKey="tx" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                  <Tooltip contentStyle={{ background: "hsl(222, 47%, 10%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(262, 83%, 58%)" strokeWidth={2} fill="hsl(262, 83%, 58%)" fillOpacity={0.1} name="Value (USD)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No transactions found</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Network Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <h3 className="font-semibold mb-6">Network Overview</h3>
          <div className="space-y-4">
            {[
              { label: "Total Blocks", value: networkStats?.total_blocks ? parseInt(networkStats.total_blocks).toLocaleString() : "-" },
              { label: "Total Transactions", value: networkStats?.total_transactions ? parseInt(networkStats.total_transactions).toLocaleString() : "-" },
              { label: "Total Addresses", value: networkStats?.total_addresses ? parseInt(networkStats.total_addresses).toLocaleString() : "-" },
              { label: "Transactions Today", value: networkStats?.transactions_today ? parseInt(networkStats.transactions_today).toLocaleString() : "-" },
              { label: "Network Utilization", value: networkStats?.network_utilization_percentage ? `${networkStats.network_utilization_percentage.toFixed(2)}%` : "-" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                {statsLoading ? (
                  <div className="animate-pulse h-5 bg-muted rounded w-20" />
                ) : (
                  <span className="font-semibold mono">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
