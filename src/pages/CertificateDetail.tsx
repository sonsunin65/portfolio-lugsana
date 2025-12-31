import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Award, Medal, Trophy, Star, Crown, Sparkles, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  type: string;
  icon_name: string;
  created_at: string;
  external_links: any;
  file_url: string | null;
  images: string[] | null;
}

// Icon mapping
const iconMap: Record<string, any> = {
  Award,
  Medal,
  Trophy,
  Star,
  Crown,
};

export default function CertificateDetail() {
  const { id } = useParams();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCert = async () => {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        // Transform data
        const rawImages = Array.isArray((data as any).images) ? (data as any).images : [];
        const images = rawImages.map((img: any) => typeof img === 'string' ? img : String(img));

        // Include file_url if it exists (legacy/single file support)
        if ((data as any).file_url && !images.includes((data as any).file_url)) {
          images.unshift((data as any).file_url);
        }

        setCert({
          ...data,
          images: images
        } as Certificate);

      } catch (error) {
        console.error("Error fetching certificate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCert();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">ไม่พบเกียรติบัตร</p>
        <Button asChild variant="outline">
          <Link to="/#certificates">กลับสู่หน้าหลัก</Link>
        </Button>
      </div>
    );
  }

  const Icon = iconMap[cert.icon_name] || Award;

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
              <div className="inline-flex items-center gap-2 bg-coral/10 text-coral px-4 py-2 rounded-full mb-4 animate-fade-in">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">เกียรติบัตร & รางวัล</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                รายละเอียด<span className="text-gradient-primary">รางวัล</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-4xl py-8">
          <Button asChild variant="outline" className="mb-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/#certificates"><ArrowLeft className="w-4 h-4 mr-2" />กลับ</Link>
          </Button>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-8 h-8 text-accent" />
              </div>
              <div>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary">{cert.type}</Badge>
                  <Badge variant="outline">{cert.year}</Badge>
                </div>
                <h2 className="text-2xl font-bold text-foreground">{cert.title}</h2>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 text-lg">ออกโดย: <span className="font-medium text-foreground">{cert.issuer}</span></p>

            {/* Certificate Image - Using file_url from schema */}
            {/* Certificate Image or PDF */}
            {/* Certificate Images/Files */}
            {cert.images && cert.images.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">เอกสาร/หลักฐาน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cert.images.map((img, i) => (
                    <div key={i} className={`rounded-xl overflow-hidden border border-border shadow-sm bg-muted/10 ${img.toLowerCase().endsWith('.pdf') ? 'md:col-span-2' : ''}`}>
                      {img.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-[600px]">
                          <iframe
                            src={`${img}#toolbar=0`}
                            className="w-full h-full"
                            title={`Certificate PDF ${i}`}
                          >
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                              <p className="mb-4">เบราว์เซอร์ของคุณไม่รองรับการแสดงผล PDF</p>
                              <Button asChild>
                                <a href={img} target="_blank" rel="noopener noreferrer">
                                  <LinkIcon className="w-4 h-4 mr-2" />
                                  ดาวน์โหลด PDF
                                </a>
                              </Button>
                            </div>
                          </iframe>
                        </div>
                      ) : (
                        <img src={img} alt={`${cert.title} ${i + 1}`} className="w-full h-auto object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            {cert.external_links && Array.isArray(cert.external_links) && cert.external_links.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  ลิงก์ที่เกี่ยวข้อง
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cert.external_links.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-secondary/10 text-secondary px-3 py-2 rounded-lg hover:bg-secondary/20 transition-colors flex items-center gap-2"
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