import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Smartphone, Landmark, Banknote, Wallet, MinusCircle } from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  method: string;
  date: string;
}

const initialTransactions: Transaction[] = [
  { id: 1, description: "Pedido ORD-001 - María López", amount: 90000, type: "income", method: "Nequi", date: "2026-02-10" },
  { id: 2, description: "Pedido ORD-002 - Carlos Ruiz", amount: 228000, type: "income", method: "Bancolombia", date: "2026-02-10" },
  { id: 3, description: "Venta rápida - 3 Hayacas", amount: 45000, type: "income", method: "Efectivo", date: "2026-02-10" },
  { id: 4, description: "Gas para cocina", amount: 35000, type: "expense", method: "Efectivo", date: "2026-02-10" },
  { id: 5, description: "Pedido ORD-003 - Ana Torres", amount: 36000, type: "income", method: "Daviplata", date: "2026-02-09" },
  { id: 6, description: "Hojas de plátano", amount: 20000, type: "expense", method: "Efectivo", date: "2026-02-09" },
  { id: 7, description: "Venta rápida - 5 Pasteles", amount: 60000, type: "income", method: "Nequi", date: "2026-02-09" },
  { id: 8, description: "Pedido ORD-006 - Jorge Díaz", amount: 120000, type: "income", method: "Nequi", date: "2026-02-09" },
  { id: 9, description: "Ingredientes varios", amount: 50000, type: "expense", method: "Efectivo", date: "2026-02-08" },
];

const methodIcons: Record<string, React.ReactNode> = {
  Nequi: <Smartphone className="w-5 h-5" />,
  Daviplata: <Smartphone className="w-5 h-5" />,
  Bancolombia: <Landmark className="w-5 h-5" />,
  Efectivo: <Banknote className="w-5 h-5" />,
};

const methodColors: Record<string, string> = {
  Nequi: "from-[hsl(280,60%,50%)] to-[hsl(280,50%,40%)]",
  Daviplata: "from-[hsl(350,70%,50%)] to-[hsl(350,60%,40%)]",
  Bancolombia: "from-[hsl(210,70%,45%)] to-[hsl(210,60%,35%)]",
  Efectivo: "from-[hsl(142,71%,45%)] to-[hsl(142,60%,35%)]",
};

const methods = ["Nequi", "Daviplata", "Bancolombia", "Efectivo"];

const Finance = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: "", amount: 0, method: "Efectivo" });

  const getTotal = (method: string) => {
    return transactions
      .filter(t => t.method === method)
      .reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0);
  };

  const getTransactions = (method: string) => transactions.filter(t => t.method === method);

  const addExpense = () => {
    setTransactions(prev => [{
      id: prev.length + 1,
      description: newExpense.description,
      amount: newExpense.amount,
      type: "expense" as const,
      method: newExpense.method,
      date: new Date().toISOString().split("T")[0],
    }, ...prev]);
    setNewExpense({ description: "", amount: 0, method: "Efectivo" });
    setDialogOpen(false);
  };

  const grandTotal = transactions.reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">Finanzas</h2>
          <p className="text-sm text-muted-foreground">Conciliación de caja por método de pago</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="font-bold rounded-xl gap-2">
              <MinusCircle className="w-4 h-4" /> Registrar Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-destructive">Registrar Gasto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input value={newExpense.description} onChange={e => setNewExpense(p => ({ ...p, description: e.target.value }))} placeholder="Ej: Gas, Ingredientes" />
              </div>
              <div className="space-y-2">
                <Label>Monto</Label>
                <Input type="number" min={0} value={newExpense.amount || ""} onChange={e => setNewExpense(p => ({ ...p, amount: Number(e.target.value) }))} className="font-bold text-lg" />
              </div>
              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Select value={newExpense.method} onValueChange={v => setNewExpense(p => ({ ...p, method: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {methods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={addExpense} className="font-bold rounded-xl w-full">
                Registrar Gasto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grand Total */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-gradient-warm rounded-xl p-2.5 text-primary-foreground">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Balance Total</p>
        </div>
        <p className="text-4xl font-black text-foreground">${grandTotal.toLocaleString()}</p>
      </div>

      {/* Cards by Payment Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map(method => {
          const total = getTotal(method);
          const txns = getTransactions(method);
          return (
            <div key={method} className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className={`bg-gradient-to-r ${methodColors[method]} px-5 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3 text-primary-foreground">
                  {methodIcons[method]}
                  <span className="font-bold text-lg">{method}</span>
                </div>
                <span className="font-black text-2xl text-primary-foreground">${total.toLocaleString()}</span>
              </div>
              {/* Transactions */}
              <div className="divide-y divide-border max-h-64 overflow-y-auto">
                {txns.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground text-center">Sin transacciones</p>
                )}
                {txns.map(t => (
                  <div key={t.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.date}</p>
                    </div>
                    <span className={`font-bold ${t.type === "expense" ? "text-destructive" : "text-success"}`}>
                      {t.type === "expense" ? "-" : "+"}${t.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Finance;
