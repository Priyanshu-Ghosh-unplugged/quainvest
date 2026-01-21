import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { AssetAllocation } from "@/components/dashboard/AssetAllocation";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { HoldingsTable } from "@/components/dashboard/HoldingsTable";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-20 lg:pl-[260px] transition-all duration-300">
        <Header />
        
        <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Top Row - Portfolio Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <PortfolioOverview />
            </div>
            <div className="space-y-6">
              <AssetAllocation />
              <QuickActions />
            </div>
          </div>

          {/* Middle Row - Chart & Market */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2">
              <PriceChart />
            </div>
            <div>
              <MarketOverview />
            </div>
          </div>

          {/* Bottom Row - Holdings & Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <HoldingsTable />
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
