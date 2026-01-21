import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Holding {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change24h: number;
  holdings: number;
  value: number;
  pnl: number;
  pnlPercent: number;
}

const holdings: Holding[] = [
  {
    id: "1",
    symbol: "QUAI",
    name: "Quai Network",
    logo: "🔷",
    price: 2.45,
    change24h: 5.23,
    holdings: 23500,
    value: 57575,
    pnl: 8234.56,
    pnlPercent: 16.7,
  },
  {
    id: "2",
    symbol: "ETH",
    name: "Ethereum",
    logo: "⟠",
    price: 3245.67,
    change24h: -1.24,
    holdings: 9.85,
    value: 31969.85,
    pnl: 4521.32,
    pnlPercent: 16.5,
  },
  {
    id: "3",
    symbol: "BTC",
    name: "Bitcoin",
    logo: "₿",
    price: 43256.78,
    change24h: 2.15,
    holdings: 0.45,
    value: 19465.55,
    pnl: 2845.67,
    pnlPercent: 17.1,
  },
  {
    id: "4",
    symbol: "USDC",
    name: "USD Coin",
    logo: "💵",
    price: 1.0,
    change24h: 0.01,
    holdings: 12834.92,
    value: 12834.92,
    pnl: 0,
    pnlPercent: 0,
  },
  {
    id: "5",
    symbol: "LINK",
    name: "Chainlink",
    logo: "⬡",
    price: 15.67,
    change24h: 3.45,
    holdings: 400,
    value: 6268,
    pnl: -234.56,
    pnlPercent: -3.6,
  },
];

export const HoldingsTable = () => {
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Asset</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Price</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3 hidden sm:table-cell">24h</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Holdings</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3 hidden md:table-cell">Value</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">P&L</th>
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
                    ${holding.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>

                {/* 24h Change */}
                <td className="px-6 py-4 text-right hidden sm:table-cell">
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                    holding.change24h >= 0 ? "bg-success/10 text-gain" : "bg-destructive/10 text-loss"
                  )}>
                    {holding.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {holding.change24h >= 0 ? "+" : ""}{holding.change24h.toFixed(2)}%
                  </div>
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

                {/* P&L */}
                <td className="px-6 py-4 text-right">
                  <div className={cn(
                    "font-medium mono",
                    holding.pnl >= 0 ? "text-gain" : "text-loss"
                  )}>
                    <p>{holding.pnl >= 0 ? "+" : ""}${holding.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs">
                      {holding.pnlPercent >= 0 ? "+" : ""}{holding.pnlPercent.toFixed(1)}%
                    </p>
                  </div>
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
    </motion.div>
  );
};
