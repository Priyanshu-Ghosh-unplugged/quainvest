import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, MoreHorizontal, Wallet, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";
import { usePortfolioData, useCoinPrice } from "@/hooks/useQuaiData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Holding {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change24h: number;
  holdings: number;
  value: number;
}

export const HoldingsTable = () => {
  const { address, isConnected, connect, isConnecting } = useWallet();
  const { tokens, quaiBalance, quaiPrice, isLoading, isError } = usePortfolioData(address || undefined);
  const { data: coinPrice } = useCoinPrice();

  const realQuaiPrice = coinPrice?.result?.coin_usd 
    ? parseFloat(coinPrice.result.coin_usd) 
    : quaiPrice;

  // Build holdings from API data
  const holdings: Holding[] = isConnected && !isLoading ? [
    // Add native QUAI balance
    ...(quaiBalance > 0 ? [{
      id: "quai-native",
      symbol: "QUAI",
      name: "Quai Network",
      logo: "🔷",
      price: realQuaiPrice,
      change24h: 0,
      holdings: quaiBalance,
      value: quaiBalance * realQuaiPrice,
    }] : []),
    // Add token holdings
    ...(tokens.data?.items?.map((item, index) => ({
      id: item.token.address || `token-${index}`,
      symbol: item.token.symbol || "???",
      name: item.token.name || "Unknown Token",
      logo: "🪙",
      price: parseFloat(item.value) / (parseFloat(item.balance) / Math.pow(10, item.token.decimals || 18)) || 0,
      change24h: 0,
      holdings: parseFloat(item.balance) / Math.pow(10, item.token.decimals || 18),
      value: parseFloat(item.value) || 0,
    })) || []),
  ] : [];

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border overflow-hidden card-shadow"
      >
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Holdings</h3>
        </div>
        <div className="p-12 text-center">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">No Wallet Connected</p>
          <p className="text-sm text-muted-foreground mb-4">Connect your wallet to view your holdings</p>
          <Button onClick={connect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
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
        className="rounded-2xl bg-card border border-border overflow-hidden card-shadow p-6"
      >
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border overflow-hidden card-shadow p-6"
      >
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to load holdings. Please try again.</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl bg-card border border-border overflow-hidden card-shadow"
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Holdings</h3>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            View All
          </button>
        </div>
      </div>

      {holdings.length === 0 ? (
        <div className="p-12 text-center">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No holdings found</p>
          <p className="text-sm text-muted-foreground">This wallet has no QUAI or tokens</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Asset</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Price</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Holdings</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3 hidden md:table-cell">Value</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <motion.tr
                  key={holding.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  {/* Asset */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                        {holding.logo}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{holding.symbol}</p>
                        <p className="text-xs text-muted-foreground">{holding.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium mono text-foreground">
                      ${holding.price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                    </span>
                  </td>

                  {/* Holdings */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium mono text-foreground">
                      {holding.holdings.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                    </span>
                  </td>

                  {/* Value */}
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <span className="font-medium mono text-foreground">
                      ${holding.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};
