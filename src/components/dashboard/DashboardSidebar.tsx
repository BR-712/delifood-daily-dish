import {
  LayoutDashboard,
  CalendarDays,
  Package,
  DollarSign,
  Megaphone,
  ArrowLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Pedidos", url: "/dashboard/pedidos", icon: CalendarDays },
  { title: "Inventario", url: "/dashboard/inventario", icon: Package },
  { title: "Finanzas", url: "/dashboard/finanzas", icon: DollarSign },
  { title: "Marketing", url: "/dashboard/marketing", icon: Megaphone },
];

const DashboardSidebar = () => {
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        {/* Brand */}
        <div className="px-4 py-5 border-b border-border">
          <h2 className="text-2xl font-black text-gradient-warm">Dalifood</h2>
          <p className="text-xs text-muted-foreground">Panel de Control</p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider">
            Menú
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent rounded-lg"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Back to Home */}
        <div className="mt-auto p-4 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
