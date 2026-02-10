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

const RegisterBatchModal = ({ open, onOpenChange }: Props) => {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [damaged, setDamaged] = useState("");

  const handleSubmit = () => {
    toast.success(`Lote registrado: ${quantity} ${product} (${damaged || 0} averías)`);
    setProduct("");
    setQuantity("");
    setDamaged("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Registrar Lote</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Producto</Label>
            <Select value={product} onValueChange={setProduct}>
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
            <Label className="text-base font-semibold">Cantidad Hecha</Label>
            <Input
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-14 text-2xl font-bold text-center rounded-xl"
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-destructive">⚠️ Averías (Dañadas)</Label>
            <Input
              type="number"
              placeholder="0"
              value={damaged}
              onChange={(e) => setDamaged(e.target.value)}
              className="h-14 text-2xl font-bold text-center rounded-xl border-destructive/50 bg-destructive/5 text-destructive focus-visible:ring-destructive"
              min={0}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!product || !quantity}
            className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-warm text-primary-foreground"
          >
            Guardar Lote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterBatchModal;
