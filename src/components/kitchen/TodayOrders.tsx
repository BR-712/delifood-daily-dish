import { Badge } from "@/components/ui/badge";
import { User, Clock } from "lucide-react";

const orders = [
  { id: 1, customer: "María López", items: "6 Hayacas", status: "Pendiente", time: "10:30 AM" },
  { id: 2, customer: "Carlos Ruiz", items: "12 Hayacas, 4 Pasteles", status: "Pendiente", time: "11:00 AM" },
  { id: 3, customer: "Ana Torres", items: "3 Pasteles Pollo", status: "Listo", time: "9:15 AM" },
];

const TodayOrders = () => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-foreground">📋 Pedidos para Hoy</h2>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-card rounded-2xl p-4 border border-border shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-accent rounded-xl p-2">
                  <User className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">{order.customer}</p>
                  <p className="text-muted-foreground text-sm">{order.items}</p>
                </div>
              </div>

              <Badge
                className={`text-sm font-semibold px-3 py-1 rounded-lg ${
                  order.status === "Listo"
                    ? "bg-success/15 text-success border-success/30"
                    : "bg-secondary/20 text-secondary-foreground border-secondary/40"
                }`}
                variant="outline"
              >
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{order.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayOrders;
