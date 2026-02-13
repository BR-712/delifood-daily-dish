import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Check, X } from "lucide-react";
import { PRODUCTS, Product } from "@/lib/data";

const Products = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editName, setEditName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0 });

  const toggleActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(String(p.price));
    setEditName(p.name);
  };

  const saveEdit = (id: string) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, name: editName, price: Number(editPrice) || p.price } : p
    ));
    setEditingId(null);
  };

  const addProduct = () => {
    const id = newProduct.name.toLowerCase().replace(/\s+/g, "_");
    setProducts(prev => [...prev, { id, name: newProduct.name, price: newProduct.price, active: true }]);
    setNewProduct({ name: "", price: 0 });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">Productos</h2>
          <p className="text-sm text-muted-foreground">Administra precios y disponibilidad. Los precios se guardan al crear cada pedido.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm text-primary-foreground font-bold rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Nuevo Producto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Empanada" />
              </div>
              <div className="space-y-2">
                <Label>Precio Unitario</Label>
                <Input type="number" min={0} value={newProduct.price || ""} onChange={e => setNewProduct(p => ({ ...p, price: Number(e.target.value) }))} className="font-bold text-lg" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addProduct} disabled={!newProduct.name || !newProduct.price} className="bg-gradient-warm text-primary-foreground font-bold rounded-xl w-full">
                Crear Producto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/50">
              <TableHead className="font-semibold">Producto</TableHead>
              <TableHead className="font-semibold">Precio Unitario</TableHead>
              <TableHead className="font-semibold text-center">Activo</TableHead>
              <TableHead className="font-semibold text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(p => (
              <TableRow key={p.id} className={`hover:bg-accent/30 ${!p.active ? "opacity-50" : ""}`}>
                <TableCell>
                  {editingId === p.id ? (
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-8 w-40" autoFocus />
                  ) : (
                    <span className="font-semibold">{p.name}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === p.id ? (
                    <Input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="h-8 w-28 font-bold" />
                  ) : (
                    <span className="font-bold">${p.price.toLocaleString()}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={p.active} onCheckedChange={() => toggleActive(p.id)} />
                </TableCell>
                <TableCell className="text-center">
                  {editingId === p.id ? (
                    <div className="flex items-center justify-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-success" onClick={() => saveEdit(p.id)}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => startEdit(p)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-accent/50 rounded-xl p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">📌 Nota sobre precios:</strong> Al crear un pedido, el precio actual se guarda como "snapshot". Cambiar el precio aquí no afecta pedidos anteriores.
      </div>
    </div>
  );
};

export default Products;
