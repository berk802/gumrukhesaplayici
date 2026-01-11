import { useEffect, useState } from "react";
import { 
  Calculator, 
  TrendingUp, 
  Package, 
  Euro, 
  History,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface RecentCalculation {
  id: string;
  product_name: string;
  total_tl: number;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [totalCalculations, setTotalCalculations] = useState(0);
  const [recentCalculations, setRecentCalculations] = useState<RecentCalculation[]>([]);
  const [ordersThisYear, setOrdersThisYear] = useState(0);

  const EURO_RATE = 38;
  const REMAINING_ORDERS = 5 - ordersThisYear;

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    // Fetch total calculations
    const { count } = await supabase
      .from("calculations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user?.id);
    
    setTotalCalculations(count || 0);

    // Fetch recent calculations
    const { data: recent } = await supabase
      .from("calculations")
      .select("id, product_name, total_tl, created_at")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentCalculations(recent || []);

    // Fetch orders this year
    const currentYear = new Date().getFullYear();
    const { count: orderCount } = await supabase
      .from("order_tracker")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user?.id)
      .gte("order_date", `${currentYear}-01-01`);

    setOrdersThisYear(orderCount || 0);
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Kontrol Paneli
          </h1>
          <p className="text-muted-foreground mt-1">
            Gümrük vergisi hesaplamalarınızı takip edin
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Euro Kuru"
            value={`₺${EURO_RATE}`}
            icon={<Euro className="w-5 h-5" />}
          />
          <StatCard
            title="Toplam Hesaplama"
            value={totalCalculations}
            icon={<Calculator className="w-5 h-5" />}
          />
          <StatCard
            title="Yıllık Sipariş"
            value={`${ordersThisYear}/5`}
            icon={<Package className="w-5 h-5" />}
          />
          <StatCard
            title="Kalan Hak"
            value={REMAINING_ORDERS}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Quick Actions & Recent */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Hızlı İşlemler</CardTitle>
              <CardDescription>Sık kullanılan işlemler</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link to="/calculator">
                <Button className="w-full justify-between gradient-primary" size="lg">
                  <span className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Yeni Hesaplama Yap
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/order-tracker">
                <Button variant="outline" className="w-full justify-between" size="lg">
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Sipariş Ekle
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/customs-info">
                <Button variant="outline" className="w-full justify-between" size="lg">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    2026 Düzenlemeleri
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Calculations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">Son Hesaplamalar</CardTitle>
                <CardDescription>En son yaptığınız hesaplamalar</CardDescription>
              </div>
              <Link to="/my-calculations">
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentCalculations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Henüz hesaplama yapılmamış</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCalculations.map((calc) => (
                    <div
                      key={calc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{calc.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(calc.created_at).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                      <p className="font-bold text-primary">
                        ₺{Number(calc.total_tl).toLocaleString("tr-TR")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="gradient-dark text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-display">2026 Yeni Düzenlemeler</h3>
                <p className="text-primary-foreground/80 mt-1">
                  30 Euro muafiyet kaldırıldı. AB ülkeleri %30, diğer ülkeler %60 vergi uygulanıyor.
                </p>
              </div>
              <Link to="/customs-info">
                <Button variant="secondary" className="whitespace-nowrap">
                  Detaylı Bilgi
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
