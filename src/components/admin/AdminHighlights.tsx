
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SwalFire } from "@/utils/sweetalert";
import { HighlightsEditor } from "@/components/admin/HighlightsEditor";
import { StatsEditor } from "@/components/admin/StatsEditor";
import { AdminMessages } from "@/components/admin/AdminMessages";

export function AdminHighlights() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>({
        stats_years: "",
        stats_students: "",
        stats_awards: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data, error } = await (supabase
            .from("profiles") as any)
            .select("stats_years, stats_students, stats_awards")
            .limit(1)
            .maybeSingle();

        if (data) {
            setProfile({
                stats_years: data.stats_years || "",
                stats_students: data.stats_students || "",
                stats_awards: data.stats_awards || "",
            });
        }
    };

    const handleSaveStats = async () => {
        setLoading(true);
        const { data: existing } = await (supabase.from("profiles") as any).select("id").limit(1).maybeSingle();

        if (existing) {
            const { error } = await (supabase
                .from("profiles") as any)
                .update(profile)
                .eq("id", existing.id);

            if (error) {
                SwalFire.error("บันทึกไม่สำเร็จ", error.message);
            } else {
                SwalFire.success("บันทึกตัวเลขสถิติเรียบร้อย");
            }
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>สถิติหน้าแรก (Hero Stats)</CardTitle>
                    <CardDescription>ตัวเลขสถิติที่จะแสดงในส่วนบนสุดของเว็บไซต์</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>ปีประสบการณ์</Label>
                            <Input
                                value={profile.stats_years}
                                onChange={(e) => setProfile({ ...profile, stats_years: e.target.value })}
                                placeholder="10+"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>จำนวนนักเรียน</Label>
                            <Input
                                value={profile.stats_students}
                                onChange={(e) => setProfile({ ...profile, stats_students: e.target.value })}
                                placeholder="500+"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>จำนวนรางวัล</Label>
                            <Input
                                value={profile.stats_awards}
                                onChange={(e) => setProfile({ ...profile, stats_awards: e.target.value })}
                                placeholder="50+"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSaveStats} disabled={loading} className="w-full md:w-auto">
                        {loading ? "กำลังบันทึก..." : "บันทึกตัวเลขสถิติ"}
                    </Button>
                </CardContent>
            </Card>

            <HighlightsEditor />

            <div className="border-t pt-6">
                <StatsEditor />
            </div>

            <div className="border-t pt-6">
                <AdminMessages />
            </div>
        </div>
    );
}
