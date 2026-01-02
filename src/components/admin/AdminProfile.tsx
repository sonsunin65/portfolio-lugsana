import { useEffect, useState } from "react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SwalFire } from "@/utils/sweetalert";
import { FileUploader } from "@/components/admin/FileUploader";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminProfile() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<Partial<Profile>>({
        full_name: "",
        position: "",
        bio: "",
        teaching_philosophy: "",
        stats_years: "",
        stats_students: "",
        stats_awards: "",
        image_url: "",
        email: "",
        phone: "",
        address: "",
        facebook: "",
        facebook_url: "",
        line_id: "",
        line_url: "",
        welcome_message_1: "",
        welcome_message_2: "",
        hero_badge_text: "",
        about_short_description: "",
        about_section_body: "",
        works_description: "",
        certificates_description: "",
        activities_description: "",
        pa_description: "",
        pa_header_title: "",
        pa_header_subtitle: "",
        pa_badge_text: "",
        google_map_url: "",
        footer_text: "",
        contact_description: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .limit(1)
            .maybeSingle();

        if (data) {
            const profileData = data as Profile;
            setProfile({
                full_name: profileData.full_name || "",
                position: profileData.position || "",
                bio: profileData.bio || "",
                teaching_philosophy: profileData.teaching_philosophy || "",
                stats_years: profileData.stats_years || "",
                stats_students: profileData.stats_students || "",
                stats_awards: profileData.stats_awards || "",
                image_url: profileData.image_url || "",
                email: profileData.email || "",
                phone: profileData.phone || "",
                address: profileData.address || "",
                facebook: profileData.facebook || "",
                facebook_url: profileData.facebook_url || "",
                line_id: profileData.line_id || "",
                line_url: profileData.line_url || "",
                welcome_message_1: profileData.welcome_message_1 || "",
                welcome_message_2: profileData.welcome_message_2 || "",
                hero_badge_text: profileData.hero_badge_text || "",
                about_short_description: profileData.about_short_description || "",
                about_section_body: profileData.about_section_body || "",
                works_description: profileData.works_description || "",
                certificates_description: profileData.certificates_description || "",
                activities_description: profileData.activities_description || "",
                pa_description: profileData.pa_description || "",
                pa_header_title: profileData.pa_header_title || "",
                pa_header_subtitle: profileData.pa_header_subtitle || "",
                pa_badge_text: profileData.pa_badge_text || "",
                google_map_url: profileData.google_map_url || "",
                footer_text: profileData.footer_text || "",
                contact_description: profileData.contact_description || "",
            });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data: existing } = await supabase.from("profiles").select("id").limit(1).maybeSingle();
            const { data: { user } } = await supabase.auth.getUser();

            // Explicitly map only the fields that exist in the database schema
            const profileData: any = {
                // ... (fields remain same)
                full_name: profile.full_name || "",
                position: profile.position,
                email: profile.email,
                phone: profile.phone,
                address: profile.address,
                facebook: profile.facebook,
                facebook_url: profile.facebook_url,
                line_id: profile.line_id,
                line_url: profile.line_url,
                bio: profile.bio,
                teaching_philosophy: profile.teaching_philosophy,
                image_url: profile.image_url,
                stats_years: profile.stats_years,
                stats_students: profile.stats_students,
                stats_awards: profile.stats_awards,
                welcome_message_1: profile.welcome_message_1,
                welcome_message_2: profile.welcome_message_2,
                hero_badge_text: profile.hero_badge_text,
                about_short_description: profile.about_short_description,
                about_section_body: profile.about_section_body,
                works_description: profile.works_description,
                certificates_description: profile.certificates_description,
                activities_description: profile.activities_description,
                pa_description: profile.pa_description,
                pa_header_title: profile.pa_header_title,
                pa_header_subtitle: profile.pa_header_subtitle,
                pa_badge_text: profile.pa_badge_text,
                google_map_url: profile.google_map_url,
                footer_text: profile.footer_text,
                contact_description: profile.contact_description
            };

            let error;
            if (existing) {
                const { error: updateError } = await (supabase
                    .from("profiles") as any)
                    .update(profileData)
                    .eq("id", existing.id);
                error = updateError;
            } else {
                if (!user?.id) throw new Error("ไม่พบข้อมูลผู้ใช้");
                const { error: insertError } = await (supabase
                    .from("profiles") as any)
                    .insert([{ ...profileData, id: user.id }]);
                error = insertError;
            }

            if (error) throw error;

            SwalFire.success("บันทึกข้อมูลเรียบร้อย");
        } catch (error: any) {
            console.error("Error saving profile:", error);
            SwalFire.error("บันทึกไม่สำเร็จ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>ข้อมูลส่วนตัว (Profile)</CardTitle>
                    <CardDescription>จัดการข้อมูลทั่วไปที่แสดงในหน้าแรกและหน้าเกี่ยวกับ</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 mb-8">
                            <TabsTrigger value="general">ข้อมูลทั่วไป</TabsTrigger>
                            <TabsTrigger value="home">หน้าแรก</TabsTrigger>
                            <TabsTrigger value="about">เกี่ยวกับ</TabsTrigger>

                            <TabsTrigger value="sections">หัวข้อส่วนต่างๆ</TabsTrigger>
                            <TabsTrigger value="pa">ส่วน PA</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-4">
                            <div className="space-y-2">
                                <Label>รูปภาพโปรไฟล์</Label>
                                <FileUploader
                                    defaultUrl={profile.image_url}
                                    onUploadComplete={async (url) => {
                                        // If there was an old image, delete it
                                        if (profile.image_url && profile.image_url !== url) {
                                            const { deleteFileFromStorage } = await import("@/utils/storage"); // Dynamic import to avoid cycles if any, though regular import is fine
                                            await deleteFileFromStorage(profile.image_url);
                                        }
                                        setProfile({ ...profile, image_url: url });
                                    }}
                                    folderName="profile"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>ชื่อ-นามสกุล</Label>
                                    <Input
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>ตำแหน่ง</Label>
                                    <Input
                                        value={profile.position}
                                        onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>อีเมล (Email)</Label>
                                    <Input
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        placeholder="example@email.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>เบอร์โทรศัพท์</Label>
                                    <Input
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="081-234-5678"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Facebook (ชื่อแสดง)</Label>
                                    <Input
                                        value={profile.facebook}
                                        onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                                        placeholder="ชื่อบัญชี Facebook"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Facebook URL (ลิ้งก์)</Label>
                                    <Input
                                        value={profile.facebook_url}
                                        onChange={(e) => setProfile({ ...profile, facebook_url: e.target.value })}
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Line ID</Label>
                                    <Input
                                        value={profile.line_id}
                                        onChange={(e) => setProfile({ ...profile, line_id: e.target.value })}
                                        placeholder="Line ID"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Line URL (ลิ้งก์)</Label>
                                    <Input
                                        value={profile.line_url}
                                        onChange={(e) => setProfile({ ...profile, line_url: e.target.value })}
                                        placeholder="https://line.me/ti/p/..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>ที่อยู่</Label>
                                <Textarea
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    placeholder="ที่อยู่โรงเรียน หรือที่อยู่ที่ต้องการแสดง"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>ลิงก์ Google Map (URL หรือ Embed Code)</Label>
                                <Input
                                    value={profile.google_map_url}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Aggressively look for the Google Maps embed URL pattern
                                        // This handles full iframe, src="..." substring, or just the URL
                                        const match = value.match(/(https:\/\/www\.google\.com\/maps\/embed\?[^"'\s>]+)/);

                                        if (match) {
                                            setProfile({ ...profile, google_map_url: match[1] });
                                        } else {
                                            setProfile({ ...profile, google_map_url: value });
                                        }
                                    }}
                                    placeholder="วางโค้ด iframe หรือใส่ URL โดยตรง"
                                />
                                <p className="text-xs text-muted-foreground">
                                    คุณสามารถวางโค้ด {`<iframe>`} ทั้งหมด หรือวางเฉพาะลิงก์ก็ได้ ระบบจะตัดเอาเฉพาะส่วนที่ถูกต้องมาใช้งานครับ
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="home" className="space-y-4">
                            <div className="space-y-2">
                                <Label>ข้อความต้อนรับ (บรรทัดบน)</Label>
                                <Input
                                    value={profile.welcome_message_1}
                                    onChange={(e) => setProfile({ ...profile, welcome_message_1: e.target.value })}
                                    placeholder="ยินดีต้อนรับสู่ Portfolio ของครู"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ข้อความทักทาย (บรรทัดล่าง)</Label>
                                <Input
                                    value={profile.welcome_message_2}
                                    onChange={(e) => setProfile({ ...profile, welcome_message_2: e.target.value })}
                                    placeholder="สวัสดีครับ ผม"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ข้อความในป้าย (Badge)</Label>
                                <Input
                                    value={profile.hero_badge_text}
                                    onChange={(e) => setProfile({ ...profile, hero_badge_text: e.target.value })}
                                    placeholder="ครูดีเด่น"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ข้อความ Footer</Label>
                                <Input
                                    value={profile.footer_text}
                                    onChange={(e) => setProfile({ ...profile, footer_text: e.target.value })}
                                    placeholder="สร้างด้วย <Heart/> © 2569"
                                />
                                <p className="text-xs text-muted-foreground">
                                    ใช้ <code>{`<Heart/>`}</code> เพื่อแสดงไอคอนหัวใจ
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="about" className="space-y-4">
                            <div className="space-y-2">
                                <Label>ข้อความแนะนำตัว (Short Bio/Tagline)</Label>
                                <Textarea
                                    value={profile.about_short_description}
                                    onChange={(e) => setProfile({ ...profile, about_short_description: e.target.value })}
                                    placeholder="ครูผู้มุ่งมั่นในการพัฒนาศักยภาพของนักเรียนทุกคน..."
                                    className="h-20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ประวัติสังเขป (Bio ในส่วน Hero)</Label>
                                <Textarea
                                    className="h-24"
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="ข้อความที่แสดงในส่วนแรกของเว็บ (ใต้รูปโปรไฟล์)"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>เนื้อหาเกี่ยวกับครู (About Section)</Label>
                                <Textarea
                                    className="h-32"
                                    value={profile.about_section_body}
                                    onChange={(e) => setProfile({ ...profile, about_section_body: e.target.value })}
                                    placeholder="เขียนเนื้อหาแนะนำตัวที่ยาวขึ้นในส่วน About (สามารถขึ้นบรรทัดใหม่เพื่อแบ่งย่อหน้าได้)"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ปรัชญาการสอน</Label>
                                <Textarea
                                    className="h-24"
                                    value={profile.teaching_philosophy}
                                    onChange={(e) => setProfile({ ...profile, teaching_philosophy: e.target.value })}
                                />
                            </div>
                        </TabsContent>



                        <TabsContent value="sections" className="space-y-4">
                            <div className="space-y-2">
                                <Label>คำอธิบายส่วนผลงาน (Works Section)</Label>
                                <Textarea
                                    className="h-20"
                                    value={profile.works_description}
                                    onChange={(e) => setProfile({ ...profile, works_description: e.target.value })}
                                    placeholder="ข้อความบรรยายใต้หัวข้อผลงาน"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>คำอธิบายส่วนรางวัล (Certificates Section)</Label>
                                <Textarea
                                    className="h-20"
                                    value={profile.certificates_description}
                                    onChange={(e) => setProfile({ ...profile, certificates_description: e.target.value })}
                                    placeholder="ข้อความบรรยายใต้หัวข้อเกียรติบัตร"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>คำอธิบายส่วนกิจกรรม (Activities Section)</Label>
                                <Textarea
                                    className="h-20"
                                    value={profile.activities_description}
                                    onChange={(e) => setProfile({ ...profile, activities_description: e.target.value })}
                                    placeholder="ข้อความบรรยายใต้หัวข้อยิจกรรม"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>คำอธิบายส่วนติดต่อ (Contact Section)</Label>
                                <Textarea
                                    className="h-20"
                                    value={profile.contact_description}
                                    onChange={(e) => setProfile({ ...profile, contact_description: e.target.value })}
                                    placeholder="ข้อความเชิญชวนให้ติดต่อ สอบถาม หรือพูดคุย"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="pa" className="space-y-4">
                            <div className="space-y-2">
                                <Label>ข้อความในป้าย PA (Badge)</Label>
                                <Input
                                    value={profile.pa_badge_text}
                                    onChange={(e) => setProfile({ ...profile, pa_badge_text: e.target.value })}
                                    placeholder="Performance Agreement (PA)"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>หัวข้อหลักหน้า PA (Title)</Label>
                                    <Input
                                        value={profile.pa_header_title}
                                        onChange={(e) => setProfile({ ...profile, pa_header_title: e.target.value })}
                                        placeholder="ข้อตกลงในการพัฒนางาน"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>หัวข้อย่อยหน้า PA (Subtitle)</Label>
                                    <Input
                                        value={profile.pa_header_subtitle}
                                        onChange={(e) => setProfile({ ...profile, pa_header_subtitle: e.target.value })}
                                        placeholder="วPA (Performance Agreement)"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>คำอธิบายส่วน PA (Performance Evaluation)</Label>
                                <Textarea
                                    className="h-24"
                                    value={profile.pa_description}
                                    onChange={(e) => setProfile({ ...profile, pa_description: e.target.value })}
                                    placeholder="ข้อความบรรยายในหน้า วPA"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <Button onClick={handleSave} disabled={loading} className="w-full mt-6">
                        {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                    </Button>
                </CardContent>
            </Card>
        </div >
    );
}
