import { motion } from "framer-motion";
import { Users, MessageSquare, TrendingUp, Award, ThumbsUp, Eye, Clock, ChevronRight, Crown, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const leaderboard = [
  { rank: 1, name: "CryptoWhale", avatar: "🐋", returns: "+156.4%", followers: 12500, badge: "Diamond" },
  { rank: 2, name: "QuaiMaster", avatar: "🔷", returns: "+134.2%", followers: 8900, badge: "Platinum" },
  { rank: 3, name: "DeFiKing", avatar: "👑", returns: "+121.8%", followers: 7200, badge: "Platinum" },
  { rank: 4, name: "BlockchainPro", avatar: "⛓️", returns: "+98.5%", followers: 5400, badge: "Gold" },
  { rank: 5, name: "TokenTrader", avatar: "💹", returns: "+87.3%", followers: 4100, badge: "Gold" },
];

const discussions = [
  { id: 1, title: "QUAI price analysis for Q1 2024", author: "CryptoAnalyst", avatar: "📊", replies: 45, views: 1234, time: "2h ago", hot: true },
  { id: 2, title: "Best DCA strategy for beginners?", author: "NewInvestor", avatar: "🌱", replies: 32, views: 890, time: "4h ago", hot: false },
  { id: 3, title: "Understanding Quai's multi-chain architecture", author: "TechExpert", avatar: "🔬", replies: 28, views: 756, time: "6h ago", hot: true },
  { id: 4, title: "Portfolio rebalancing tips", author: "PortfolioMgr", avatar: "⚖️", replies: 19, views: 543, time: "8h ago", hot: false },
  { id: 5, title: "Tax implications of crypto trading", author: "TaxWise", avatar: "📋", replies: 67, views: 2100, time: "12h ago", hot: true },
];

const portfolios = [
  { name: "Growth Portfolio", author: "CryptoWhale", returns: "+45.2%", risk: "High", assets: ["QUAI", "ETH", "SOL"], followers: 234 },
  { name: "Stable Income", author: "DeFiKing", returns: "+18.5%", risk: "Low", assets: ["USDC", "ETH", "BTC"], followers: 567 },
  { name: "Altcoin Mix", author: "TokenTrader", returns: "+62.1%", risk: "High", assets: ["QUAI", "LINK", "AVAX"], followers: 189 },
];

const Community = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground">Connect with fellow investors and learn together</p>
        </div>
        <Button className="gap-2">
          <MessageSquare className="w-4 h-4" />
          New Discussion
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Members", value: "12,458", icon: Users, color: "text-primary" },
          { label: "Discussions", value: "3,241", icon: MessageSquare, color: "text-chart-2" },
          { label: "Shared Portfolios", value: "847", icon: TrendingUp, color: "text-gain" },
          { label: "Top Traders", value: "156", icon: Award, color: "text-warning" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card border border-border p-4"
          >
            <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
            <p className="text-2xl font-bold mono">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discussions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 rounded-2xl bg-card border border-border card-shadow"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Trending Discussions</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {discussions.map((post) => (
              <div key={post.id} className="p-4 hover:bg-muted/20 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl flex-shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {post.hot && (
                        <span className="px-2 py-0.5 text-xs bg-destructive/10 text-loss rounded-full">🔥 Hot</span>
                      )}
                      <h3 className="font-medium truncate">{post.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>by {post.author}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.replies}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          <h2 className="font-semibold mb-4">Top Performers</h2>
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div key={user.rank} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  user.rank === 1 && "bg-warning/20 text-warning",
                  user.rank === 2 && "bg-muted text-muted-foreground",
                  user.rank === 3 && "bg-chart-3/20 text-chart-3",
                  user.rank > 3 && "bg-secondary text-muted-foreground"
                )}>
                  {user.rank === 1 ? <Crown className="w-4 h-4" /> : user.rank === 2 ? <Medal className="w-4 h-4" /> : user.rank}
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.followers.toLocaleString()} followers</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gain mono">{user.returns}</p>
                  <p className="text-xs text-muted-foreground">{user.badge}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Shared Portfolios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Popular Portfolios</h2>
          <Button variant="ghost" size="sm" className="gap-1">
            Explore All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolios.map((portfolio, i) => (
            <div key={i} className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{portfolio.name}</h3>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  portfolio.risk === "Low" && "bg-success/10 text-gain",
                  portfolio.risk === "High" && "bg-destructive/10 text-loss"
                )}>
                  {portfolio.risk} Risk
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">by {portfolio.author}</p>
              <div className="flex items-center gap-1 mb-3">
                {portfolio.assets.map((asset) => (
                  <span key={asset} className="px-2 py-1 text-xs bg-secondary rounded">{asset}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xl font-bold text-gain mono">{portfolio.returns}</span>
                <span className="text-xs text-muted-foreground">{portfolio.followers} following</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Community;
