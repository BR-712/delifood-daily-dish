import MetricsCards from "@/components/dashboard/MetricsCards";
import OrdersTable from "@/components/dashboard/OrdersTable";
import InventoryWidget from "@/components/dashboard/InventoryWidget";
import MarketingPreview from "@/components/dashboard/MarketingPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("pedidos");

  return (
    <>
      <MetricsCards />
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
    </>
  );
};

export default Dashboard;
