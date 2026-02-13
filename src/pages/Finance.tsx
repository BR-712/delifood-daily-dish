import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Smartphone, Landmark, Banknote, Wallet, MinusCircle, Upload, Search, CheckCircle2, ImageIcon } from "lucide-react";
import { Transaction, initialOrders, initialExpenses, generateTransactionsFromOrders, PAYMENT_METHODS, PaymentMethod } from "@/lib/data";

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

const Finance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    ...generateTransactionsFromOrders(initialOrders),
    ...initialExpenses,
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: "", amount: 0, method: "Efectivo" as PaymentMethod });

  // Reconciliation wizard state
  const [reconcileOpen, setReconcileOpen] = useState(false);
  const [reconcileStep, setReconcileStep] = useState(0);
  const [reconcileProof, setReconcileProof] = useState<string | null>(null);
  const [reconcileSearch, setReconcileSearch] = useState("");
  const [reconcileSelected, setReconcileSelected] = useState<number[]>([]);

  const getTotal = (method: string) => {
    return transactions
      .filter(t => t.method === method)
      .reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0);
  };

  const getTransactions = (method: string) => transactions.filter(t => t.method === method);

  const addExpense = () => {
    setTransactions(prev => [{
      id: Date.now(),
      description: newExpense.description,
      amount: newExpense.amount,
      type: "expense" as const,
      method: newExpense.method,
      date: new Date().toISOString().split("T")[0],
      reconciled: true,
    }, ...prev]);
    setNewExpense({ description: "", amount: 0, method: "Efectivo" });
    setDialogOpen(false);
  };

  const grandTotal = transactions.reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0);

  // Reconciliation logic
  const unreconciledTxns = transactions.filter(t => t.type === "income" && !t.reconciled);
  const filteredTxns = unreconciledTxns.filter(t =>
    t.description.toLowerCase().includes(reconcileSearch.toLowerCase())
  );

  const handleReconcileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReconcileProof(reader.result as string);
        setReconcileStep(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSelect = (id: number) => {
    setReconcileSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const confirmReconcile = () => {
    setTransactions(prev => prev.map(t =>
      reconcileSelected.includes(t.id)
        ? { ...t, reconciled: true, proofUrl: reconcileProof || undefined }
        : t
    ));
    setReconcileOpen(false);
    setReconcileStep(0);
    setReconcileProof(null);
    setReconcileSearch("");
    setReconcileSelected([]);
  };

  const openReconcileWizard = () => {
    setReconcileStep(0);
    setReconcileProof(null);
    setReconcileSearch("");
    setReconcileSelected([]);
    setReconcileOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-foreground">Finanzas</h2>
          <p className="text-sm text-muted-foreground">Conciliación de caja por método de pago</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold rounded-xl gap-2" onClick={openReconcileWizard}>
            <CheckCircle2 className="w-4 h-4" /> Conciliar Pago
          </Button>
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
                  <Select value={newExpense.method} onValueChange={v => setNewExpense(p => ({ ...p, method: v as PaymentMethod }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PAYMENT_METHODS.map(method => (
          <div key={method} className={`bg-gradient-to-r ${methodColors[method]} rounded-2xl p-4 text-primary-foreground`}>
            <div className="flex items-center gap-2 mb-2">
              {methodIcons[method]}
              <span className="font-bold text-sm">{method}</span>
            </div>
            <p className="text-2xl font-black">${getTotal(method).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Cards by Payment Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PAYMENT_METHODS.map(method => {
          const txns = getTransactions(method);
          return (
            <div key={method} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className={`bg-gradient-to-r ${methodColors[method]} px-5 py-3 flex items-center gap-3 text-primary-foreground`}>
                {methodIcons[method]}
                <span className="font-bold">{method}</span>
              </div>
              <div className="divide-y divide-border max-h-64 overflow-y-auto">
                {txns.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground text-center">Sin transacciones</p>
                )}
                {txns.map(t => (
                  <div key={t.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {t.reconciled && t.type === "income" && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
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

      {/* Reconciliation Wizard Dialog */}
      <Dialog open={reconcileOpen} onOpenChange={setReconcileOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Conciliar Pago</DialogTitle>
          </DialogHeader>

          {reconcileStep === 0 && (
            <div className="py-6 space-y-4">
              <p className="text-sm text-muted-foreground">Paso 1: Sube el comprobante de pago</p>
              <input type="file" accept="image/*" className="hidden" id="reconcile-upload" onChange={handleReconcileUpload} />
              <label htmlFor="reconcile-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                <span className="font-semibold text-foreground">Subir Captura</span>
                <span className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB</span>
              </label>
            </div>
          )}

          {reconcileStep === 1 && (
            <div className="py-4 space-y-4">
              {reconcileProof && (
                <div className="rounded-xl overflow-hidden border border-border max-h-32">
                  <img src={reconcileProof} alt="Comprobante" className="w-full h-32 object-cover" />
                </div>
              )}
              <p className="text-sm text-muted-foreground">Paso 2: Busca al cliente y selecciona los pedidos a vincular</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={reconcileSearch}
                  onChange={e => setReconcileSearch(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredTxns.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay transacciones pendientes de conciliar</p>
                )}
                {filteredTxns.map(t => (
                  <label
                    key={t.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      reconcileSelected.includes(t.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <Checkbox
                      checked={reconcileSelected.includes(t.id)}
                      onCheckedChange={() => toggleSelect(t.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.method} • {t.date}</p>
                    </div>
                    <span className="font-bold text-success">${t.amount.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            {reconcileStep === 1 && (
              <Button
                onClick={confirmReconcile}
                disabled={reconcileSelected.length === 0}
                className="bg-gradient-warm text-primary-foreground font-bold rounded-xl w-full"
              >
                Confirmar Conciliación ({reconcileSelected.length} seleccionados)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;
