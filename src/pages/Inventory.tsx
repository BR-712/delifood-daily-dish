import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Package, AlertTriangle, Plus } from "lucide-react";

interface ProductionEntry {
  id: number;
  date: string;
  product: string;
  quantityGood: number;
  quantityDamaged: number;
  producedBy: string;
}

const initialEntries: ProductionEntry[] = [
  { id: 1, date: "2026-02-10", product: "Hayaca", quantityGood: 24, quantityDamaged: 2, producedBy: "Mamá" },
  { id: 2, date: "2026-02-10", product: "Pastel de Pollo", quantityGood: 12, quantityDamaged: 0, producedBy: "Papá" },
  { id: 3, date: "2026-02-09", product: "Hayaca", quantityGood: 30, quantityDamaged: 1, producedBy: "Mamá" },
  { id: 4, date: "2026-02-09", product: "Pastel de Cerdo", quantityGood: 10, quantityDamaged: 3, producedBy: "Papá" },
  { id: 5, date: "2026-02-08", product: "Hayaca", quantityGood: 20, quantityDamaged: 0, producedBy: "Mamá" },
  { id: 6, date: "2026-02-08", product: "Pastel de Pollo", quantityGood: 15, quantityDamaged: 1, producedBy: "Papá" },
  { id: 7, date: "2026-02-07", product: "Hayaca", quantityGood: 18, quantityDamaged: 2, producedBy: "Mamá" },
];

const Inventory = () => {
  const [entries, setEntries] = useState(initialEntries);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ product: "Hayaca", quantityGood: 0, quantityDamaged: 0, producedBy: "" });

  const totalStock = entries.reduce((sum, e) => sum + e.quantityGood, 0);
  const totalDamaged = entries.reduce((sum, e) => sum + e.quantityDamaged, 0);

  const addEntry = () => {
    setEntries(prev => [{
      id: prev.length + 1,
      date: new Date().toISOString().split("T")[0],
      product: newEntry.product,
      quantityGood: newEntry.quantityGood,
      quantityDamaged: newEntry.quantityDamaged,
      producedBy: newEntry.producedBy,
    }, ...prev]);
    setNewEntry({ product: "Hayaca", quantityGood: 0, quantityDamaged: 0, producedBy: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">Producción e Inventario</h2>
          <p className="text-sm text-muted-foreground">Registro de producción semanal</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm text-primary-foreground font-bold rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Registrar Producción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Registrar Producción</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Producto</Label>
                <Select value={newEntry.product} onValueChange={v => setNewEntry(p => ({ ...p, product: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hayaca">Hayaca</SelectItem>
                    <SelectItem value="Pastel de Pollo">Pastel de Pollo</SelectItem>
                    <SelectItem value="Pastel de Cerdo">Pastel de Cerdo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cantidad Buena</Label>
                <Input type="number" min={0} value={newEntry.quantityGood || ""} onChange={e => setNewEntry(p => ({ ...p, quantityGood: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-destructive font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Averías (Dañadas)
                </Label>
                <Input
                  type="number" min={0}
                  value={newEntry.quantityDamaged || ""}
                  onChange={e => setNewEntry(p => ({ ...p, quantityDamaged: Number(e.target.value) }))}
                  className="border-destructive/50 text-destructive font-bold text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label>Producido por</Label>
                <Input value={newEntry.producedBy} onChange={e => setNewEntry(p => ({ ...p, producedBy: e.target.value }))} placeholder="Ej: Mamá, Papá" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addEntry} className="bg-gradient-warm text-primary-foreground font-bold rounded-xl w-full">
                Guardar Registro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="bg-gradient-warm rounded-xl p-2.5 text-primary-foreground">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Stock Total (Semana)</p>
          <p className="text-3xl font-black text-foreground mt-1">{totalStock}</p>
          <p className="text-xs text-muted-foreground">unidades producidas en buen estado</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="bg-gradient-to-br from-destructive to-destructive/80 rounded-xl p-2.5 text-destructive-foreground">
              <AlertTriangle className="w-5 h-5" />
            </div>
            {totalDamaged > 5 && (
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-destructive/10 text-destructive">¡Alto!</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-medium">Total Averías (Semana)</p>
          <p className="text-3xl font-black text-destructive mt-1">{totalDamaged}</p>
          <p className="text-xs text-muted-foreground">unidades dañadas o perdidas</p>
        </div>
      </div>

      {/* Production Log Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">📋 Registro de Producción</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50">
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold">Producto</TableHead>
                <TableHead className="font-semibold text-center">Cantidad (Buena)</TableHead>
                <TableHead className="font-semibold text-center text-destructive">Averías</TableHead>
                <TableHead className="font-semibold">Producido por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-accent/30">
                  <TableCell className="text-sm">{entry.date}</TableCell>
                  <TableCell className="font-semibold">{entry.product}</TableCell>
                  <TableCell className="text-center text-lg font-bold">{entry.quantityGood}</TableCell>
                  <TableCell className="text-center">
                    {entry.quantityDamaged > 0 ? (
                      <span className="text-lg font-black text-destructive">{entry.quantityDamaged}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.producedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
