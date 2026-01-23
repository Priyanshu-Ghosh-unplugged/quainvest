import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Markets from "./pages/Markets";
import Trade from "./pages/Trade";
import Analytics from "./pages/Analytics";
import Risk from "./pages/Risk";
import Learn from "./pages/Learn";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Sidebar />
    <div className="pl-20 lg:pl-[260px] transition-all duration-300">
      <Header />
      {children}
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/portfolio" element={<AppLayout><Portfolio /></AppLayout>} />
            <Route path="/markets" element={<AppLayout><Markets /></AppLayout>} />
            <Route path="/trade" element={<AppLayout><Trade /></AppLayout>} />
            <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
            <Route path="/risk" element={<AppLayout><Risk /></AppLayout>} />
            <Route path="/learn" element={<AppLayout><Learn /></AppLayout>} />
            <Route path="/community" element={<AppLayout><Community /></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
