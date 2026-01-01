
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SwalFire } from "@/utils/sweetalert";
import { Loader2, Plus, Trash2, Save, Trophy, Award, Medal, Star, Crown, GraduationCap, Users, Heart, BookOpen } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import { Stat } from "@/types";

// Remove local interface Stat
// interface Stat { ... }

const ICONS = [
    { name: "Trophy", icon: Trophy },
    { name: "Award", icon: Award },
    { name: "Medal", icon: Medal },
    { name: "Star", icon: Star },
    { name: "Crown", icon: Crown },
    { name: "GraduationCap", icon: GraduationCap },
    { name: "Users", icon: Users },
    { name: "Heart", icon: Heart },
    { name: "BookOpen", icon: BookOpen },
];

const COLORS = [
    { name: "Primary (Red/Pink)", class: "text-primary" },
    { name: "Secondary (Blue)", class: "text-secondary" },
    { name: "Accent (Purple)", class: "text-accent" },
    { name: "Coral (Orange)", class: "text-coral" },
    { name: "Green", class: "text-green-600" },
    { name: "Yellow", class: "text-yellow-500" },
];

export function StatsEditor() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase
                .from("stats")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            setStats(data || []);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        const newStat: Stat = {
            id: `temp-${Date.now()}`,
            title: "",
            label: "",
            icon_name: "Trophy",
            color_class: "text-primary",
            display_order: stats.length + 1,
            created_at: new Date().toISOString()
        };
        setStats([...stats, newStat]);
    };

    const handleUpdate = (index: number, field: keyof Stat, value: any) => {
        const updated = [...stats];
        updated[index] = { ...updated[index], [field]: value };
        setStats(updated);
    };

    const handleDelete = (index: number) => {
        const updated = stats.filter((_, i) => i !== index);
        setStats(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Simple sync: Delete all and re-insert (safe for small lists)
            const { error: deleteError } = await supabase
                .from("stats")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

            if (deleteError) throw deleteError;

            const toInsert = stats.map(({ id, ...rest }, index) => ({
                ...rest,
                display_order: index + 1,
            }));

            if (toInsert.length > 0) {
                const { error: insertError } = await (supabase
                    .from("stats") as any)
                    .insert(toInsert);
                if (insertError) throw insertError;
            }

            SwalFire.success("บันทึกข้อมูลเรียบร้อย");
            fetchStats();
        } catch (error: any) {
            SwalFire.error("บันทึกไม่สำเร็จ", error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-4"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-lg font-medium">สถิติท้ายส่วนเกียรติบัตร (Certificates Stats)</Label>
                <Button variant="outline" size="sm" onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" /> เพิ่มรายการ
                </Button>
            </div>

            <div className="grid gap-4">
                {stats.map((item, index) => (
                    <Card key={item.id} className="relative">
                        <CardContent className="p-4 grid md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-1 flex justify-center pb-2 md:pb-0">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                    {(() => {
                                        const IconData = ICONS.find(i => i.name === item.icon_name);
                                        const Icon = IconData ? IconData.icon : Trophy;
                                        return <Icon className={`w-6 h-6 ${item.color_class}`} />;
                                    })()}
                                </div>
                            </div>

                            <div className="md:col-span-3 space-y-2">
                                <Label>หัวข้อ (Title)</Label>
                                <Input
                                    value={item.title}
                                    onChange={(e) => handleUpdate(index, "title", e.target.value)}
                                    placeholder="เช่น ประสบการณ์สอน"
                                />
                            </div>

                            <div className="md:col-span-4 space-y-2">
                                <Label>ตัวเลข/รายละเอียด (Label)</Label>
                                <Input
                                    value={item.label}
                                    onChange={(e) => handleUpdate(index, "label", e.target.value)}
                                    placeholder="เช่น 8 ปี"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label>ไอคอน</Label>
                                <Select
                                    value={item.icon_name}
                                    onValueChange={(val) => handleUpdate(index, "icon_name", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ICONS.map(icon => (
                                            <SelectItem key={icon.name} value={icon.name}>
                                                <div className="flex items-center gap-2">
                                                    <icon.icon className="w-4 h-4" />
                                                    <span>{icon.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-1 space-y-2">
                                <Label>สี</Label>
                                <Select
                                    value={item.color_class}
                                    onValueChange={(val) => handleUpdate(index, "color_class", val)}
                                >
                                    <SelectTrigger>
                                        <div className={`w-4 h-4 rounded-full ${item.color_class.replace('text-', 'bg-')}`}></div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COLORS.map(color => (
                                            <SelectItem key={color.name} value={color.class}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full ${color.class.replace('text-', 'bg-')}`}></div>
                                                    <span>{color.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-1 flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังบันทึก...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4 mr-2" /> บันทึกสถิติ (Stats)
                    </>
                )}
            </Button>
        </div>
    );
}
