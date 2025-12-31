import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Users,
  TrendingUp,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Upload,
  Home,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Admin Sub-components (Will be defined in this file for simplicity, can be extracted later)
import { AdminProfile } from "@/components/admin/AdminProfile";
import { AdminHighlights } from "@/components/admin/AdminHighlights";
import { AdminWorks } from "@/components/admin/AdminWorks";
import { AdminActivities } from "@/components/admin/AdminActivities";
import { AdminCertificates } from "@/components/admin/AdminCertificates";
import { AdminPA } from "@/components/admin/AdminPA";

interface PACategory {
  id: string;
  category_number: number;
  title: string;
  icon: string;
  color: string;
}

interface PAIndicator {
  id: string;
  category_id: string;
  indicator_number: string;
  name: string;
  description: string | null;
}

interface PAWork {
  id: string;
  indicator_id: string;
  work_type: string;
  title: string;
  url: string | null;
  sort_order: number;
}

interface PAImage {
  id: string;
  indicator_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

const iconMap: Record<string, any> = {
  BookOpen,
  Users,
  TrendingUp,
};

export default function Admin() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin-login");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">จัดการข้อมูล วPA</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                หน้าหลัก
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pa" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="works">Works</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="pa">PA (วPA)</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <AdminProfile />
          </TabsContent>

          <TabsContent value="highlights" className="space-y-4">
            <AdminHighlights />
          </TabsContent>

          <TabsContent value="works" className="space-y-4">
            <AdminWorks />
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <AdminActivities />
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4">
            <AdminCertificates />
          </TabsContent>

          <TabsContent value="pa" className="space-y-4">
            <AdminPA />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
