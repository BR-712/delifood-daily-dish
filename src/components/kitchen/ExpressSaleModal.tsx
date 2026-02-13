import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { PRODUCTS, PaymentLine } from "@/lib/data";
import SplitPaymentForm from "./SplitPaymentForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExpressSaleModal = ({ open, onOpenChange }: Props) => {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [payments, setPayments] = useState<PaymentLine[]>([{ method: "Efectivo", amount: 0 }]);

  const activeProducts = PRODUCTS.filter(p => p.active);
  const productPrice = activeProducts.find(p => p.id === product)?.price || 0;
  const suggestedPrice = productPrice * Number(quantity || 1);
  const finalPrice = Number(price) || suggestedPrice;

  const handleProductChange = (val: string) => {
    setProduct(val);
    const p = activeProducts.find(pr => pr.id === val);
    if (p) setPrice(String(p.price * Number(quantity || 1)));
  };

  const handleQuantityChange = (val: string) => {
    setQuantity(val);
    if (product) {
      setPrice(String(productPrice * Number(val || 1)));
    }
  };

  const totalPaid = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const paymentStatus = totalPaid >= finalPrice ? "Pagado" : totalPaid > 0 ? "Parcial" : "Pendiente";

  const handleSubmit = () => {
    toast.success(`Venta registrada: ${quantity}x ${product} por $${finalPrice.toLocaleString()} (${paymentStatus})`);
    setProduct("");
    setQuantity("1");
    setPrice("");
    setPayments([{ method: "Efectivo", amount: 0 }]);
    onOpenChange(false);
  };

  const hasValidPayment = payments.some(p => p.amount > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Venta Rápida</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Producto</Label>
            <Select value={product} onValueChange={handleProductChange}>
              <SelectTrigger className="h-14 text-lg rounded-xl">
                <SelectValue placeholder="Seleccionar producto..." />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                {activeProducts.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Cantidad</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="h-14 text-2xl font-bold text-center rounded-xl"
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Precio Negociado</Label>
            {suggestedPrice > 0 && (
              <p className="text-sm text-muted-foreground">
                Precio sugerido: <span className="font-semibold text-foreground">${suggestedPrice.toLocaleString()}</span>
              </p>
            )}
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-14 text-2xl font-bold text-center rounded-xl border-secondary bg-secondary/10"
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Pago</Label>
            <SplitPaymentForm
              totalAmount={finalPrice}
              payments={payments}
              onChange={setPayments}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!product || !quantity || !price || !hasValidPayment}
            className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-golden text-secondary-foreground"
          >
            Registrar Venta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpressSaleModal;
