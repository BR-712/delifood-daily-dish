import { AlertTriangle } from "lucide-react";

const inventory = [
  { product: "Hayaca", produced: 48, damaged: 3, reserved: 32, available: 13 },
  { product: "Pastel de Pollo", produced: 20, damaged: 1, reserved: 15, available: 4 },
  { product: "Pastel de Cerdo", produced: 12, damaged: 0, reserved: 14, available: -2 },
];

const InventoryWidget = () => {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">📦 Inventario en Tiempo Real</h3>
        <p className="text-sm text-muted-foreground">Producido − Averías − Reservado = Disponible</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-accent/50 text-sm text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold text-center">Producido</th>
              <th className="px-4 py-3 font-semibold text-center text-destructive">Averías</th>
              <th className="px-4 py-3 font-semibold text-center">Reservado</th>
              <th className="px-4 py-3 font-semibold text-center">Disponible</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.product} className="border-t border-border hover:bg-accent/30">
                <td className="px-4 py-4 font-semibold text-foreground">{item.product}</td>
                <td className="px-4 py-4 text-center text-lg font-bold text-foreground">{item.produced}</td>
                <td className="px-4 py-4 text-center text-lg font-bold text-destructive">{item.damaged}</td>
                <td className="px-4 py-4 text-center text-lg font-bold text-foreground">{item.reserved}</td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 text-lg font-black px-3 py-1 rounded-lg ${
                      item.available < 0
                        ? "bg-destructive/15 text-destructive"
                        : item.available <= 5
                        ? "bg-secondary/20 text-secondary-foreground"
                        : "bg-success/15 text-success"
                    }`}
                  >
                    {item.available < 0 && <AlertTriangle className="w-4 h-4" />}
                    {item.available}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryWidget;
