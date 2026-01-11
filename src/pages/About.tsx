import { Calculator, Code, Heart, ExternalLink, Shield, Zap, Globe } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-6 w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Calculator className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Gümrük Vergisi Hesaplayıcı
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            2026 Yeni Düzenlemeler
          </p>
        </div>

        {/* Description */}
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed">
              Bu uygulama, Ocak 2026'da yürürlüğe giren yeni gümrük düzenlemelerine göre 
              yurtdışı alışverişlerinizin toplam maliyetini hesaplamanıza yardımcı olur. 
              30 Euro muafiyetinin kaldırılmasıyla birlikte tüm siparişlerden vergi alınmaya 
              başlanmıştır. Hesaplayıcımız ile AB ülkeleri (%30) ve diğer ülkeler (%60) için 
              geçerli vergi oranlarını, ÖTV'yi ve gümrük sunum ücretini dahil ederek 
              gerçekçi maliyet hesaplamaları yapabilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Hızlı Hesaplama</h3>
              <p className="text-sm text-muted-foreground">
                Saniyeler içinde toplam maliyeti öğrenin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Güvenli Kayıt</h3>
              <p className="text-sm text-muted-foreground">
                Hesaplamalarınız güvenle saklanır
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Güncel Bilgi</h3>
              <p className="text-sm text-muted-foreground">
                2026 düzenlemelerine uygun
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Teknolojiler
            </CardTitle>
            <CardDescription>Bu projede kullanılan teknolojiler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "TypeScript",
                "Tailwind CSS",
                "Shadcn/UI",
                "Lucide Icons",
                "Lovable Cloud",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Version & Credits */}
        <Card className="gradient-dark text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-primary-foreground/70">Versiyon</p>
                <p className="text-xl font-bold font-display">1.0.0</p>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-destructive fill-destructive" />
                <span>in Turkey</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-muted/30">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Bu uygulama bilgilendirme amaçlıdır. Hesaplamalar tahmini olup resmi 
              değerlendirmeler için Ticaret Bakanlığı'na başvurunuz.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
