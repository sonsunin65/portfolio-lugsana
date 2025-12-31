import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Calendar, MapPin, Users, Sparkles, Link as LinkIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  date_display: string;
  location: string;
  participants: number | null;
  description: string;
  image_emoji: string | null;
  color_gradient_class: string | null;
  created_at: string;
  external_links: any;
  file_url: string | null;
  images: string[] | null;
}

export default function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchActivity = async () => {
      try {
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        // Normalize images data
        let images: string[] = [];
        if (Array.isArray(data.images)) {
          images = data.images.map((img: any) => String(img));
        } else if (data.file_url) {
          images = [data.file_url];
        }

        setActivity({
          ...data,
          images
        });

      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">ไม่พบกิจกรรม</p>
        <Button asChild variant="outline">
          <Link to="/#activities">กลับสู่หน้าหลัก</Link>
        </Button>
      </div>
    );
  }

  const hasImages = activity.images && activity.images.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Hero Header */}
        <section className="relative py-12 overflow-hidden bg-muted/30">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full mb-4 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">กิจกรรมในชั้นเรียน</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                รายละเอียด<span className="text-gradient-primary">กิจกรรม</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-4xl py-8">
          <Button asChild variant="outline" className="mb-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/#activities"><ArrowLeft className="w-4 h-4 mr-2" />กลับ</Link>
          </Button>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50">

            {/* Header Image/Emoji Area */}
            <div className="mb-8 flex justify-center">
              {hasImages ? (
                <div className="w-full max-h-[400px] overflow-hidden rounded-2xl shadow-md">
                  <img src={activity.images![0]} alt={activity.title} className="w-full h-full object-cover" />
                </div>
              ) : activity.image_emoji ? (
                <div className="text-8xl animate-bounce-slow">
                  {activity.image_emoji}
                </div>
              ) : (
                <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-accent" />
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">{activity.title}</h2>

            <div className="flex flex-wrap justify-center gap-4 mb-8 text-muted-foreground">
              <span className="bg-primary/10 px-4 py-1.5 rounded-full flex items-center gap-2 text-base text-primary font-bold shadow-sm">
                <Calendar className="w-5 h-5" />{activity.date_display}
              </span>
              <span className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 text-sm text-foreground">
                <MapPin className="w-4 h-4" />{activity.location}
              </span>
              {activity.participants && (
                <span className="bg-accent/10 px-3 py-1 rounded-full flex items-center gap-2 text-sm text-accent-foreground font-medium">
                  <Users className="w-4 h-4" />{activity.participants} คน
                </span>
              )}
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-10">
              <p className="whitespace-pre-wrap leading-relaxed">{activity.description}</p>
            </div>

            {/* Image Gallery */}
            {hasImages && (
              <div className="mb-10 animate-fade-in">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b pb-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  ประมวลภาพกิจกรรม
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activity.images!.map((img, i) => (
                    <div key={i} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="aspect-video">
                        <img
                          src={img}
                          alt={`${activity.title} ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            {activity.external_links && Array.isArray(activity.external_links) && activity.external_links.length > 0 && (
              <div className="pt-6 border-t border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  ลิงก์ที่เกี่ยวข้อง
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activity.external_links.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-primary text-primary-foreground px-5 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-bold"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}