import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDownUp, Settings, Info, Zap, Clock, ChevronDown, RefreshCw, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const priceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  price: 2.35 + Math.random() * 0.2,
}));

const orderBook = {
  bids: [
    { price: 2.44, amount: 1250, total: 3050 },
    { price: 2.43, amount: 3200, total: 7770 },
    { price: 2.42, amount: 5100, total: 12345 },
    { price: 2.41, amount: 2800, total: 6748 },
    { price: 2.40, amount: 4500, total: 10800 },
  ],
  asks: [
    { price: 2.46, amount: 1800, total: 4428 },
    { price: 2.47, amount: 2400, total: 5928 },
    { price: 2.48, amount: 3600, total: 8928 },
    { price: 2.49, amount: 1900, total: 4731 },
    { price: 2.50, amount: 5200, total: 13000 },
  ],
};

const Trade = () => {
  const [searchParams] = useSearchParams();
  const actionParam = searchParams.get("action") || "buy";
  
  const [activeTab, setActiveTab] = useState<"trade" | "swap" | "dca">(
    actionParam === "swap" ? "swap" : actionParam === "dca" ? "dca" : "trade"
  );
  const [tradeType, setTradeType] = useState<"buy" | "sell">(
    actionParam === "sell" ? "sell" : "buy"
  );
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("2.45");
  const [swapFromToken, setSwapFromToken] = useState("QUAI");
  const [swapToToken, setSwapToToken] = useState("USDC");
  const [swapAmount, setSwapAmount] = useState("");
  const [dcaAmount, setDcaAmount] = useState("");
  const [dcaFrequency, setDcaFrequency] = useState("weekly");

  useEffect(() => {
    if (actionParam === "swap") {
      setActiveTab("swap");
    } else if (actionParam === "dca") {
      setActiveTab("dca");
    } else {
      setActiveTab("trade");
      setTradeType(actionParam === "sell" ? "sell" : "buy");
    }
  }, [actionParam]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trade</h1>
          <p className="text-muted-foreground">Execute trades on Quai Network</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg">
          <Zap className="w-4 h-4 text-gain" />
          <span className="text-sm font-medium text-gain">Live Trading</span>
        </div>
      </motion.div>

      {/* Action Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "trade" | "swap" | "dca")} className="mb-6">
        <TabsList className="bg-secondary p-1 rounded-xl">
          <TabsTrigger value="trade" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Trade
          </TabsTrigger>
          <TabsTrigger value="swap" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <RefreshCw className="w-4 h-4 mr-2" />
            Swap
          </TabsTrigger>
          <TabsTrigger value="dca" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <PiggyBank className="w-4 h-4 mr-2" />
            DCA
          </TabsTrigger>
        </TabsList>

        {/* Trade Tab Content */}
        <TabsContent value="trade" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="xl:col-span-2 rounded-2xl bg-card border border-border p-6 card-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">🔷</div>
                  <div>
                    <h3 className="font-semibold">QUAI/USDC</h3>
                    <p className="text-sm text-muted-foreground">Quai Network</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold mono">$2.45</p>
                  <p className="text-sm text-gain">+5.23%</p>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData}>
                    <defs>
                      <linearGradient id="tradeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(168, 84%, 45%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(168, 84%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} tickFormatter={(v) => `$${v.toFixed(2)}`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(222, 47%, 10%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px" }}
                      labelStyle={{ color: 'hsl(215, 20%, 55%)' }}
                      formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="hsl(168, 84%, 45%)" strokeWidth={2} fill="url(#tradeGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Order Book */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl bg-card border border-border p-6 card-shadow"
            >
              <h3 className="font-semibold mb-4">Order Book</h3>
              
              {/* Asks (Sell orders) */}
              <div className="space-y-1 mb-4">
                {[...orderBook.asks].reverse().map((order, i) => (
                  <div key={i} className="relative flex items-center text-xs py-1">
                    <div className="absolute inset-y-0 right-0 bg-loss/10" style={{ width: `${(order.amount / 5200) * 100}%` }} />
                    <span className="w-1/3 font-medium mono text-loss relative">${order.price.toFixed(2)}</span>
                    <span className="w-1/3 text-right mono relative">{order.amount.toLocaleString()}</span>
                    <span className="w-1/3 text-right mono text-muted-foreground relative">{order.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Current Price */}
              <div className="flex items-center justify-center py-3 border-y border-border">
                <span className="text-xl font-bold mono text-primary">$2.45</span>
              </div>

              {/* Bids (Buy orders) */}
              <div className="space-y-1 mt-4">
                {orderBook.bids.map((order, i) => (
                  <div key={i} className="relative flex items-center text-xs py-1">
                    <div className="absolute inset-y-0 right-0 bg-gain/10" style={{ width: `${(order.amount / 5100) * 100}%` }} />
                    <span className="w-1/3 font-medium mono text-gain relative">${order.price.toFixed(2)}</span>
                    <span className="w-1/3 text-right mono relative">{order.amount.toLocaleString()}</span>
                    <span className="w-1/3 text-right mono text-muted-foreground relative">{order.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trade Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-card border border-border p-6 card-shadow"
            >
              {/* Buy/Sell Toggle */}
              <div className="flex rounded-xl bg-secondary p-1 mb-6">
                <button
                  onClick={() => setTradeType("buy")}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    tradeType === "buy" ? "bg-success text-success-foreground" : "text-muted-foreground"
                  )}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType("sell")}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    tradeType === "sell" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground"
                  )}
                >
                  Sell
                </button>
              </div>

              {/* Order Type */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setOrderType("market")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                    orderType === "market" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                  )}
                >
                  Market
                </button>
                <button
                  onClick={() => setOrderType("limit")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                    orderType === "limit" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                  )}
                >
                  Limit
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-4">
                {orderType === "limit" && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Price (USDC)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full h-12 px-4 bg-secondary rounded-xl border border-transparent focus:border-primary/50 focus:outline-none font-mono text-lg"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Amount (QUAI)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-12 px-4 bg-secondary rounded-xl border border-transparent focus:border-primary/50 focus:outline-none font-mono text-lg"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">
                      MAX
                    </button>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex gap-2">
                  {["25%", "50%", "75%", "100%"].map((pct) => (
                    <button key={pct} className="flex-1 py-1.5 text-xs font-medium bg-secondary rounded-lg hover:bg-muted transition-colors">
                      {pct}
                    </button>
                  ))}
                </div>

                {/* Total */}
                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium mono">{amount ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : "0.00"} USDC</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Fee (0.1%)</span>
                    <span className="mono">{amount ? (parseFloat(amount) * parseFloat(price) * 0.001).toFixed(4) : "0.00"} USDC</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  className={cn(
                    "w-full h-12 text-base font-semibold",
                    tradeType === "buy" ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90"
                  )}
                >
                  {tradeType === "buy" ? "Buy QUAI" : "Sell QUAI"}
                </Button>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* Swap Tab Content */}
        <TabsContent value="swap" className="mt-6">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border p-6 card-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Swap Tokens</h3>
                <button className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* From Token */}
              <div className="space-y-2 mb-2">
                <label className="text-sm text-muted-foreground">From</label>
                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="number"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent text-2xl font-mono w-full focus:outline-none"
                    />
                    <button className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                      <span className="text-xl">🔷</span>
                      <span className="font-medium">{swapFromToken}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Balance: 1,234.56 {swapFromToken}</span>
                    <button className="text-primary hover:underline">MAX</button>
                  </div>
                </div>
              </div>

              {/* Swap Arrow */}
              <div className="flex justify-center -my-2 z-10 relative">
                <button 
                  onClick={() => {
                    setSwapFromToken(swapToToken);
                    setSwapToToken(swapFromToken);
                  }}
                  className="p-3 bg-card border border-border rounded-xl hover:bg-secondary transition-colors"
                >
                  <ArrowDownUp className="w-5 h-5 text-primary" />
                </button>
              </div>

              {/* To Token */}
              <div className="space-y-2 mt-2">
                <label className="text-sm text-muted-foreground">To</label>
                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-mono text-muted-foreground">
                      {swapAmount ? (parseFloat(swapAmount) * 2.45).toFixed(2) : "0.00"}
                    </span>
                    <button className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                      <span className="text-xl">💵</span>
                      <span className="font-medium">{swapToToken}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Balance: 5,678.90 {swapToToken}
                  </div>
                </div>
              </div>

              {/* Swap Details */}
              <div className="mt-4 p-4 bg-secondary/50 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="font-medium">1 QUAI = 2.45 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slippage</span>
                  <span className="font-medium">0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span className="font-medium">~$0.02</span>
                </div>
              </div>

              {/* Swap Button */}
              <Button className="w-full h-12 mt-6 text-base font-semibold bg-primary hover:bg-primary/90">
                <RefreshCw className="w-4 h-4 mr-2" />
                Swap Tokens
              </Button>
            </motion.div>
          </div>
        </TabsContent>

        {/* DCA Tab Content */}
        <TabsContent value="dca" className="mt-6">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border p-6 card-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <PiggyBank className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Dollar Cost Averaging</h3>
                  <p className="text-sm text-muted-foreground">Auto-invest on a schedule</p>
                </div>
              </div>

              {/* Token Selection */}
              <div className="space-y-2 mb-6">
                <label className="text-sm text-muted-foreground">Token to Buy</label>
                <button className="w-full flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔷</span>
                    <div className="text-left">
                      <p className="font-medium">QUAI</p>
                      <p className="text-sm text-muted-foreground">Quai Network</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Amount per Purchase */}
              <div className="space-y-2 mb-6">
                <label className="text-sm text-muted-foreground">Amount per Purchase (USDC)</label>
                <input
                  type="number"
                  value={dcaAmount}
                  onChange={(e) => setDcaAmount(e.target.value)}
                  placeholder="100.00"
                  className="w-full h-12 px-4 bg-secondary rounded-xl border border-transparent focus:border-primary/50 focus:outline-none font-mono text-lg"
                />
              </div>

              {/* Frequency */}
              <div className="space-y-2 mb-6">
                <label className="text-sm text-muted-foreground">Frequency</label>
                <div className="grid grid-cols-4 gap-2">
                  {["daily", "weekly", "biweekly", "monthly"].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setDcaFrequency(freq)}
                      className={cn(
                        "py-2.5 rounded-lg text-sm font-medium capitalize transition-all",
                        dcaFrequency === freq 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-secondary/50 rounded-xl space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investment Schedule</span>
                  <span className="font-medium capitalize">{dcaFrequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount per Period</span>
                  <span className="font-medium">${dcaAmount || "0"} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Total</span>
                  <span className="font-medium">
                    ${dcaAmount ? (
                      dcaFrequency === "daily" ? parseFloat(dcaAmount) * 30 :
                      dcaFrequency === "weekly" ? parseFloat(dcaAmount) * 4 :
                      dcaFrequency === "biweekly" ? parseFloat(dcaAmount) * 2 :
                      parseFloat(dcaAmount)
                    ).toFixed(2) : "0"} USDC
                  </span>
                </div>
              </div>

              {/* Start DCA Button */}
              <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">
                <Clock className="w-4 h-4 mr-2" />
                Start DCA Plan
              </Button>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trade;
