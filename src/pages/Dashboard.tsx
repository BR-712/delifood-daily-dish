import { useState } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MetricsCards from "@/components/dashboard/MetricsCards";
import OrdersTable from "@/components/dashboard/OrdersTable";
import InventoryWidget from "@/components/dashboard/InventoryWidget";
import MarketingPreview from "@/components/dashboard/MarketingPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("pedidos");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
          </header>

          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Metrics */}
            <MetricsCards />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted">
                <TabsTrigger value="pedidos">Pedidos Activos</TabsTrigger>
                <TabsTrigger value="inventario">Inventario</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>

              <TabsContent value="pedidos" className="mt-4">
                <OrdersTable />
              </TabsContent>

              <TabsContent value="inventario" className="mt-4">
                <InventoryWidget />
              </TabsContent>

              <TabsContent value="marketing" className="mt-4">
                <MarketingPreview />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
