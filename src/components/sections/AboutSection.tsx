import { GraduationCap, Award, BookOpen, Users, Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
// import teacherImage from "@/assets/teacher-krisada.jpg"; // Personal image removed
import { useHighlights, useProfile } from "@/hooks/usePortfolioData";

// Icon mapping
const iconMap: Record<string, any> = {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Heart,
  Star,
};

export function AboutSection() {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: highlightsData, isLoading: loadingHighlights } = useHighlights();

  if (loadingProfile || loadingHighlights) {
    return <div className="py-20 text-center text-muted-foreground">กำลังโหลดข้อมูลเกี่ยวกับครู...</div>;
  }

  // Use DB data if available, otherwise fallback ONLY if DB is empty
  const highlights = highlightsData && highlightsData.length > 0 ? highlightsData : [];

  const name = profile?.full_name || "ชื่อ-นามสกุล";
  const philosophy = profile?.teaching_philosophy || '"ปรัชญาการสอนของคุณ..."';
  const position = profile?.position || "ตำแหน่งของคุณ";

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">รู้จักครู</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            เกี่ยวกับ<span className="text-gradient-primary">ครู{name.split(' ')[0]}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {profile?.about_short_description || "คำนิยามสั้นๆ เกี่ยวกับตัวคุณ"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Card */}
          <div className="animate-slide-in-left">
            <Card className="overflow-hidden border-none shadow-soft bg-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={profile?.image_url || "https://placehold.co/400x400?text=Profile"}
                      alt={name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/400x400?text=Profile";
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{name}</h3>
                    <p className="text-primary font-medium mb-4">{position}</p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-accent" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="mt-6 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      สวัสดีครับ ผมเป็นครูที่รักการสอนและมีความสุขกับการได้เห็นนักเรียนเติบโตและพัฒนา
                      ผมเชื่อว่าการเรียนรู้ที่ดีเกิดจากบรรยากาศที่อบอุ่น เป็นกันเอง และเต็มไปด้วยความสนุกสนาน
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      นอกจากการสอนในห้องเรียน ผมยังชอบจัดกิจกรรมต่างๆ เพื่อส่งเสริมให้นักเรียนได้เรียนรู้
                      ผ่านประสบการณ์จริง และพัฒนาทักษะชีวิตที่จำเป็น
                    </p>
                  </div>
                </div>

                {/* Philosophy */}
                <div className="mt-6 p-4 bg-gradient-hero rounded-xl border border-primary/20">
                  <p className="text-sm font-medium text-primary mb-1">💡 ปรัชญาการสอน</p>
                  <p className="text-foreground italic">
                    {philosophy}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Highlights Grid */}
          <div className="grid sm:grid-cols-2 gap-4 animate-slide-in-right">
            {highlights.map((item: any, index: number) => {
              const Icon = iconMap[item.icon_name] || Award;
              return (
                <Card
                  key={index}
                  className="hover-lift border-none shadow-soft bg-card group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${item.bg_class} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${item.color_class}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}