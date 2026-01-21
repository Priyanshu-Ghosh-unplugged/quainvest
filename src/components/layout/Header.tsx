import { Bell, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Header = () => {
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
        {/* Network Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Quai Mainnet</span>
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

        {/* Connect Wallet */}
        <Button variant="default" className="gap-2 rounded-xl">
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </Button>
      </div>
    </header>
  );
};
