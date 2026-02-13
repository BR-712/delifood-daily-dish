import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS, DEFAULT_RECIPE_CONFIG, type RecipeConfig } from "@/lib/data";

const Recipes = () => {
  const [config, setConfig] = useState<RecipeConfig>({ ...DEFAULT_RECIPE_CONFIG });

  const handleSave = () => {
    toast.success("Configuración de recetas guardada correctamente");
  };

  const handleReset = () => {
    setConfig({ ...DEFAULT_RECIPE_CONFIG });
    toast.info("Valores restaurados a los predeterminados");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-foreground">Configuración de Recetas</h2>
        <p className="text-sm text-muted-foreground">
          Ajusta los factores de rendimiento para el cálculo automático de insumos en la cocina.
        </p>
      </div>

      {/* Yield factors */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            ⚙️ Factores de Rendimiento
          </CardTitle>
          <CardDescription>
            Estos valores se usan en la Calculadora de Insumos de la vista de Cocina.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                🍚 Factor Arroz
              </Label>
              <p className="text-xs text-muted-foreground">Libras de arroz por cada pastel</p>
              <Input
                type="number"
                step="0.001"
                min="0"
                value={config.riceFactor}
                onChange={(e) => setConfig((c) => ({ ...c, riceFactor: Number(e.target.value) || 0 }))}
                className="h-12 text-lg font-bold text-center"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                🌽 Hayacas por Libra
              </Label>
              <p className="text-xs text-muted-foreground">Rendimiento de harina por libra</p>
              <Input
                type="number"
                min="1"
                value={config.flourPerPound}
                onChange={(e) => setConfig((c) => ({ ...c, flourPerPound: Number(e.target.value) || 1 }))}
                className="h-12 text-lg font-bold text-center"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                🌽 Hayacas por Bolsa (1kg)
              </Label>
              <p className="text-xs text-muted-foreground">Rendimiento por bolsa de 1kg</p>
              <Input
                type="number"
                min="1"
                value={config.flourPerBag}
                onChange={(e) => setConfig((c) => ({ ...c, flourPerBag: Number(e.target.value) || 1 }))}
                className="h-12 text-lg font-bold text-center"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="bg-gradient-warm text-primary-foreground font-bold rounded-xl gap-2"
            >
              <Check className="w-4 h-4" /> Guardar Configuración
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="font-bold rounded-xl gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Restaurar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product composition table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📦 Composición de Productos
          </CardTitle>
          <CardDescription>
            Cada producto tiene su base de arroz y composición de carnes definida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/50">
                  <TableHead className="font-semibold">Producto</TableHead>
                  <TableHead className="font-semibold text-center">Base Arroz</TableHead>
                  <TableHead className="font-semibold text-center">🍗 Pollo</TableHead>
                  <TableHead className="font-semibold text-center">🥩 Cerdo</TableHead>
                  <TableHead className="font-semibold text-center">Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PRODUCTS.map((p) => (
                  <TableRow key={p.id} className={!p.active ? "opacity-50" : ""}>
                    <TableCell className="font-semibold">{p.name}</TableCell>
                    <TableCell className="text-center">
                      {p.riceBase === "chicken" && (
                        <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">
                          🐔 Pollo
                        </Badge>
                      )}
                      {p.riceBase === "pork" && (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                          🐷 Cerdo
                        </Badge>
                      )}
                      {p.riceBase === "none" && (
                        <Badge variant="outline" className="text-muted-foreground">N/A</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-lg font-bold">
                      {p.meatComposition.chicken > 0 ? p.meatComposition.chicken : "—"}
                    </TableCell>
                    <TableCell className="text-center text-lg font-bold">
                      {p.meatComposition.pork > 0 ? p.meatComposition.pork : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {p.isHayaca ? (
                        <Badge className="bg-warning text-warning-foreground">Hayaca</Badge>
                      ) : (
                        <Badge variant="secondary">Pastel</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recipes;
