import { BookOpen, FileText, Video, Presentation, Star, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useWorks, useProfile } from "@/hooks/usePortfolioData";

// Icon mapping
const iconMap: Record<string, any> = {
  BookOpen,
  FileText,
  Video,
  Presentation,
  Star,
  Eye,
};

export function WorksSection() {
  const { data: worksData, isLoading } = useWorks();
  const { data: profile } = useProfile();

  // Fallback data
  const defaultWorks = [
    {
      id: "1",
      title: "สื่อการสอนภาษาไทยแบบ Interactive",
      category: "สื่อการสอน",
      description: "สื่อการสอนที่ช่วยให้นักเรียนเรียนรู้ภาษาไทยอย่างสนุกสนาน ปีการศึกษา 2569",
      icon_name: "Presentation",
      color_class: "bg-primary",
      views: 1250,
      is_featured: true,
    },
    {
      id: "2",
      title: "แผนการจัดการเรียนรู้แบบ Active Learning",
      category: "แผนการสอน",
      description: "แผนการสอนที่เน้นให้ผู้เรียนมีส่วนร่วมในกระบวนการเรียนรู้ ปีการศึกษา 2569",
      icon_name: "FileText",
      color_class: "bg-secondary",
      views: 890,
      is_featured: false,
    },
    {
      id: "3",
      title: "วิดีโอสอนการอ่านออกเสียง",
      category: "วิดีโอ",
      description: "วิดีโอสอนเทคนิคการอ่านออกเสียงที่ถูกต้องตามหลักภาษา ปีการศึกษา 2569",
      icon_name: "Video",
      color_class: "bg-coral",
      views: 2340,
      is_featured: true,
    },
    {
      id: "4",
      title: "หนังสือเสริมทักษะการเขียน",
      category: "หนังสือ",
      description: "หนังสือแบบฝึกหัดเสริมทักษะการเขียนเรียงความ ปีการศึกษา 2569",
      icon_name: "BookOpen",
      color_class: "bg-lavender",
      views: 567,
      is_featured: false,
    },
    {
      id: "5",
      title: "เกมการศึกษาวรรณคดีไทย",
      category: "เกม",
      description: "เกมการศึกษาที่ช่วยให้นักเรียนเรียนรู้วรรณคดีอย่างสนุก ปีการศึกษา 2569",
      icon_name: "Star",
      color_class: "bg-mint",
      views: 1890,
      is_featured: true,
    },
    {
      id: "6",
      title: "ใบงานพัฒนาทักษะการคิด",
      category: "ใบงาน",
      description: "ใบงานที่ออกแบบมาเพื่อพัฒนาทักษะการคิดวิเคราะห์ ปีการศึกษา 2569",
      icon_name: "FileText",
      color_class: "bg-accent",
      views: 723,
      is_featured: false,
    },
  ];

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">กำลังโหลดข้อมูลผลงาน...</div>;
  }

  const works = worksData || [];

  return (
    <section id="works" className="py-20 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">ผลงานการสอน</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ผลงาน<span className="text-gradient-primary">ของ{profile?.full_name ? `ครู${profile.full_name.split(' ')[0]}` : "ครู"}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {profile?.works_description || `รวบรวมสื่อการสอน แผนการจัดการเรียนรู้ และนวัตกรรมทางการศึกษาที่${profile?.full_name ? `ครู${profile.full_name.split(' ')[0]}` : "คุณครู"}สร้างสรรค์ขึ้น`}
          </p>
        </div>

        {/* Works Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work: any, index: number) => {
            const Icon = iconMap[work.icon_name] || FileText;
            return (
              <Link
                key={work.id}
                to={`/works/${work.id}`}
                className="block"
              >
                <Card
                  className="group hover-lift border-none shadow-soft bg-card overflow-hidden cursor-pointer animate-fade-in h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className={`${work.color_class} p-6 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        {work.is_featured && (
                          <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">
                            <Star className="w-3 h-3 mr-1" fill="currentColor" />
                            แนะนำ
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-3 text-xs">
                        {work.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {work.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {work.description}
                      </p>

                      {/* External Links */}
                      {work.external_links && Array.isArray(work.external_links) && work.external_links.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {work.external_links.map((link: any, i: number) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-md hover:bg-secondary/20 transition-colors flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {link.title}
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{work.views ? work.views.toLocaleString() : 0} ครั้ง</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section >
  );
}