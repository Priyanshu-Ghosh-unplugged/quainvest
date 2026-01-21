import { motion } from "framer-motion";
import { BookOpen, Play, Clock, Star, ChevronRight, GraduationCap, TrendingUp, Shield, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Beginner", icon: GraduationCap, count: 12, color: "text-primary" },
  { name: "Trading", icon: TrendingUp, count: 8, color: "text-chart-3" },
  { name: "Security", icon: Shield, count: 6, color: "text-chart-2" },
  { name: "DeFi", icon: Coins, count: 10, color: "text-chart-4" },
];

const courses = [
  {
    id: 1,
    title: "Introduction to Quai Network",
    description: "Learn the fundamentals of Quai Network and its unique multi-chain architecture",
    duration: "15 min",
    level: "Beginner",
    rating: 4.9,
    enrolled: 1250,
    image: "🔷",
    progress: 0,
  },
  {
    id: 2,
    title: "Crypto Investing 101",
    description: "Essential strategies for building a profitable crypto portfolio",
    duration: "25 min",
    level: "Beginner",
    rating: 4.8,
    enrolled: 2340,
    image: "📈",
    progress: 45,
  },
  {
    id: 3,
    title: "Understanding Market Analysis",
    description: "Technical and fundamental analysis for crypto trading",
    duration: "40 min",
    level: "Intermediate",
    rating: 4.7,
    enrolled: 890,
    image: "📊",
    progress: 100,
  },
  {
    id: 4,
    title: "Risk Management Strategies",
    description: "Protect your portfolio with proven risk management techniques",
    duration: "30 min",
    level: "Intermediate",
    rating: 4.9,
    enrolled: 1120,
    image: "🛡️",
    progress: 0,
  },
  {
    id: 5,
    title: "DeFi Deep Dive",
    description: "Explore decentralized finance protocols and yield strategies",
    duration: "45 min",
    level: "Advanced",
    rating: 4.6,
    enrolled: 560,
    image: "💎",
    progress: 20,
  },
];

const articles = [
  { title: "What is Dollar-Cost Averaging?", readTime: "5 min", category: "Strategy" },
  { title: "Understanding Gas Fees on Quai", readTime: "3 min", category: "Basics" },
  { title: "How to Read Candlestick Charts", readTime: "8 min", category: "Trading" },
  { title: "Securing Your Crypto Wallet", readTime: "6 min", category: "Security" },
];

const Learn = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Learn</h1>
        <p className="text-muted-foreground">Master crypto investing with our educational resources</p>
      </motion.div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card border border-border p-4 hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <cat.icon className={cn("w-8 h-8 mb-3", cat.color)} />
            <h3 className="font-semibold mb-1">{cat.name}</h3>
            <p className="text-sm text-muted-foreground">{cat.count} courses</p>
          </motion.div>
        ))}
      </div>

      {/* Featured Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Featured Courses</h2>
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-5xl">
                {course.image}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{course.level}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </span>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-muted-foreground">({course.enrolled.toLocaleString()})</span>
                  </div>
                  {course.progress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{course.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Continue Learning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
        <div className="space-y-3">
          {courses.filter(c => c.progress > 0 && c.progress < 100).map((course) => (
            <div key={course.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-2xl">
                {course.image}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{course.title}</h4>
                <p className="text-sm text-muted-foreground">{course.level} • {course.duration}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{course.progress}%</p>
                  <p className="text-xs text-muted-foreground">complete</p>
                </div>
                <Button size="sm" className="gap-1">
                  <Play className="w-3 h-3" /> Resume
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Articles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-card border border-border p-6 card-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Quick Reads</h2>
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {articles.map((article, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer">
              <BookOpen className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{article.title}</h4>
                <p className="text-xs text-muted-foreground">{article.category} • {article.readTime}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Learn;
