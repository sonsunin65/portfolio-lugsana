import { Mail, Phone, MapPin, Facebook, Send, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SwalFire } from "@/utils/sweetalert";

export function ContactSection() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await (supabase.from("profiles") as any).select("*").limit(1).maybeSingle();
        if (data) setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      label: "อีเมล",
      value: profile?.email || "",
      href: profile?.email ? `mailto:${profile.email}` : "#",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Phone,
      label: "โทรศัพท์",
      value: profile?.phone || "",
      href: profile?.phone ? `tel:${profile.phone}` : "#",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: MapPin,
      label: "ที่อยู่",
      value: profile?.address || "",
      href: "#",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Facebook,
      label: "Facebook",
      value: profile?.facebook || "",
      href: profile?.facebook_url ? (profile.facebook_url.startsWith('http') ? profile.facebook_url : `https://${profile.facebook_url}`) : "#",
      color: "text-sky",
      bg: "bg-sky/10",
    },
    {
      icon: MessageCircle,
      label: "Line ID",
      value: profile?.line_id || "",
      href: profile?.line_url ? (profile.line_url.startsWith('http') ? profile.line_url : `https://${profile.line_url}`) : "#",
      color: "text-green-500",
      bg: "bg-green-100",
    }
  ].filter(item => Boolean(item.value));

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-lavender/20 text-lavender px-4 py-2 rounded-full mb-4">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">ติดต่อครู</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ติดต่อ<span className="text-gradient-primary">สอบถาม</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {profile?.contact_description || `มีคำถามหรืออยากพูดคุย? ติดต่อ${profile?.full_name ? `ครู${profile.full_name.split(' ')[0]}` : "ครู"}ได้เลยครับ ยินดีให้คำปรึกษาและตอบคำถามทุกข้อ`}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-none shadow-soft bg-card animate-slide-in-left">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                ส่งข้อความถึง{profile?.full_name ? `ครู${profile.full_name.split(' ')[0]}` : "ครู"}
              </h3>
              <ContactForm />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6 animate-slide-in-right">
            {contactInfo.map((info, index) => (
              <a
                key={info.label}
                href={info.href}
                className="block"
                target={info.label === "Facebook" ? "_blank" : undefined}
                rel={info.label === "Facebook" ? "noopener noreferrer" : undefined}
              >
                <Card className="border-none shadow-soft bg-card hover-lift cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl ${info.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <info.icon className={`w-6 h-6 ${info.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}

            {/* Map Placeholder or Iframe */}
            <Card className="border-none shadow-soft bg-card overflow-hidden">
              <CardContent className="p-0">
                {profile?.google_map_url ? (
                  <iframe
                    src={profile.google_map_url}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="h-48 bg-gradient-hero flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">แผนที่โรงเรียน</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("messages").insert([formData]);
      if (error) throw error;
      SwalFire.success("ส่งข้อความสำเร็จ", "เราได้รับข้อมูลเรียบร้อยแล้ว");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      SwalFire.error("ส่งข้อความไม่สำเร็จ", "กรุณาลองใหม่อีกครั้ง");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">ชื่อ *</label>
          <Input
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="ชื่อของคุณ"
            className="rounded-xl border-border focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">อีเมล *</label>
          <Input
            required
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com"
            className="rounded-xl border-border focus:border-primary"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">หัวข้อ</label>
        <Input
          value={formData.subject}
          onChange={e => setFormData({ ...formData, subject: e.target.value })}
          placeholder="เรื่องที่ต้องการติดต่อ"
          className="rounded-xl border-border focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">ข้อความ *</label>
        <Textarea
          required
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          placeholder="พิมพ์ข้อความของคุณที่นี่..."
          rows={5}
          className="rounded-xl border-border focus:border-primary resize-none"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90 rounded-full gap-2">
        <Heart className="w-4 h-4" />
        {loading ? "กำลังส่ง..." : "ส่งข้อความ"}
      </Button>
    </form>
  );
}