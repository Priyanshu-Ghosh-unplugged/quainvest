import { Bell, Search, Wallet, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useWallet } from "@/contexts/WalletContext";
import { useNetworkStatus, useCoinPrice } from "@/hooks/useQuaiData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();
  const { data: networkStatus } = useNetworkStatus();
  const { data: coinPrice } = useCoinPrice();

  const quaiPrice = coinPrice?.result?.coin_usd 
    ? parseFloat(coinPrice.result.coin_usd).toFixed(2) 
    : null;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-xl border-b border-border">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens, transactions..."
            className="w-full h-10 pl-10 pr-4 bg-secondary rounded-xl border border-transparent focus:border-primary/50 focus:outline-none text-sm placeholder:text-muted-foreground transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-muted-foreground bg-muted rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* QUAI Price */}
        {quaiPrice && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
            <span className="text-xl">🔷</span>
            <span className="text-xs font-medium text-muted-foreground">QUAI</span>
            <span className="text-sm font-semibold text-foreground">${quaiPrice}</span>
          </div>
        )}

        {/* Network Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            {networkStatus ? `Block #${networkStatus.blockNumber.toLocaleString()}` : "Quai Mainnet"}
          </span>
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl bg-secondary hover:bg-muted transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </motion.button>

        {/* Connect/Disconnect Wallet */}
        {isConnected && address ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl border-primary/50 bg-primary/10">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline font-mono text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={disconnect} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="default" 
            className="gap-2 rounded-xl"
            onClick={connect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </span>
          </Button>
        )}
      </div>
    </header>
  );
};
