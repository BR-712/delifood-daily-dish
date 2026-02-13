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
import { initialOrders, Order, PRODUCTS, PaymentLine, PaymentStatus } from "@/lib/data";
import SplitPaymentForm from "@/components/kitchen/SplitPaymentForm";

const statusBadge: Record<string, string> = {
  Pendiente: "bg-secondary/20 text-secondary-foreground border-secondary/40",
  Confirmado: "bg-primary/15 text-primary border-primary/30",
  Entregado: "bg-success/15 text-success border-success/30",
};

const paymentBadge: Record<PaymentStatus, string> = {
  Pendiente: "bg-muted text-muted-foreground border-border",
  Parcial: "bg-secondary/20 text-secondary-foreground border-secondary/40",
  Pagado: "bg-success/15 text-success border-success/30",
};

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [payDialogOrder, setPayDialogOrder] = useState<Order | null>(null);

  const activeProducts = PRODUCTS.filter(p => p.active);

  // New order state
  const [newOrder, setNewOrder] = useState({ client: "", deliveryDate: "", hayacas: 0, pasteles: 0, price: 0 });
  const [newOrderPayments, setNewOrderPayments] = useState<PaymentLine[]>([{ method: "Efectivo" as const, amount: 0 }]);

  // Payment dialog state
  const [payPayments, setPayPayments] = useState<PaymentLine[]>([{ method: "Efectivo" as const, amount: 0 }]);

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

  const computePaymentStatus = (payments: PaymentLine[], total: number): PaymentStatus => {
    const paid = payments.reduce((s, p) => s + (p.amount || 0), 0);
    if (paid >= total) return "Pagado";
    if (paid > 0) return "Parcial";
    return "Pendiente";
  };

  const addOrder = () => {
    const items = [
      newOrder.hayacas > 0 ? `${newOrder.hayacas} Hayacas` : "",
      newOrder.pasteles > 0 ? `${newOrder.pasteles} Pasteles` : "",
    ].filter(Boolean).join(", ");
    const id = `ORD-${String(orders.length + 1).padStart(3, "0")}`;
    const finalPrice = newOrder.price || suggestedPrice;
    const validPayments = newOrderPayments.filter(p => p.amount > 0);
    const ps = computePaymentStatus(validPayments, finalPrice);

    // Snapshot current prices
    const snapshotPrices: Record<string, number> = {};
    activeProducts.forEach(p => { snapshotPrices[p.id] = p.price; });

    setOrders(prev => [...prev, {
      id, client: newOrder.client, deliveryDate: newOrder.deliveryDate,
      items: items || "Sin productos", status: "Pendiente" as const,
      totalPrice: finalPrice,
      snapshotPrices,
      payments: validPayments,
      paymentStatus: ps,
    }]);
    setNewOrder({ client: "", deliveryDate: "", hayacas: 0, pasteles: 0, price: 0 });
    setNewOrderPayments([{ method: "Efectivo", amount: 0 }]);
    setDialogOpen(false);
  };

  const openPayDialog = (order: Order) => {
    setPayDialogOrder(order);
    setPayPayments(order.payments.length > 0 ? [...order.payments] : [{ method: "Efectivo", amount: 0 }]);
  };

  const savePayments = () => {
    if (!payDialogOrder) return;
    const validPayments = payPayments.filter(p => p.amount > 0);
    const ps = computePaymentStatus(validPayments, payDialogOrder.totalPrice);
    setOrders(prev => prev.map(o =>
      o.id === payDialogOrder.id ? { ...o, payments: validPayments, paymentStatus: ps } : o
    ));
    setPayDialogOrder(null);
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
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
              <div className="space-y-2">
                <Label className="font-bold">Pago</Label>
                <SplitPaymentForm
                  totalAmount={newOrder.price || suggestedPrice}
                  payments={newOrderPayments}
                  onChange={setNewOrderPayments}
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
                <TableHead className="font-semibold">Pago</TableHead>
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
                    <Badge
                      className={`cursor-pointer font-semibold ${paymentBadge[order.paymentStatus]}`}
                      variant="outline"
                      onClick={() => openPayDialog(order)}
                    >
                      {order.paymentStatus}
                      {order.paymentStatus === "Parcial" && (
                        <span className="ml-1 text-xs">
                          (${order.payments.reduce((s, p) => s + p.amount, 0).toLocaleString()})
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => openPayDialog(order)}>
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={!!payDialogOrder} onOpenChange={(v) => !v && setPayDialogOrder(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              Pago - {payDialogOrder?.id}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{payDialogOrder?.client} • {payDialogOrder?.items}</p>
          </DialogHeader>
          {payDialogOrder && (
            <div className="py-4">
              <SplitPaymentForm
                totalAmount={payDialogOrder.totalPrice}
                payments={payPayments}
                onChange={setPayPayments}
              />
            </div>
          )}
          <DialogFooter>
            <Button onClick={savePayments} className="bg-gradient-warm text-primary-foreground font-bold rounded-xl w-full">
              Guardar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
