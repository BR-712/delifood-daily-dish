import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
          </header>
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
