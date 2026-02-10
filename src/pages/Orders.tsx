import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Paperclip, Plus, Pencil, Check, X } from "lucide-react";

interface Order {
  id: string;
  client: string;
  deliveryDate: string;
  items: string;
  status: "Pendiente" | "Confirmado" | "Entregado";
  totalPrice: number;
  hasPaid: boolean;
}

const initialOrders: Order[] = [
  { id: "ORD-001", client: "María López", deliveryDate: "2026-02-12", items: "6 Hayacas", status: "Pendiente", totalPrice: 90000, hasPaid: false },
  { id: "ORD-002", client: "Carlos Ruiz", deliveryDate: "2026-02-13", items: "12 Hayacas, 4 Pasteles", status: "Confirmado", totalPrice: 228000, hasPaid: true },
  { id: "ORD-003", client: "Ana Torres", deliveryDate: "2026-02-14", items: "3 Pasteles Pollo", status: "Pendiente", totalPrice: 36000, hasPaid: false },
  { id: "ORD-004", client: "Luis Méndez", deliveryDate: "2026-02-11", items: "10 Hayacas", status: "Entregado", totalPrice: 150000, hasPaid: true },
  { id: "ORD-005", client: "Sandra Vega", deliveryDate: "2026-02-15", items: "2 Hayacas, 2 Pasteles", status: "Pendiente", totalPrice: 54000, hasPaid: false },
  { id: "ORD-006", client: "Jorge Díaz", deliveryDate: "2026-02-12", items: "8 Hayacas", status: "Confirmado", totalPrice: 120000, hasPaid: true },
];

const statusBadge: Record<string, string> = {
  Pendiente: "bg-secondary/20 text-secondary-foreground border-secondary/40",
  Confirmado: "bg-primary/15 text-primary border-primary/30",
  Entregado: "bg-success/15 text-success border-success/30",
};

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ client: "", deliveryDate: "", hayacas: 0, pasteles: 0, price: 0 });

  const startEdit = (order: Order) => {
    setEditingId(order.id);
    setEditPrice(String(order.totalPrice));
  };

  const saveEdit = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, totalPrice: Number(editPrice) || 0 } : o));
    setEditingId(null);
  };

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const addOrder = () => {
    const items = [
      newOrder.hayacas > 0 ? `${newOrder.hayacas} Hayacas` : "",
      newOrder.pasteles > 0 ? `${newOrder.pasteles} Pasteles` : "",
    ].filter(Boolean).join(", ");
    const id = `ORD-${String(orders.length + 1).padStart(3, "0")}`;
    setOrders(prev => [...prev, {
      id, client: newOrder.client, deliveryDate: newOrder.deliveryDate,
      items: items || "Sin productos", status: "Pendiente" as const,
      totalPrice: newOrder.price, hasPaid: false,
    }]);
    setNewOrder({ client: "", deliveryDate: "", hayacas: 0, pasteles: 0, price: 0 });
    setDialogOpen(false);
  };

  const suggestedPrice = (newOrder.hayacas * 15000) + (newOrder.pasteles * 12000);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">Pedidos</h2>
          <p className="text-sm text-muted-foreground">Gestión completa de pedidos de clientes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm text-primary-foreground font-bold rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Nuevo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Nuevo Pedido</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Input value={newOrder.client} onChange={e => setNewOrder(p => ({ ...p, client: e.target.value }))} placeholder="Nombre del cliente" />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Entrega</Label>
                <Input type="date" value={newOrder.deliveryDate} onChange={e => setNewOrder(p => ({ ...p, deliveryDate: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hayacas</Label>
                  <Input type="number" min={0} value={newOrder.hayacas} onChange={e => setNewOrder(p => ({ ...p, hayacas: Number(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Pasteles</Label>
                  <Input type="number" min={0} value={newOrder.pasteles} onChange={e => setNewOrder(p => ({ ...p, pasteles: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Precio Sugerido</Label>
                <div className="text-lg font-bold text-muted-foreground bg-muted rounded-lg px-3 py-2">
                  ${suggestedPrice.toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-primary font-bold">Precio Negociado (Final)</Label>
                <Input
                  type="number"
                  value={newOrder.price || ""}
                  onChange={e => setNewOrder(p => ({ ...p, price: Number(e.target.value) }))}
                  placeholder={String(suggestedPrice)}
                  className="border-primary/50 font-bold text-lg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addOrder} className="bg-gradient-warm text-primary-foreground font-bold rounded-xl w-full">
                Crear Pedido
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Entrega</TableHead>
                <TableHead className="font-semibold">Productos</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold">Precio Total</TableHead>
                <TableHead className="font-semibold">Comprobante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-accent/30">
                  <TableCell className="font-mono text-sm text-muted-foreground">{order.id}</TableCell>
                  <TableCell className="font-semibold">{order.client}</TableCell>
                  <TableCell className="text-sm">{order.deliveryDate}</TableCell>
                  <TableCell className="text-sm">{order.items}</TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v as Order["status"])}>
                      <SelectTrigger className="w-36 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Confirmado">Confirmado</SelectItem>
                        <SelectItem value="Entregado">Entregado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {editingId === order.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          className="w-28 h-8 text-sm font-bold"
                          autoFocus
                        />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-success" onClick={() => saveEdit(order.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">${order.totalPrice.toLocaleString()}</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => startEdit(order)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
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
    </div>
  );
};

export default Orders;
