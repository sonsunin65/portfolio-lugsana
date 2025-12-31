import { Heart, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await (supabase.from("profiles") as any).select("*").limit(1).maybeSingle();
        if (data) setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const renderFooterText = (text: string) => {
    if (!text) return (
      <>
        สร้างด้วย <Heart className="w-4 h-4 text-primary inline-block" fill="currentColor" /> © 2569
      </>
    );

    const parts = text.split("<Heart/>");
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <Heart className="w-4 h-4 text-primary inline-block mx-1" fill="currentColor" />
        )}
      </span>
    ));
  };

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">
              {profile?.full_name ? (
                <>
                  {profile.full_name.split(" ")[0]} <span className="text-primary">{profile.full_name.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                <>
                  Teacher <span className="text-primary">Portfolio</span>
                </>
              )}
            </span>
          </a>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {renderFooterText(profile?.footer_text)}
          </p>
        </div>
      </div>
    </footer>
  );
}