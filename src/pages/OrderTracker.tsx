import { useEffect, useState } from "react";
import { Package, Plus, Trash2, Calendar, FileText, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface Order {
  id: string;
  order_name: string;
  order_date: string;
  notes: string | null;
  created_at: string;
}

const MAX_ORDERS_PER_YEAR = 5;

export default function OrderTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newOrderName, setNewOrderName] = useState("");
  const [newOrderDate, setNewOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [newOrderNotes, setNewOrderNotes] = useState("");

  const currentYear = new Date().getFullYear();
  const ordersThisYear = orders.filter(
    (o) => new Date(o.order_date).getFullYear() === currentYear
  ).length;
  const remainingOrders = MAX_ORDERS_PER_YEAR - ordersThisYear;
  const progressPercent = (ordersThisYear / MAX_ORDERS_PER_YEAR) * 100;

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("order_tracker")
      .select("*")
      .eq("user_id", user?.id)
      .order("order_date", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Siparişler yüklenemedi.",
      });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const handleAddOrder = async () => {
    if (!newOrderName.trim()) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Sipariş adı gerekli.",
      });
      return;
    }

    const { error } = await supabase.from("order_tracker").insert({
      user_id: user?.id,
      order_name: newOrderName,
      order_date: newOrderDate,
      notes: newOrderNotes || null,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sipariş eklenemedi.",
      });
    } else {
      toast({
        title: "Eklendi",
        description: "Sipariş başarıyla eklendi.",
      });
      fetchOrders();
      setNewOrderName("");
      setNewOrderNotes("");
      setDialogOpen(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    const { error } = await supabase.from("order_tracker").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sipariş silinemedi.",
      });
    } else {
      toast({
        title: "Silindi",
        description: "Sipariş başarıyla silindi.",
      });
      setOrders(orders.filter((o) => o.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Sipariş Takibi
            </h1>
            <p className="text-muted-foreground mt-1">
              Yıllık 5 sipariş limitinizi takip edin
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Sipariş Ekle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Sipariş Ekle</DialogTitle>
                <DialogDescription>
                  Yurtdışından aldığınız siparişi kaydedin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="order-name">Sipariş Adı</Label>
                  <Input
                    id="order-name"
                    placeholder="Örn: Amazon.de Sipariş"
                    value={newOrderName}
                    onChange={(e) => setNewOrderName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order-date">Sipariş Tarihi</Label>
                  <Input
                    id="order-date"
                    type="date"
                    value={newOrderDate}
                    onChange={(e) => setNewOrderDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order-notes">Notlar (İsteğe bağlı)</Label>
                  <Textarea
                    id="order-notes"
                    placeholder="Sipariş hakkında notlar..."
                    value={newOrderNotes}
                    onChange={(e) => setNewOrderNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  İptal
                </Button>
                <Button onClick={handleAddOrder} className="gradient-primary">
                  Ekle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Card */}
        <Card className={remainingOrders <= 1 ? "border-warning" : ""}>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {currentYear} Yılı Sipariş Durumu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Kullanılan</span>
              <span className="font-bold text-foreground">
                {ordersThisYear} / {MAX_ORDERS_PER_YEAR}
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="flex items-center gap-2">
              {remainingOrders <= 1 ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-warning font-medium">
                    Dikkat! Sadece {remainingOrders} sipariş hakkınız kaldı.
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  {remainingOrders} sipariş hakkınız mevcut.
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Sipariş Geçmişi</CardTitle>
            <CardDescription>Kayıtlı tüm siparişleriniz</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-muted rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">Henüz kayıtlı sipariş yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {order.order_name}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.order_date).toLocaleDateString("tr-TR")}
                        </span>
                        {order.notes && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Not var
                          </span>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Siparişi Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{order.order_name}" siparişini silmek istediğinize emin misiniz?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
