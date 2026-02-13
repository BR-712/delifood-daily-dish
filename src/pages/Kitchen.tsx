import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, ShoppingCart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import RegisterBatchModal from "@/components/kitchen/RegisterBatchModal";
import ExpressSaleModal from "@/components/kitchen/ExpressSaleModal";
import TodayOrders from "@/components/kitchen/TodayOrders";
import { initialDailyGoals, DailyGoal } from "@/lib/data";

const Kitchen = () => {
  const navigate = useNavigate();
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [goals, setGoals] = useState<DailyGoal[]>(initialDailyGoals);

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  const pendingGoals = goals.filter(g => g.done < g.goal);
  const allGoals = goals;

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

        {/* Goal Carousel - horizontal swipe, auto-hide completed */}
        {pendingGoals.length > 0 ? (
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {pendingGoals.map((item) => {
                const remaining = item.goal - item.done;
                return (
                  <CarouselItem key={item.productId} className="pl-2 basis-[70%] sm:basis-[45%]">
                    <div className="bg-accent rounded-xl p-4">
                      <p className="text-sm font-semibold text-muted-foreground mb-1">{item.product}</p>
                      <div className="flex items-baseline justify-between">
                        <span className="text-4xl font-black text-primary">
                          {remaining}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">
                          faltan
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.done}/{item.goal} hechas
                      </p>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="bg-success/10 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-success" />
            <span className="font-bold text-success">¡Todas las metas cumplidas! 🎉</span>
          </div>
        )}
      </header>

      {/* Main Area */}
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

        {/* Tabs: Pedidos + Detalles */}
        <Tabs defaultValue="pedidos" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-xl h-12">
            <TabsTrigger value="pedidos" className="text-base font-bold rounded-lg">📋 Pedidos</TabsTrigger>
            <TabsTrigger value="detalles" className="text-base font-bold rounded-lg">📊 Detalles</TabsTrigger>
          </TabsList>

          <TabsContent value="pedidos">
            <TodayOrders />
          </TabsContent>

          <TabsContent value="detalles">
            <div className="bg-card rounded-2xl border border-border overflow-hidden mt-3">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent/50">
                    <TableHead className="font-semibold">Producto</TableHead>
                    <TableHead className="font-semibold text-center">Meta</TableHead>
                    <TableHead className="font-semibold text-center">Hechas</TableHead>
                    <TableHead className="font-semibold text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allGoals.map(g => (
                    <TableRow key={g.productId}>
                      <TableCell className="font-semibold">{g.product}</TableCell>
                      <TableCell className="text-center text-lg font-bold">{g.goal}</TableCell>
                      <TableCell className="text-center text-lg font-bold">{g.done}</TableCell>
                      <TableCell className="text-center">
                        {g.done >= g.goal ? (
                          <CheckCircle2 className="w-6 h-6 text-success mx-auto" />
                        ) : (
                          <span className="text-sm font-semibold text-primary">
                            Faltan {g.goal - g.done}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <RegisterBatchModal open={batchModalOpen} onOpenChange={setBatchModalOpen} />
      <ExpressSaleModal open={saleModalOpen} onOpenChange={setSaleModalOpen} />
    </div>
  );
};

export default Kitchen;
