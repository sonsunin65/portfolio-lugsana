import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Eye, BookOpen, FileText, Video, Presentation, Star, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Icon mapping
const iconMap: Record<string, any> = {
  BookOpen,
  FileText,
  Video,
  Presentation,
  Star,
  Eye,
};

interface Work {
  id: string;
  title: string;
  category: string;
  description: string | null;
  icon_name: string;
  views: number;
  is_featured: boolean;
  images: string[] | null;
  created_at: string;
  external_links: any; // Using any for Json type simplicity in UI
}

export default function WorkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchWork = async () => {
      try {
        const { data, error } = await supabase
          .from("works")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Work not found");

        // Transform the data to match our interface
        const rawImages = Array.isArray((data as any).images) ? (data as any).images : [];
        const images = rawImages.map((img: any) => typeof img === 'string' ? img : String(img));

        // Include file_url if it exists (legacy/single file support)
        if ((data as any).file_url && !images.includes((data as any).file_url)) {
          images.unshift((data as any).file_url);
        }

        const transformedWork: Work = {
          ...data as any,
          images: images
        };

        setWork(transformedWork);

      } catch (error) {
        console.error("Error fetching work:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">ไม่พบผลงาน</p>
        <Button asChild variant="outline">
          <Link to="/#works">กลับสู่หน้าหลัก</Link>
        </Button>
      </div>
    );
  }

  const Icon = iconMap[work.icon_name] || FileText;

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
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 animate-fade-in">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">ผลงานการสอน</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                รายละเอียด<span className="text-gradient-primary">ผลงาน</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-4xl py-8">
          <Button asChild variant="outline" className="mb-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/#works"><ArrowLeft className="w-4 h-4 mr-2" />กลับ</Link>
          </Button>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{work.category}</Badge>
                  {work.is_featured && <Badge className="bg-primary text-primary-foreground">แนะนำ</Badge>}
                </div>
                <h2 className="text-2xl font-bold text-foreground leading-tight">{work.title}</h2>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/50">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>เข้าชม {work.views ? work.views.toLocaleString() : 0} ครั้ง</span>
              </div>
              <div>
                เผยแพร่เมื่อ: {new Date(work.created_at).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p className="whitespace-pre-wrap">{work.description}</p>
            </div>

            {/* External Links */}
            {work.external_links && Array.isArray(work.external_links) && work.external_links.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  ลิงก์ที่เกี่ยวข้อง
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {work.external_links.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/5 hover:bg-secondary/10 border border-secondary/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LinkIcon className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {link.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {work.images && work.images.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">รูปภาพประกอบ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {work.images.map((img, i) => (
                    <div key={i} className={`rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow ${img.toLowerCase().endsWith('.pdf') ? 'md:col-span-2' : ''}`}>
                      {img.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-[600px] bg-muted/10">
                          <iframe
                            src={`${img}#toolbar=0`}
                            className="w-full h-full"
                            title={`PDF Viewer ${i + 1}`}
                          >
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                              <p className="mb-4">เบราว์เซอร์ของคุณไม่รองรับการแสดงผล PDF</p>
                              <Button asChild>
                                <a href={img} target="_blank" rel="noopener noreferrer">
                                  <FileText className="w-4 h-4 mr-2" />
                                  ดาวน์โหลด PDF
                                </a>
                              </Button>
                            </div>
                          </iframe>
                        </div>
                      ) : (
                        <img
                          src={img}
                          alt={`${work.title} ${i + 1}`}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
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