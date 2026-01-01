import { Award, Medal, Trophy, Star, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCertificates, useProfile, useStats } from "@/hooks/usePortfolioData";

// Icon mapping
const iconMap: Record<string, any> = {
  Award,
  Medal,
  Trophy,
  Star,
  Crown,
};

export function CertificatesSection() {
  const { data: certificatesData, isLoading } = useCertificates();
  const { data: profile } = useProfile();
  const { data: stats } = useStats();

  // Fallback data
  const defaultCertificates = [
    {
      id: "1",
      title: "ครูดีเด่นระดับเขตพื้นที่การศึกษา",
      issuer: "สำนักงานเขตพื้นที่การศึกษา",
      year: "2569",
      type: "รางวัล",
      icon_name: "Trophy",
      color_class: "text-accent",
      bg_class: "bg-accent/10",
    },
    {
      id: "2",
      title: "รางวัลครูสอนดี ประจำปี 2569",
      issuer: "กระทรวงศึกษาธิการ",
      year: "2569",
      type: "รางวัล",
      icon_name: "Crown",
      color_class: "text-primary",
      bg_class: "bg-primary/10",
    },
    {
      id: "3",
      title: "ใบประกาศนียบัตรการอบรม Google Certified Educator",
      issuer: "Google for Education",
      year: "2569",
      type: "ประกาศนียบัตร",
      icon_name: "Award",
      color_class: "text-secondary",
      bg_class: "bg-secondary/10",
    },
    {
      id: "4",
      title: "เหรียญทองการแข่งขันนวัตกรรมการสอน",
      issuer: "สมาคมครูแห่งประเทศไทย",
      year: "2569",
      type: "เหรียญรางวัล",
      icon_name: "Medal",
      color_class: "text-coral",
      bg_class: "bg-coral/10",
    },
    {
      id: "5",
      title: "รางวัลครูผู้สร้างแรงบันดาลใจ",
      issuer: "มูลนิธิส่งเสริมการศึกษา",
      year: "2569",
      type: "รางวัล",
      icon_name: "Star",
      color_class: "text-lavender",
      bg_class: "bg-lavender/10",
    },
    {
      id: "6",
      title: "ใบประกาศนียบัตร Microsoft Innovative Educator",
      issuer: "Microsoft Education",
      year: "2569",
      type: "ประกาศนียบัตร",
      icon_name: "Award",
      color_class: "text-sky",
      bg_class: "bg-sky/10",
    },
  ];

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">กำลังโหลดข้อมูลเกียรติบัตร...</div>;
  }

  const certificates = certificatesData || [];

  return (
    <section id="certificates" className="py-20 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-coral/10 text-coral px-4 py-2 rounded-full mb-4">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">เกียรติบัตร & รางวัล</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            เกียรติบัตร<span className="text-gradient-primary">และรางวัล</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {profile?.certificates_description || "รางวัลและใบประกาศนียบัตรที่ครูกฤษฎาได้รับจากการทุ่มเทในการพัฒนาการเรียนการสอน ปี 2569"}
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert: any, index: number) => {
            const Icon = iconMap[cert.icon_name] || Award;
            return (
              <Link
                key={cert.id}
                to={`/certificates/${cert.id}`}
                className="block"
              >
                <Card
                  className="group hover-lift border-none shadow-soft bg-card overflow-hidden cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl ${cert.bg_class} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 ${cert.color_class}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {cert.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {cert.year}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {cert.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer}
                        </p>

                        {/* External Links */}
                        {cert.external_links && Array.isArray(cert.external_links) && cert.external_links.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {cert.external_links.map((link: any, i: number) => (
                              <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {link.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {(stats || []).map((stat: any, index: number) => {
            const Icon = iconMap[stat.icon_name] || Trophy;
            return (
              <Card key={stat.id} className="border-none shadow-soft bg-card animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <Icon className={`w-8 h-8 ${stat.color_class} mx-auto mb-3`} />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section >
  );
}