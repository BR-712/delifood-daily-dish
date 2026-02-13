import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Upload, ImageIcon, X } from "lucide-react";
import { PaymentMethod, PAYMENT_METHODS, isDigitalMethod, PaymentLine } from "@/lib/data";

interface Props {
  totalAmount: number;
  onChange: (payments: PaymentLine[]) => void;
  payments: PaymentLine[];
}

const SplitPaymentForm = ({ totalAmount, onChange, payments }: Props) => {
  const [showSecond, setShowSecond] = useState(payments.length > 1);
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);

  const updatePayment = (index: number, updates: Partial<PaymentLine>) => {
    const next = [...payments];
    if (!next[index]) {
      next[index] = { method: "Efectivo", amount: 0 };
    }
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const handleFile = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updatePayment(index, { proofUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const totalPaid = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const remaining = totalAmount - totalPaid;

  const renderPaymentRow = (index: number, fileRef: React.RefObject<HTMLInputElement>) => {
    const p = payments[index] || { method: "Efectivo" as PaymentMethod, amount: 0 };
    const digital = isDigitalMethod(p.method);

    return (
      <div className="space-y-3 bg-accent/50 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Pago {index + 1}</Label>
          {index === 1 && (
            <Button
              variant="ghost" size="sm"
              className="text-destructive h-7 px-2"
              onClick={() => {
                onChange(payments.slice(0, 1));
                setShowSecond(false);
              }}
            >
              <X className="w-3.5 h-3.5 mr-1" /> Quitar
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => updatePayment(index, { method: m })}
              className={`py-2.5 px-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                p.method === m
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <Input
          type="number"
          placeholder="Monto"
          value={p.amount || ""}
          onChange={e => updatePayment(index, { amount: Number(e.target.value) || 0 })}
          className="h-12 text-xl font-bold text-center rounded-xl"
          min={0}
        />
        {digital && (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(index, e)} />
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl gap-2 h-10 text-sm"
              onClick={() => fileRef.current?.click()}
            >
              {p.proofUrl ? (
                <>
                  <ImageIcon className="w-4 h-4 text-success" />
                  <span className="text-success font-semibold">Comprobante cargado</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Subir Comprobante (obligatorio)
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {renderPaymentRow(0, fileRef1)}

      {!showSecond && (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl gap-2 text-sm h-10 border-dashed"
          onClick={() => {
            setShowSecond(true);
            if (payments.length < 2) {
              onChange([...payments, { method: "Efectivo", amount: 0 }]);
            }
          }}
        >
          <Plus className="w-4 h-4" /> Dividir Pago / Otro Medio
        </Button>
      )}

      {showSecond && renderPaymentRow(1, fileRef2)}

      {/* Summary */}
      {totalAmount > 0 && (
        <div className="bg-card border border-border rounded-xl p-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total del pedido</span>
            <span className="font-bold">${totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total pagado</span>
            <span className="font-bold">${totalPaid.toLocaleString()}</span>
          </div>
          {remaining > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-destructive font-semibold">Saldo pendiente</span>
              <span className="font-black text-destructive">${remaining.toLocaleString()}</span>
            </div>
          )}
          {remaining <= 0 && totalPaid > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-success font-semibold">Estado</span>
              <span className="font-black text-success">✓ Pagado</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SplitPaymentForm;
