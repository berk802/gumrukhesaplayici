import { FileText, AlertTriangle, Euro, Percent, Package, Globe, Info } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function CustomsInfo() {
  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Gümrük Bilgisi
          </h1>
          <p className="text-muted-foreground mt-1">
            2026 yılı yeni gümrük düzenlemeleri hakkında bilgi
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="border-warning bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground text-lg">Önemli Değişiklik!</h3>
                <p className="text-muted-foreground mt-1">
                  Ocak 2026 itibarıyla 30 Euro'luk gümrük muafiyeti kaldırılmıştır. 
                  Artık tüm yurtdışı alışverişlerinden vergi alınmaktadır.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Rates */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                AB Ülkeleri
              </CardTitle>
              <CardDescription>Avrupa Birliği üyesi ülkeler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold font-display text-primary">%30</div>
              <p className="text-muted-foreground mt-2">
                Almanya, Fransa, İtalya, İspanya ve diğer AB ülkeleri
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Globe className="w-5 h-5 text-destructive" />
                Diğer Ülkeler
              </CardTitle>
              <CardDescription>AB dışı ülkeler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold font-display text-destructive">%60</div>
              <p className="text-muted-foreground mt-2">
                Çin, ABD, İngiltere ve AB dışı tüm ülkeler
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <Euro className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="font-bold text-foreground">Gümrük Sunum Ücreti</h4>
              <p className="text-2xl font-bold font-display text-primary mt-2">200 TL</p>
              <p className="text-sm text-muted-foreground mt-1">Her sipariş için sabit</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Percent className="w-10 h-10 mx-auto mb-3 text-warning" />
              <h4 className="font-bold text-foreground">ÖTV (Lüks Ürünler)</h4>
              <p className="text-2xl font-bold font-display text-warning mt-2">+%20</p>
              <p className="text-sm text-muted-foreground mt-1">Elektronik, kozmetik vb.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="font-bold text-foreground">Yıllık Sipariş Limiti</h4>
              <p className="text-2xl font-bold font-display text-primary mt-2">5 Adet</p>
              <p className="text-sm text-muted-foreground mt-1">Kişi başı yıllık limit</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Sık Sorulan Sorular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>30 Euro muafiyeti neden kaldırıldı?</AccordionTrigger>
                <AccordionContent>
                  Türkiye, yurt içi üretimi korumak ve vergi gelirlerini artırmak amacıyla 
                  Ocak 2026'da tüm yurtdışı alışverişlerinden vergi almaya başlamıştır. 
                  Bu düzenleme ile tüm e-ticaret siparişleri vergilendirilmektedir.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Vergi nasıl hesaplanır?</AccordionTrigger>
                <AccordionContent>
                  Vergi, ürünün Euro fiyatının güncel kurla TL'ye çevrilmesiyle oluşan 
                  matrah üzerinden hesaplanır. AB ülkelerinden %30, diğer ülkelerden %60 
                  oranında gümrük vergisi uygulanır. Lüks ürünlere ek olarak %20 ÖTV eklenir.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>ÖTV hangi ürünlere uygulanır?</AccordionTrigger>
                <AccordionContent>
                  Özel Tüketim Vergisi (ÖTV) genellikle elektronik cihazlar, parfüm, 
                  kozmetik ürünler, lüks aksesuarlar ve belirli alkollü içecekler gibi 
                  ürün kategorilerine uygulanmaktadır.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Yıllık 5 sipariş limiti ne anlama geliyor?</AccordionTrigger>
                <AccordionContent>
                  Her Türk vatandaşı yılda maksimum 5 adet yurtdışı sipariş verebilir. 
                  Bu limit, sipariş sayısı üzerinden hesaplanır, sipariş değeri veya 
                  içerikteki ürün sayısı önemli değildir.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Gümrük sunum ücreti nedir?</AccordionTrigger>
                <AccordionContent>
                  Gümrük sunum ücreti, gümrük işlemlerinin yürütülmesi için alınan 
                  sabit bir ücrettir. Her sipariş için 200 TL olarak uygulanmaktadır. 
                  Bu ücret, siparişin değerinden bağımsız olarak tüm siparişlere eklenir.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Yasal Uyarı</p>
                <p>
                  Bu bilgiler genel bilgilendirme amaçlıdır ve resmi mevzuat yerine geçmez. 
                  Güncel ve detaylı bilgi için Ticaret Bakanlığı resmi kaynaklarını 
                  incelemenizi öneririz. Hesaplamalar tahmini olup, gerçek vergiler 
                  farklılık gösterebilir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
