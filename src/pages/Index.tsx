import { useNavigate } from "react-router-dom";
import { LayoutDashboard, ChefHat } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8 text-center">
        {/* Logo / Brand */}
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gradient-warm tracking-tight">
            Dalifood
          </h1>
          <p className="text-muted-foreground text-lg">
            Hayacas & Pasteles — Gestión Integral
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <p className="text-foreground font-semibold text-xl">¿Quién eres?</p>

          <div className="grid gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="group relative overflow-hidden bg-card rounded-2xl border border-border p-8 shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-5">
                <div className="bg-gradient-warm rounded-xl p-4 text-primary-foreground shrink-0">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="text-xl font-bold text-foreground block">Administración</span>
                  <span className="text-muted-foreground text-sm">Panel de control, pedidos, inventario y finanzas</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/cocina")}
              className="group relative overflow-hidden bg-card rounded-2xl border border-border p-8 shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-5">
                <div className="bg-gradient-golden rounded-xl p-4 text-secondary-foreground shrink-0">
                  <ChefHat className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="text-xl font-bold text-foreground block">Cocina</span>
                  <span className="text-muted-foreground text-sm">Registro de producción y ventas rápidas</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          © 2026 Dalifood · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default Index;
