import { motion } from "framer-motion";
import { User, Bell, Shield, Wallet, Globe, Moon, CreditCard, HelpCircle, LogOut, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", description: "Manage your personal information" },
      { icon: Wallet, label: "Connected Wallets", description: "View and manage connected wallets" },
      { icon: CreditCard, label: "Payment Methods", description: "Add or remove payment options" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", description: "Configure alert preferences" },
      { icon: Globe, label: "Language & Region", description: "Set your preferred language" },
      { icon: Moon, label: "Appearance", description: "Customize the interface theme" },
    ],
  },
  {
    title: "Security",
    items: [
      { icon: Shield, label: "Security Settings", description: "2FA, password, and security options" },
    ],
  },
];

const notifications = [
  { id: "price_alerts", label: "Price Alerts", description: "Get notified when prices hit your targets", enabled: true },
  { id: "trade_confirm", label: "Trade Confirmations", description: "Receive notifications for completed trades", enabled: true },
  { id: "portfolio_updates", label: "Portfolio Updates", description: "Daily summary of portfolio changes", enabled: false },
  { id: "news", label: "Market News", description: "Important news affecting your holdings", enabled: true },
  { id: "community", label: "Community Activity", description: "Replies and mentions in discussions", enabled: false },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState("notifications");
  const [notificationSettings, setNotificationSettings] = useState(notifications);

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveSection(item.label.toLowerCase().replace(" ", "_"))}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                      activeSection === item.label.toLowerCase().replace(" ", "_")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-border">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Help & Support</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-loss hover:bg-destructive/10 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 rounded-2xl bg-card border border-border p-6 card-shadow"
        >
          {/* Profile Section */}
          {activeSection === "profile" && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Profile Settings</h2>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm font-medium mb-2 block">Display Name</label>
                  <input
                    type="text"
                    defaultValue="CryptoInvestor"
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-transparent focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <input
                    type="email"
                    defaultValue="investor@example.com"
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-transparent focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <Button className="mt-4">Save Changes</Button>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {notificationSettings.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                  >
                    <div>
                      <h4 className="font-medium">{notification.label}</h4>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-colors",
                        notification.enabled ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                          notification.enabled ? "translate-x-7" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connected Wallets */}
          {activeSection === "connected_wallets" && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Connected Wallets</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">🦊</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">MetaMask</h4>
                        <span className="px-2 py-0.5 text-xs bg-success/10 text-gain rounded-full">Primary</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">0x1234...5678</p>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-gain" />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Wallet className="w-4 h-4" />
                Connect Another Wallet
              </Button>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === "security_settings" && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <span className="px-2 py-0.5 text-xs bg-success/10 text-gain rounded-full">Enabled</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Protect your account with an extra layer of security</p>
                  <Button variant="outline" size="sm">Manage 2FA</Button>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <p className="text-sm text-muted-foreground mb-3">Update your password regularly for security</p>
                  <Button variant="outline" size="sm">Update Password</Button>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <h4 className="font-medium mb-2">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground mb-3">View and manage your active login sessions</p>
                  <Button variant="outline" size="sm">View Sessions</Button>
                </div>
              </div>
            </div>
          )}

          {/* Default/Other sections */}
          {!["profile", "notifications", "connected_wallets", "security_settings"].includes(activeSection) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">This settings section is under development</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
