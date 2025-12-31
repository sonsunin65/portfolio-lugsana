import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SwalFire } from "@/utils/sweetalert";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/admin/FileUploader";

export function AdminCertificates() {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        issuer: "",
        year: "",
        type: "รางวัล",
        icon_name: "Trophy",
        color_class: "text-accent",
        bg_class: "bg-accent/10",
        display_order: 1,
        file_url: "",
        file_type: "",
        external_links: [] as { title: string; url: string }[],
        images: [] as string[]
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        const { data } = await (supabase.from("certificates") as any).select("*").order("display_order");
        if (data) {
            const formattedData = data.map(item => ({
                ...item,
                // Ensure external_links is an array
                external_links: Array.isArray(item.external_links) ? item.external_links : [],
                // Ensure images is an array, fallback to file_url
                images: Array.isArray(item.images) ? item.images : (item.file_url ? [item.file_url] : [])
            }));
            setCertificates(formattedData);
        }
    };

    const handleSave = async () => {
        const { deleteFilesFromStorage } = await import("@/utils/storage");

        if (editingItem) {
            // Check for removed images
            const oldImages: string[] = Array.isArray(editingItem.images) ? editingItem.images : [];
            const newImages: string[] = formData.images;

            const removedImages = oldImages.filter(img => !newImages.includes(img));

            if (removedImages.length > 0) {
                await deleteFilesFromStorage(removedImages);
            }

            const { error } = await (supabase.from("certificates") as any).update(formData).eq("id", editingItem.id);
            if (!error) SwalFire.success("แก้ไขสำเร็จ");
        } else {
            const { error } = await (supabase.from("certificates") as any).insert(formData);
            if (!error) SwalFire.success("เพิ่มสำเร็จ");
        }
        setDialogOpen(false);
        setEditingItem(null);
        fetchCertificates();
    };

    const handleDelete = async (id: string) => {
        if (!(await SwalFire.confirm("ยืนยันการลบ?"))) return;

        const itemToDelete = certificates.find(c => c.id === id);
        if (itemToDelete) {
            const { deleteFilesFromStorage } = await import("@/utils/storage");
            const imagesToDelete = [...(itemToDelete.images || [])];
            if (itemToDelete.file_url) imagesToDelete.push(itemToDelete.file_url);

            await deleteFilesFromStorage(imagesToDelete);
        }

        const { error } = await (supabase.from("certificates") as any).delete().eq("id", id);
        if (!error) {
            SwalFire.success("ลบสำเร็จ");
            fetchCertificates();
        }
    };

    const addLink = () => {
        setFormData({
            ...formData,
            external_links: [...formData.external_links, { title: "", url: "" }]
        });
    };

    const removeLink = (index: number) => {
        const newLinks = [...formData.external_links];
        newLinks.splice(index, 1);
        setFormData({ ...formData, external_links: newLinks });
    };

    const updateLink = (index: number, field: "title" | "url", value: string) => {
        const newLinks = [...formData.external_links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData({ ...formData, external_links: newLinks });
    };

    const addImage = (url: string) => {
        if (formData.images.length >= 4) {
            SwalFire.error("เพิ่มรูปไม่ได้", "สามารถเพิ่มรูปได้สูงสุด 4 รูป");
            return;
        }
        setFormData({ ...formData, images: [...formData.images, url] });
    };

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>เกียรติบัตร (Certificates)</CardTitle>
                    <CardDescription>จัดการข้อมูลรางวัลและเกียรติบัตร</CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            setEditingItem(null);
                            setFormData({
                                title: "",
                                issuer: "",
                                year: "2568",
                                type: "รางวัล",
                                icon_name: "Trophy",
                                color_class: "text-accent",
                                bg_class: "bg-accent/10",
                                display_order: certificates.length + 1,
                                file_url: "",
                                file_type: "",
                                external_links: [],
                                images: []
                            });
                        }}>
                            <Plus className="w-4 h-4 mr-2" /> เพิ่ม
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "แก้ไข" : "เพิ่ม"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>ชื่อรางวัล/เกียรติบัตร</Label>
                                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <Label>หน่วยงานที่มอบ</Label>
                                <Input value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>ปี พ.ศ.</Label>
                                    <Input value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                                </div>
                                <div>
                                    <Label>ประเภท</Label>
                                    <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <Label>Icon Type</Label>
                                <Select value={formData.icon_name} onValueChange={(v) => setFormData({ ...formData, icon_name: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Trophy">Trophy</SelectItem>
                                        <SelectItem value="Crown">Crown</SelectItem>
                                        <SelectItem value="Award">Award</SelectItem>
                                        <SelectItem value="Medal">Medal</SelectItem>
                                        <SelectItem value="Star">Star</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>ลำดับ</Label>
                                <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label>ลิ้งก์ภายนอก</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addLink}>
                                        <Plus className="w-3 h-3 mr-1" /> เพิ่มลิ้งก์
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.external_links.map((link, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Input
                                                placeholder="ชื่อปุ่ม"
                                                value={link.title}
                                                onChange={(e) => updateLink(index, "title", e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="URL"
                                                value={link.url}
                                                onChange={(e) => updateLink(index, "url", e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(index)} className="text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <Label className="block mb-2">รูปภาพเกียรติบัตร (สูงสุด 4 ไฟล์)</Label>

                                {/* Existing Images Grid */}
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden border group bg-muted/10">
                                                {img.toLowerCase().endsWith('.pdf') ? (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-white">
                                                        <span className="text-xs font-bold p-2 text-center break-all">PDF File</span>
                                                    </div>
                                                ) : (
                                                    <img src={img} alt={`cert-${index}`} className="w-full h-full object-cover" />
                                                )}

                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> ลบ
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Area */}
                                {formData.images.length < 4 ? (
                                    <div className="border rounded-lg p-4 bg-muted/20">
                                        <Label className="mb-2 block">เพิ่มไฟล์ ({formData.images.length}/4)</Label>
                                        <FileUploader
                                            key={formData.images.length}
                                            folderName="certificates"
                                            onUploadComplete={(url) => addImage(url)}
                                            label="อัปโหลด"
                                            accept="image/*,.pdf"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center p-2 text-sm text-muted-foreground bg-muted rounded-md">
                                        ครบจำนวน 4 ไฟล์แล้ว
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSave}>บันทึก</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {certificates.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline">{item.display_order}</Badge>
                                <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.issuer} | {item.year}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => {
                                    setEditingItem(item);
                                    setFormData({
                                        ...item,
                                        images: item.images || (item.file_url ? [item.file_url] : [])
                                    });
                                    setDialogOpen(true);
                                }}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
