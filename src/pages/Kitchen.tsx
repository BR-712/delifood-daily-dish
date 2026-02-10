import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import RegisterBatchModal from "@/components/kitchen/RegisterBatchModal";
import ExpressSaleModal from "@/components/kitchen/ExpressSaleModal";
import TodayOrders from "@/components/kitchen/TodayOrders";

const Kitchen = () => {
  const navigate = useNavigate();
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  const dailyGoals = [
    { product: "Hayacas", goal: 64, done: 20 },
    { product: "Pastel de Pollo", goal: 30, done: 12 },
    { product: "Pastel de Cerdo", goal: 20, done: 8 },
  ];

  return (
    <div className="min-h-screen bg-kitchen-bg">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate("/")} className="text-muted-foreground p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground capitalize">{today}</h1>
          <div className="w-10" />
        </div>

        {/* Goal Progress - All Products */}
        <div className="space-y-3">
          {dailyGoals.map((item) => {
            const percent = Math.round((item.done / item.goal) * 100);
            return (
              <div key={item.product} className="bg-accent rounded-xl p-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-semibold text-foreground">Meta Diaria: {item.product}</span>
                  <span className="text-2xl font-black text-primary">{item.done}/{item.goal}</span>
                </div>
                <Progress value={percent} className="h-4 rounded-full bg-muted [&>div]:bg-gradient-warm [&>div]:rounded-full" />
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Action Area */}
      <main className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Big Buttons */}
        <div className="grid gap-4">
          <button
            onClick={() => setBatchModalOpen(true)}
            className="kitchen-button bg-gradient-warm text-primary-foreground shadow-warm-lg flex items-center justify-center gap-4 min-h-[100px]"
          >
            <Package className="w-10 h-10" />
            <span className="text-2xl">Registrar Lote</span>
          </button>

          <button
            onClick={() => setSaleModalOpen(true)}
            className="kitchen-button bg-gradient-golden text-secondary-foreground shadow-warm flex items-center justify-center gap-4 min-h-[100px]"
          >
            <ShoppingCart className="w-10 h-10" />
            <span className="text-2xl">Venta Rápida</span>
          </button>
        </div>

        {/* Today's Orders */}
        <TodayOrders />
      </main>

      {/* Modals */}
      <RegisterBatchModal open={batchModalOpen} onOpenChange={setBatchModalOpen} />
      <ExpressSaleModal open={saleModalOpen} onOpenChange={setSaleModalOpen} />
    </div>
  );
};

export default Kitchen;
