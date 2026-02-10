import { DollarSign, Package, AlertTriangle, Smartphone } from "lucide-react";

const metrics = [
  {
    label: "Ventas Hoy",
    value: "$345.000",
    change: "+12%",
    icon: DollarSign,
    gradient: "bg-gradient-warm",
  },
  {
    label: "Producción vs Pedidos",
    value: "48 / 64",
    change: "Faltan 16",
    icon: Package,
    gradient: "bg-gradient-golden",
    alert: true,
  },
  {
    label: "Dinero en Nequi",
    value: "$220.000",
    change: "Sin conciliar: $45.000",
    icon: Smartphone,
    gradient: "bg-gradient-warm",
  },
  {
    label: "Averías Hoy",
    value: "3",
    change: "Hayacas dañadas",
    icon: AlertTriangle,
    gradient: "bg-gradient-to-br from-destructive to-destructive/80",
    alert: true,
  },
];

const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-warm transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`${m.gradient} rounded-xl p-2.5 text-primary-foreground`}>
              <m.icon className="w-5 h-5" />
            </div>
            {m.alert && (
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-destructive/10 text-destructive animate-pulse-warm">
                ¡Alerta!
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-medium">{m.label}</p>
          <p className="text-2xl font-black text-foreground mt-1">{m.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{m.change}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
