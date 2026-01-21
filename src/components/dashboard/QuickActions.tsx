import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: ArrowDownToLine,
    label: "Buy",
    description: "Purchase crypto",
    variant: "default" as const,
    gradient: "from-primary to-accent",
  },
  {
    icon: ArrowUpFromLine,
    label: "Sell",
    description: "Sell holdings",
    variant: "secondary" as const,
    gradient: "from-chart-2 to-chart-5",
  },
  {
    icon: RefreshCw,
    label: "Swap",
    description: "Exchange tokens",
    variant: "secondary" as const,
    gradient: "from-chart-4 to-primary",
  },
  {
    icon: PiggyBank,
    label: "DCA",
    description: "Auto-invest",
    variant: "secondary" as const,
    gradient: "from-chart-3 to-chart-2",
  },
];

export const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl bg-card border border-border p-6 card-shadow"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative overflow-hidden p-4 rounded-xl text-left transition-all
                ${action.variant === 'default' 
                  ? 'bg-primary text-primary-foreground glow-effect' 
                  : 'bg-secondary hover:bg-muted border border-border'
                }
              `}
            >
              {action.variant === 'default' && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              )}
              
              <div className="relative">
                <Icon className={`w-5 h-5 mb-2 ${action.variant === 'default' ? '' : 'text-primary'}`} />
                <p className="font-semibold">{action.label}</p>
                <p className={`text-xs ${action.variant === 'default' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {action.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
