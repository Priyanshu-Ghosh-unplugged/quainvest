import { motion } from "framer-motion";
import { Wallet, TrendingUp, PieChart, Download, Filter, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";
import { usePortfolioData } from "@/hooks/useQuaiData";
import { useWallet } from "@/contexts/WalletContext";
import { formatBalance, shortenAddress } from "@/lib/api/quaiscan";

const Portfolio = () => {
  const { address } = useWallet();
  const { 
    totalValue, 
    quaiValue,
    tokenValues,
    tokens, 
    isLoading, 
    isError 
  } = usePortfolioData(address);

  if (!address) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto text-center">
        <div className="rounded-2xl bg-card border border-border p-8">
          <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to view your portfolio.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="rounded-2xl bg-card border border-border p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Portfolio</h2>
          <p className="text-muted-foreground">Could not fetch data for address: {shortenAddress(address)}</p>
        </div>
      </div>
    );
  }

  const allocationData = [
    { name: "QUAI", value: quaiValue, color: "hsl(168, 84%, 45%)" },
    ...(tokens.data?.items.map(item => ({
      name: item.token.symbol,
      value: parseFloat(item.value) || 0,
      color: `hsl(${Math.random() * 360}, 70%, 50%)` // Random color for now
    })) || [])
  ].filter(item => item.value > 0);
  
  const totalAssets = (tokens.data?.items?.length || 0) + (quaiValue > 0 ? 1 : 0);

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
          <p className="text-muted-foreground">Live data for {shortenAddress(address)}</p>
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
          <p className="text-3xl font-bold mono">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
            <span className="text-sm text-muted-foreground">Token Value</span>
          </div>
          <p className="text-3xl font-bold mono text-gain">${tokenValues.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
          <p className="text-3xl font-bold mono">{totalAssets}</p>
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
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Value</th>
              </tr>
            </thead>
            <tbody>
              {tokens.data?.items?.map((holding, index) => (
                <motion.tr
                  key={holding.token.address}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                        {holding.token.icon_url ? <img src={holding.token.icon_url} alt={holding.token.name} className="w-6 h-6 rounded-full" /> : holding.token.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{holding.token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{holding.token.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium mono">{formatBalance(holding.balance, parseInt(holding.token.decimals.toString()))}</td>
                  <td className="px-6 py-4 text-right font-semibold mono">${parseFloat(holding.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
