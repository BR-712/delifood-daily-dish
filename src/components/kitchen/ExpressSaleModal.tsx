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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRICES: Record<string, number> = {
  hayaca: 15000,
  pastel_pollo: 12000,
  pastel_cerdo: 12000,
};

const paymentMethods = ["Nequi", "Daviplata", "Efectivo", "Transferencia"];

const ExpressSaleModal = ({ open, onOpenChange }: Props) => {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const suggestedPrice = product ? PRICES[product] * Number(quantity || 1) : 0;

  const handleProductChange = (val: string) => {
    setProduct(val);
    setPrice(String(PRICES[val] * Number(quantity || 1)));
  };

  const handleQuantityChange = (val: string) => {
    setQuantity(val);
    if (product) {
      setPrice(String(PRICES[product] * Number(val || 1)));
    }
  };

  const handleSubmit = () => {
    toast.success(`Venta registrada: ${quantity}x ${product} por $${Number(price).toLocaleString()}`);
    setProduct("");
    setQuantity("1");
    setPrice("");
    setPaymentMethod("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-md mx-auto">
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
                <SelectItem value="hayaca">Hayaca</SelectItem>
                <SelectItem value="pastel_pollo">Pastel de Pollo</SelectItem>
                <SelectItem value="pastel_cerdo">Pastel de Cerdo</SelectItem>
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
            <Label className="text-base font-semibold">Método de Pago</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-3 px-4 rounded-xl font-semibold text-base transition-all border-2 ${
                    paymentMethod === method
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!product || !quantity || !price || !paymentMethod}
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
