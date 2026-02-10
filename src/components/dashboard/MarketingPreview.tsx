import { Download, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const MarketingPreview = () => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">🎨 Generador de Marketing</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Vista previa de la imagen promocional con marco Dalifood.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Preview mockup */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Frame */}
            <div className="bg-gradient-warm rounded-2xl p-1">
              <div className="bg-card rounded-xl overflow-hidden">
                {/* Top brand bar */}
                <div className="bg-gradient-warm px-4 py-3 flex items-center justify-between">
                  <span className="text-primary-foreground font-black text-lg">Dalifood</span>
                  <span className="text-primary-foreground/80 text-xs">Hayacas & Pasteles</span>
                </div>

                {/* Image area */}
                <div className="aspect-square bg-accent flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Image className="w-16 h-16 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Imagen del producto</p>
                  </div>
                </div>

                {/* Price overlay */}
                <div className="bg-gradient-golden px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-black text-secondary-foreground text-xl">Hayaca</p>
                    <p className="text-secondary-foreground/70 text-xs">Hecha con amor ❤️</p>
                  </div>
                  <div className="bg-card rounded-xl px-4 py-2">
                    <span className="font-black text-2xl text-foreground">$15.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 justify-center">
          <Button className="bg-gradient-warm text-primary-foreground font-bold rounded-xl h-12 gap-2">
            <Download className="w-5 h-5" />
            Descargar Imagen
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Formato: PNG 1080×1080 • Listo para Instagram
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketingPreview;
