import { useEffect, useState } from "react";
import { User, Mail, Calendar, Calculator, Package, Save } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ calculations: 0, orders: 0 });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user?.id)
      .maybeSingle();

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Profil yüklenemedi.",
      });
    } else if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const [calcResult, orderResult] = await Promise.all([
      supabase
        .from("calculations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id),
      supabase
        .from("order_tracker")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id),
    ]);

    setStats({
      calculations: calcResult.count || 0,
      orders: orderResult.count || 0,
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Profil güncellenemedi.",
      });
    } else {
      toast({
        title: "Kaydedildi",
        description: "Profil bilgileriniz güncellendi.",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 lg:p-8 animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-32 bg-muted rounded-xl" />
            <div className="h-32 bg-muted rounded-xl" />
          </div>
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Profil
          </h1>
          <p className="text-muted-foreground mt-1">
            Hesap ayarlarınız ve istatistikleriniz
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Toplam Hesaplama"
            value={stats.calculations}
            icon={<Calculator className="w-5 h-5" />}
          />
          <StatCard
            title="Kayıtlı Sipariş"
            value={stats.orders}
            icon={<Package className="w-5 h-5" />}
          />
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Kişisel Bilgiler
            </CardTitle>
            <CardDescription>
              Hesap bilgilerinizi güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full-name">Ad Soyad</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="full-name"
                    placeholder="Adınız Soyadınız"
                    className="pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={profile?.email || user?.email || ""}
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  E-posta adresi değiştirilemez
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Kayıt Tarihi</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
