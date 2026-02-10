import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Download, Upload, Image as ImageIcon } from "lucide-react";

const frames = [
  { value: "hayaca-promo", label: "Hayaca Promo", tagline: "La mejor Hayaca de la ciudad 🔥" },
  { value: "pastel-promo", label: "Pastel Promo", tagline: "Pasteles artesanales con amor ❤️" },
  { value: "combo", label: "Combo Familiar", tagline: "¡Pide tu combo y ahorra! 🎉" },
];

const Marketing = () => {
  const [selectedFrame, setSelectedFrame] = useState("hayaca-promo");
  const [priceText, setPriceText] = useState("$15.000");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const frame = frames.find(f => f.value === selectedFrame)!;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-foreground">Marketing</h2>
        <p className="text-sm text-muted-foreground">Genera imágenes promocionales para redes sociales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <h3 className="font-bold text-lg text-foreground">Configuración</h3>

          <div className="space-y-2">
            <Label>Imagen del Producto</Label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Button variant="outline" className="w-full rounded-xl gap-2 h-12" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
              {imagePreview ? "Cambiar Imagen" : "Subir Imagen"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Marco / Plantilla</Label>
            <Select value={selectedFrame} onValueChange={setSelectedFrame}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {frames.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Texto de Precio</Label>
            <Input value={priceText} onChange={e => setPriceText(e.target.value)} className="rounded-xl font-bold text-lg" placeholder="$15.000" />
          </div>

          <Button className="bg-gradient-warm text-primary-foreground font-bold rounded-xl h-12 gap-2 w-full">
            <Download className="w-5 h-5" />
            Descargar Imagen
          </Button>
          <p className="text-xs text-muted-foreground text-center">PNG 1080×1080 • Listo para Instagram</p>
        </div>

        {/* Right: Preview */}
        <div className="flex justify-center items-start">
          <div className="w-full max-w-sm">
            <p className="text-sm font-medium text-muted-foreground mb-3">Vista Previa</p>
            <div className="bg-gradient-warm rounded-2xl p-1">
              <div className="bg-card rounded-xl overflow-hidden">
                {/* Top brand bar */}
                <div className="bg-gradient-warm px-4 py-3 flex items-center justify-between">
                  <span className="text-primary-foreground font-black text-lg">Dalifood</span>
                  <span className="text-primary-foreground/80 text-xs">Hayacas & Pasteles</span>
                </div>

                {/* Image area */}
                <div className="aspect-square bg-accent flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Producto" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Sube una imagen</p>
                    </div>
                  )}
                </div>

                {/* Price overlay */}
                <div className="bg-gradient-golden px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-black text-secondary-foreground text-xl">
                      {frame.label.replace(" Promo", "")}
                    </p>
                    <p className="text-secondary-foreground/70 text-xs">{frame.tagline}</p>
                  </div>
                  <div className="bg-card rounded-xl px-4 py-2">
                    <span className="font-black text-2xl text-foreground">{priceText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
