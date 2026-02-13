import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  PRODUCTS,
  initialOrders,
  DEFAULT_RECIPE_CONFIG,
  calculateIngredients,
  type RecipeConfig,
} from "@/lib/data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: RecipeConfig;
}

const IngredientCalculatorModal = ({ open, onOpenChange, config }: Props) => {
  const recipeConfig = config || DEFAULT_RECIPE_CONFIG;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = format(tomorrow, "yyyy-MM-dd");
  const dateLabel = format(tomorrow, "EEEE d 'de' MMMM", { locale: es });

  // Filter orders for tomorrow (or today for demo if none found)
  let targetOrders = initialOrders.filter(
    (o) => o.deliveryDate === dateStr && o.status !== "Entregado"
  );
  if (targetOrders.length === 0) {
    // Fallback: show orders for 2026-02-14 as demo
    targetOrders = initialOrders.filter(
      (o) => o.deliveryDate === "2026-02-14" && o.status !== "Entregado"
    );
  }

  const summary = calculateIngredients(targetOrders, PRODUCTS, recipeConfig);
  const totalPasteles =
    summary.chickenPieces + summary.porkPieces > 0
      ? targetOrders.reduce((sum, o) => {
          return (
            sum +
            (o.orderItems || [])
              .filter((i) => {
                const p = PRODUCTS.find((p) => p.id === i.productId);
                return p && !p.isHayaca;
              })
              .reduce((s, i) => s + i.quantity, 0)
          );
        }, 0)
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            👩‍🍳 Calculadora de Insumos
          </DialogTitle>
          <p className="text-sm text-muted-foreground capitalize">{dateLabel}</p>
          <Badge variant="outline" className="w-fit text-xs font-semibold">
            {targetOrders.length} pedidos pendientes
          </Badge>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Rice Section */}
          <div className="bg-accent rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              🍚 Arroces Adobados
            </h3>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-lg p-3 text-center">
                <span className="text-2xl">🐔</span>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Arroz de Pollo
                </p>
                <p className="text-2xl font-black text-primary">
                  {summary.chickenRiceLbs}
                </p>
                <p className="text-xs text-muted-foreground">Libras</p>
              </div>
              <div className="bg-card rounded-lg p-3 text-center">
                <span className="text-2xl">🐷</span>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Arroz de Cerdo
                </p>
                <p className="text-2xl font-black text-primary">
                  {summary.porkRiceLbs}
                </p>
                <p className="text-xs text-muted-foreground">Libras</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Factor: {recipeConfig.riceFactor} Lb/pastel · {totalPasteles} pasteles totales
            </p>
          </div>

          {/* Meat Section */}
          <div className="bg-accent rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              🥩 Presas de Carne
            </h3>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-lg p-3 text-center">
                <span className="text-2xl">🍗</span>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Presas de Pollo
                </p>
                <p className="text-2xl font-black text-primary">
                  {summary.chickenPieces}
                </p>
                <p className="text-xs text-muted-foreground">unidades</p>
              </div>
              <div className="bg-card rounded-lg p-3 text-center">
                <span className="text-2xl">🥩</span>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Presas de Cerdo
                </p>
                <p className="text-2xl font-black text-primary">
                  {summary.porkPieces}
                </p>
                <p className="text-xs text-muted-foreground">unidades</p>
              </div>
            </div>
          </div>

          {/* Flour Section */}
          {summary.totalHayacas > 0 && (
            <div className="bg-accent rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                🌽 Masa de Maíz (Hayacas)
              </h3>
              <Separator />
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  {summary.totalHayacas} hayacas a producir
                </p>
                <p className="text-3xl font-black text-primary">
                  {summary.flourLbs} <span className="text-base font-bold">Lb</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ({summary.flourBags} Bolsas de 1kg)
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Rendimiento: {recipeConfig.flourPerPound} hayacas/Lb · {recipeConfig.flourPerBag} hayacas/bolsa
              </p>
            </div>
          )}

          {/* Order breakdown */}
          <div className="bg-accent/50 rounded-xl p-3">
            <h4 className="text-sm font-bold text-foreground mb-2">📋 Resumen de Pedidos</h4>
            <div className="space-y-1">
              {targetOrders.map((o) => (
                <div key={o.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{o.client}</span>
                  <span className="font-medium text-foreground">{o.items}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientCalculatorModal;
