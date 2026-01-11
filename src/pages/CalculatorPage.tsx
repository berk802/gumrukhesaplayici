import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Euro, MapPin, Tag, ArrowRight, Info } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EURO_RATE = 38;
const CUSTOMS_FEE = 200;

const countries = [
  { value: "eu", label: "AB (Avrupa Birliği)", taxRate: 30 },
  { value: "other", label: "Diğer (Çin, ABD vb.)", taxRate: 60 },
];

const categories = [
  { value: "standard", label: "Standart Ürün", otvRate: 0 },
  { value: "luxury", label: "Lüks / ÖTV'li Ürün", otvRate: 20 },
];

interface CalculationResult {
  productName: string;
  priceEuro: number;
  basePriceTL: number;
  country: string;
  taxRate: number;
  taxAmount: number;
  category: string;
  otvRate: number;
  otvAmount: number;
  customsFee: number;
  total: number;
}

export default function CalculatorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [productName, setProductName] = useState("");
  const [priceEuro, setPriceEuro] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = async () => {
    if (!productName || !priceEuro || !selectedCountry || !selectedCategory) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Lütfen tüm alanları doldurun.",
      });
      return;
    }

    setIsCalculating(true);

    const price = parseFloat(priceEuro);
    const country = countries.find((c) => c.value === selectedCountry)!;
    const category = categories.find((c) => c.value === selectedCategory)!;

    const basePriceTL = price * EURO_RATE;
    const taxAmount = basePriceTL * (country.taxRate / 100);
    const otvAmount = basePriceTL * (category.otvRate / 100);
    const total = basePriceTL + taxAmount + otvAmount + CUSTOMS_FEE;

    const calculationResult: CalculationResult = {
      productName,
      priceEuro: price,
      basePriceTL,
      country: country.label,
      taxRate: country.taxRate,
      taxAmount,
      category: category.label,
      otvRate: category.otvRate,
      otvAmount,
      customsFee: CUSTOMS_FEE,
      total,
    };

    // Save to database
    const { error } = await supabase.from("calculations").insert({
      user_id: user?.id,
      product_name: productName,
      price_euro: price,
      country: selectedCountry,
      category: selectedCategory,
      base_price_tl: basePriceTL,
      tax_rate: country.taxRate,
      tax_amount_tl: taxAmount,
      otv_rate: category.otvRate,
      otv_amount_tl: otvAmount,
      customs_fee_tl: CUSTOMS_FEE,
      total_tl: total,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Hesaplama kaydedilemedi.",
      });
    } else {
      toast({
        title: "Hesaplama Tamamlandı",
        description: "Sonuç aşağıda görüntüleniyor.",
      });
    }

    setResult(calculationResult);
    setIsCalculating(false);
  };

  const resetForm = () => {
    setProductName("");
    setPriceEuro("");
    setSelectedCountry("");
    setSelectedCategory("");
    setResult(null);
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Vergi Hesaplayıcı
          </h1>
          <p className="text-muted-foreground mt-1">
            Ürün fiyatını girin, toplam maliyeti hesaplayın
          </p>
        </div>

        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Hesaplama Bilgileri
            </CardTitle>
            <CardDescription>
              Tüm alanları doldurun ve hesapla butonuna tıklayın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="product-name">Ürün Adı</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="product-name"
                    placeholder="Örn: iPhone 15 Pro"
                    className="pl-10"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (Euro)</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="Örn: 150"
                    className="pl-10"
                    value={priceEuro}
                    onChange={(e) => setPriceEuro(e.target.value)}
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label>Ülke / Bölge</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="Ülke seçin" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label} (%{country.taxRate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Ürün Kategorisi</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label} {category.otvRate > 0 && `(+%${category.otvRate} ÖTV)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Güncel Kur: 1 Euro = {EURO_RATE} TL</p>
                <p className="text-muted-foreground">
                  Her hesaplamaya 200 TL gümrük sunum ücreti eklenir.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="flex-1 gradient-primary"
                size="lg"
              >
                {isCalculating ? "Hesaplanıyor..." : "Hesapla"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" onClick={resetForm} size="lg">
                Temizle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card className="animate-slide-up border-primary/30">
            <CardHeader className="gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="font-display">Hesaplama Sonucu</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {result.productName}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Ürün Fiyatı</span>
                    <span className="font-medium">€{result.priceEuro.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">TL Karşılığı (x{EURO_RATE})</span>
                    <span className="font-medium">₺{result.basePriceTL.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Gümrük Vergisi ({result.country} - %{result.taxRate})</span>
                    <span className="font-medium text-destructive">+₺{result.taxAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  {result.otvRate > 0 && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">ÖTV (%{result.otvRate})</span>
                      <span className="font-medium text-destructive">+₺{result.otvAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Gümrük Sunum Ücreti</span>
                    <span className="font-medium text-destructive">+₺{result.customsFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-foreground">Toplam Maliyet</span>
                  <span className="text-2xl font-bold font-display text-primary">
                    ₺{result.total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
