import { Sparkles, Star, Heart, BookOpen, Pencil, Award, School, Users, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// import teacherImage from "@/assets/teacher-krisada.jpg"; // Personal image removed
import { useProfile } from "@/hooks/usePortfolioData";

export function HeroSection() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 pb-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  // Fallback data (Template Placeholders)
  const defaultProfile = {
    full_name: "ชื่อ-นามสกุล",
    position: "ตำแหน่งของคุณ",
    bio: "คำธิบายสั้นๆ เกี่ยวกับตัวคุณ\nแรงบันดาลใจ หรือคติประจำใจ",
    stats_years: "XX+",
    stats_students: "XXX+",
    stats_awards: "XX+",
  };

  const name = profile?.full_name || defaultProfile.full_name;
  const statsYears = profile?.stats_years || defaultProfile.stats_years;
  const statsStudents = profile?.stats_students || defaultProfile.stats_students;
  const statsAwards = profile?.stats_awards || defaultProfile.stats_awards;
  const bio = profile?.bio || defaultProfile.bio;

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-12"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-coral/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-mint/10 via-transparent to-transparent" />

      {/* Animated Background Circles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-coral/10 to-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Floating Elements - Hidden on Mobile for cleaner look */}
      <div className="hidden md:block">
        <div className="absolute top-24 left-[8%] animate-float">
          <div className="bg-gradient-to-br from-primary/20 to-coral/20 p-3 rounded-2xl backdrop-blur-sm border border-primary/10 shadow-lg">
            <Heart className="w-5 h-5 text-primary" fill="currentColor" />
          </div>
        </div>
        <div className="absolute top-20 left-[35%] animate-bounce-slow" style={{ animationDelay: "0.5s" }}>
          <div className="bg-gradient-to-br from-lavender/30 to-primary/20 p-2.5 rounded-xl backdrop-blur-sm border border-lavender/20 shadow-lg">
            <Heart className="w-4 h-4 text-lavender" fill="currentColor" />
          </div>
        </div>
        <div className="absolute top-28 right-[10%] animate-float" style={{ animationDelay: "0.8s" }}>
          <div className="bg-gradient-to-br from-accent/20 to-yellow-400/20 p-3 rounded-2xl backdrop-blur-sm border border-accent/10 shadow-lg">
            <Star className="w-5 h-5 text-accent" fill="currentColor" />
          </div>
        </div>
        <div className="absolute top-48 left-[18%] animate-wiggle" style={{ animationDelay: "1.2s" }}>
          <div className="bg-gradient-to-br from-mint/30 to-sky/20 p-2.5 rounded-xl backdrop-blur-sm border border-mint/20 shadow-lg">
            <Pencil className="w-4 h-4 text-mint" />
          </div>
        </div>
        <div className="absolute top-44 right-[25%] animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="bg-gradient-to-br from-coral/20 to-peach/30 p-2 rounded-lg backdrop-blur-sm border border-coral/10 shadow-lg">
            <GraduationCap className="w-4 h-4 text-coral" />
          </div>
        </div>
        <div className="absolute bottom-40 left-[6%] animate-bounce-slow" style={{ animationDelay: "2s" }}>
          <div className="bg-gradient-to-br from-sky/30 to-mint/20 p-3 rounded-2xl backdrop-blur-sm border border-sky/20 shadow-lg">
            <BookOpen className="w-5 h-5 text-sky" />
          </div>
        </div>
        <div className="absolute bottom-32 right-[8%] animate-float" style={{ animationDelay: "1.8s" }}>
          <div className="bg-gradient-to-br from-peach/30 to-coral/20 p-3 rounded-2xl backdrop-blur-sm border border-peach/20 shadow-lg">
            <School className="w-5 h-5 text-coral" />
          </div>
        </div>
        <div className="absolute bottom-52 left-[28%] animate-wiggle" style={{ animationDelay: "0.3s" }}>
          <div className="bg-gradient-to-br from-primary/15 to-lavender/20 p-2 rounded-lg backdrop-blur-sm border border-primary/10 shadow-lg">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-28 right-[30%] animate-bounce-slow" style={{ animationDelay: "2.5s" }}>
          <div className="bg-gradient-to-br from-secondary/20 to-sky/20 p-2.5 rounded-xl backdrop-blur-sm border border-secondary/10 shadow-lg">
            <Users className="w-4 h-4 text-secondary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Mobile Layout - Stacked with image on top */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

          {/* Profile Image - Shows first on mobile */}
          <div className="order-1 lg:order-2 flex-1 flex justify-center animate-scale-in w-full">
            <div className="relative">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-br from-primary/30 via-coral/20 to-secondary/30 rounded-full blur-2xl animate-pulse opacity-60" />

              {/* Decorative Ring */}
              <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-br from-primary/40 via-coral/30 to-accent/40 rounded-full opacity-50" />

              {/* Image Container */}
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-card shadow-2xl">
                <img
                  src={profile?.image_url || "https://placehold.co/400x400?text=Teacher+Photo"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/400x400?text=Teacher+Photo";
                  }}
                  alt={name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-1 right-0 sm:-bottom-2 sm:right-4 bg-gradient-to-r from-accent to-yellow-400 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 animate-bounce-slow border-2 border-card">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" />
                <span className="text-xs sm:text-sm font-bold text-white">{profile?.hero_badge_text || "ครูดีเด่น"}</span>
              </div>

              {/* Floating heart - top left */}
              <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 animate-wiggle">
                <div className="bg-gradient-to-br from-primary to-coral p-2 sm:p-3 rounded-full shadow-lg border-2 border-card">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" />
                </div>
              </div>

              {/* Floating sparkle - top right */}
              <div className="absolute top-4 -right-2 sm:top-6 sm:-right-4 animate-bounce-slow" style={{ animationDelay: "0.5s" }}>
                <div className="bg-gradient-to-br from-accent to-yellow-400 p-2 sm:p-2.5 rounded-full shadow-lg border-2 border-card">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="order-2 lg:order-1 flex-1 text-center lg:text-left">
            {/* Welcome Badge */}
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-coral/10 backdrop-blur-sm text-primary px-4 py-2.5 rounded-full mb-6 animate-fade-in border border-primary/20 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">{profile?.welcome_message_1 || "ยินดีต้อนรับสู่ Portfolio ของครู"}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 animate-fade-in leading-tight" style={{ animationDelay: "0.1s" }}>
              <span className="block mb-2">{profile?.welcome_message_2 || "สวัสดีครับ ผม"}</span>
              <span className="bg-gradient-to-r from-primary via-coral to-secondary bg-clip-text text-transparent block leading-normal">
                {name}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
              {bio?.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < (bio.split('\n').length || 0) - 1 && <br className="hidden sm:block" />}
                </span>
              ))}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="bg-gradient-to-r from-primary via-coral to-primary hover:opacity-90 rounded-full gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white border-0 px-6 sm:px-8">
                <a href="#works">
                  <Heart className="w-5 h-5" fill="currentColor" />
                  ดูผลงาน
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-primary/50 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:scale-105 px-6 sm:px-8 bg-card/50 backdrop-blur-sm">
                <a href="#about">
                  เกี่ยวกับครู
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-10 mt-8 sm:mt-12 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-center group">
                <div className="relative">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-coral bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {statsYears}
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">ปีประสบการณ์</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-secondary to-mint bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {statsStudents}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">นักเรียน</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent to-yellow-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {statsAwards}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">รางวัล</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
