import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: string;
  client: string;
  items: string;
  price: number;
  paymentStatus: "Pagado" | "Pendiente" | "Parcial";
  deliveryStatus: "Pendiente" | "Entregado" | "En camino";
}

const initialOrders: Order[] = [
  { id: "ORD-001", client: "María López", items: "6 Hayacas", price: 90000, paymentStatus: "Pagado", deliveryStatus: "Pendiente" },
  { id: "ORD-002", client: "Carlos Ruiz", items: "12 Hayacas, 4 Pasteles", price: 228000, paymentStatus: "Parcial", deliveryStatus: "En camino" },
  { id: "ORD-003", client: "Ana Torres", items: "3 Pasteles Pollo", price: 36000, paymentStatus: "Pendiente", deliveryStatus: "Pendiente" },
  { id: "ORD-004", client: "Luis Méndez", items: "10 Hayacas", price: 150000, paymentStatus: "Pagado", deliveryStatus: "Entregado" },
  { id: "ORD-005", client: "Sandra Vega", items: "2 Hayacas, 2 Pasteles", price: 54000, paymentStatus: "Pendiente", deliveryStatus: "Pendiente" },
];

const paymentBadgeClass: Record<string, string> = {
  Pagado: "bg-success/15 text-success border-success/30",
  Pendiente: "bg-secondary/20 text-secondary-foreground border-secondary/40",
  Parcial: "bg-primary/15 text-primary border-primary/30",
};

const deliveryBadgeClass: Record<string, string> = {
  Pendiente: "bg-muted text-muted-foreground border-border",
  "En camino": "bg-primary/10 text-primary border-primary/30",
  Entregado: "bg-success/15 text-success border-success/30",
};

const OrdersTable = () => {
  const [orders, setOrders] = useState(initialOrders);

  const updatePrice = (id: string, newPrice: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, price: Number(newPrice) || 0 } : o))
    );
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">Pedidos Activos</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Productos</TableHead>
              <TableHead className="font-semibold">Precio</TableHead>
              <TableHead className="font-semibold">Pago</TableHead>
              <TableHead className="font-semibold">Entrega</TableHead>
              <TableHead className="font-semibold">Comprobante</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-accent/30">
                <TableCell className="font-mono text-sm text-muted-foreground">{order.id}</TableCell>
                <TableCell className="font-semibold">{order.client}</TableCell>
                <TableCell className="text-sm">{order.items}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={order.price}
                    onChange={(e) => updatePrice(order.id, e.target.value)}
                    className="w-28 h-9 text-sm font-semibold rounded-lg"
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={paymentBadgeClass[order.paymentStatus]}>
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={deliveryBadgeClass[order.deliveryStatus]}>
                    {order.deliveryStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersTable;
