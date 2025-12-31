
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SwalFire } from "@/utils/sweetalert";
import { Loader2, Plus, Trash2, Save, GraduationCap, Award, BookOpen, Users, Heart, Star } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Highlight {
    id: string;
    title: string;
    description: string;
    icon_name: string;
    display_order: number;
    bg_class: string;
    color_class: string;
}

const ICONS = [
    { name: "GraduationCap", icon: GraduationCap },
    { name: "Award", icon: Award },
    { name: "BookOpen", icon: BookOpen },
    { name: "Users", icon: Users },
    { name: "Heart", icon: Heart },
    { name: "Star", icon: Star },
];

const COLORS = [
    { name: "Pink", bg: "bg-pink-100", text: "text-pink-600" },
    { name: "Blue", bg: "bg-blue-100", text: "text-blue-600" },
    { name: "Green", bg: "bg-green-100", text: "text-green-600" },
    { name: "Yellow", bg: "bg-yellow-100", text: "text-yellow-600" },
    { name: "Purple", bg: "bg-purple-100", text: "text-purple-600" },
    { name: "Orange", bg: "bg-orange-100", text: "text-orange-600" },
];

export function HighlightsEditor() {
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchHighlights();
    }, []);

    const fetchHighlights = async () => {
        try {
            const { data, error } = await supabase
                .from("highlights")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            setHighlights(data || []);

        } catch (error) {
            console.error("Error fetching highlights:", error);
            SwalFire.error("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูล Highlights ได้");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        const newHighlight: Highlight = {
            id: `temp-${Date.now()}`, // Temporary ID
            title: "",
            description: "",
            icon_name: "Award",
            display_order: highlights.length + 1,
            bg_class: "bg-pink-100",
            color_class: "text-pink-600",
        };
        setHighlights([...highlights, newHighlight]);
    };

    const handleUpdate = (index: number, field: keyof Highlight, value: any) => {
        const updated = [...highlights];
        updated[index] = { ...updated[index], [field]: value };

        // If color changes, verify bg_class consistency (optional, but good for UX)
        if (field === "bg_class") {
            // Find matching color object to set text color automatically if needed
            const colorObj = COLORS.find(c => c.bg === value);
            if (colorObj) {
                updated[index].color_class = colorObj.text;
            }
        }

        setHighlights(updated);
    };

    const handleDelete = (index: number) => {
        const updated = highlights.filter((_, i) => i !== index);
        setHighlights(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Delete all existing records (simple sync strategy)
            // Ideally we should upsert, but for small lists, replacing is easier to manage order
            const { error: deleteError } = await supabase
                .from("highlights")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

            if (deleteError) throw deleteError;

            // 2. Insert current list
            const toInsert = highlights.map(({ id, ...rest }, index) => ({
                ...rest,
                display_order: index + 1,
            }));

            if (toInsert.length > 0) {
                const { error: insertError } = await supabase
                    .from("highlights")
                    .insert(toInsert as any);

                if (insertError) throw insertError;
            }

            SwalFire.success("บันทึกข้อมูลเรียบร้อย");
            fetchHighlights(); // Refresh to get real IDs
        } catch (error: any) {
            console.error("Error saving highlights:", error);
            SwalFire.error("บันทึกไม่สำเร็จ", error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-4"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-lg font-medium">สถิติและจุดเด่น (Highlights)</Label>
                <Button variant="outline" size="sm" onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" /> เพิ่มรายการ
                </Button>
            </div>

            <div className="grid gap-4">
                {highlights.map((item, index) => (
                    <Card key={item.id} className="relative">
                        <CardContent className="p-4 grid md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-1 flex justify-center pb-2 md:pb-0">
                                <div className={`w-10 h-10 rounded-lg ${item.bg_class || 'bg-gray-100'} flex items-center justify-center`}>
                                    {(() => {
                                        const IconData = ICONS.find(i => i.name === item.icon_name);
                                        const Icon = IconData ? IconData.icon : Award;
                                        return <Icon className={`w-5 h-5 ${item.color_class || 'text-gray-500'}`} />;
                                    })()}
                                </div>
                            </div>

                            <div className="md:col-span-3 space-y-2">
                                <Label>หัวข้อ (ตัวเลข)</Label>
                                <Input
                                    value={item.title}
                                    onChange={(e) => handleUpdate(index, "title", e.target.value)}
                                    placeholder="เช่น 10+"
                                />
                            </div>

                            <div className="md:col-span-4 space-y-2">
                                <Label>คำอธิบาย</Label>
                                <Input
                                    value={item.description}
                                    onChange={(e) => handleUpdate(index, "description", e.target.value)}
                                    placeholder="เช่น ปีประสบการณ์"
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
                                    value={item.bg_class}
                                    onValueChange={(val) => handleUpdate(index, "bg_class", val)}
                                >
                                    <SelectTrigger>
                                        <div className={`w-4 h-4 rounded-full ${item.bg_class}`}></div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COLORS.map(color => (
                                            <SelectItem key={color.name} value={color.bg}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full ${color.bg}`}></div>
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

            {highlights.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    ยังไม่มีข้อมูลสถิติ
                </div>
            )}

            <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังบันทึก...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4 mr-2" /> บันทึก Highlights
                    </>
                )}
            </Button>
        </div>
    );
}
