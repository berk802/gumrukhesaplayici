import { useEffect, useState } from "react";
import { History, Trash2, Euro, Calendar, MapPin } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Calculation {
  id: string;
  product_name: string;
  price_euro: number;
  country: string;
  category: string;
  base_price_tl: number;
  tax_rate: number;
  tax_amount_tl: number;
  otv_rate: number;
  otv_amount_tl: number;
  customs_fee_tl: number;
  total_tl: number;
  created_at: string;
}

const countryLabels: Record<string, string> = {
  eu: "AB Ülkeleri",
  other: "Diğer Ülkeler",
};

export default function MyCalculations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCalculations();
    }
  }, [user]);

  const fetchCalculations = async () => {
    const { data, error } = await supabase
      .from("calculations")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Hesaplamalar yüklenemedi.",
      });
    } else {
      setCalculations(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("calculations").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Hesaplama silinemedi.",
      });
    } else {
      toast({
        title: "Silindi",
        description: "Hesaplama başarıyla silindi.",
      });
      setCalculations(calculations.filter((c) => c.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Hesaplamalarım
          </h1>
          <p className="text-muted-foreground mt-1">
            Geçmiş vergi hesaplamalarınız
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : calculations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Henüz hesaplama yok
              </h3>
              <p className="text-muted-foreground mb-4">
                İlk vergi hesaplamanızı yapmak için hesaplayıcıya gidin.
              </p>
              <Button asChild className="gradient-primary">
                <a href="/calculator">Hesaplayıcıya Git</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {calculations.map((calc) => (
              <Card key={calc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-display text-lg">
                        {calc.product_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(calc.created_at).toLocaleDateString("tr-TR")}
                      </CardDescription>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hesaplamayı Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{calc.product_name}" hesaplamasını silmek istediğinize emin misiniz?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(calc.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Euro className="w-3 h-3" />
                      Fiyat
                    </span>
                    <span className="font-medium">€{Number(calc.price_euro).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Kaynak
                    </span>
                    <span className="font-medium">{countryLabels[calc.country] || calc.country}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vergi Oranı</span>
                    <span className="font-medium text-destructive">%{Number(calc.tax_rate)}</span>
                  </div>
                  {Number(calc.otv_rate) > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ÖTV Oranı</span>
                      <span className="font-medium text-destructive">%{Number(calc.otv_rate)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Toplam</span>
                      <span className="text-xl font-bold font-display text-primary">
                        ₺{Number(calc.total_tl).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
