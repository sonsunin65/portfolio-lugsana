import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SwalFire } from "@/utils/sweetalert";
import { Pencil, Trash2, Plus, X, Image as ImageIcon, Smile, GripVertical } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/admin/FileUploader";
import { EmojiPickerButton } from "@/components/admin/EmojiPickerButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// DnD Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableActivityItem({ item, onEdit, onDelete }: { item: any, onEdit: (item: any) => void, onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move p-2 hover:bg-accent/50 rounded-md text-muted-foreground"
                >
                    <GripVertical className="w-5 h-5" />
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-secondary/10`}>
                    {/* Always show emoji in admin list if available, or first image */}
                    {item.image_emoji || (item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt="thumbnail" className="w-full h-full object-cover rounded-lg" />
                    ) : "🏕️")}
                </div>
                <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="text-sm text-muted-foreground flex gap-2">
                        <span>{item.date_display}</span>
                        <span>•</span>
                        <span>{item.location}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export function AdminActivities() {
    const [activities, setActivities] = useState<any[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState("emoji");
    const [formData, setFormData] = useState({
        title: "",
        date_display: "",
        location: "",
        participants: 0,
        description: "",
        image_emoji: "🏕️",
        color_gradient_class: "from-primary to-coral",
        display_order: 1,
        images: [] as string[],
        external_links: [] as { title: string; url: string }[]
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        const { data } = await (supabase.from("activities") as any).select("*").order("display_order", { ascending: true });
        if (data) {
            const formattedData = data.map(item => ({
                ...item,
                external_links: Array.isArray(item.external_links) ? item.external_links : [],
                images: Array.isArray(item.images) ? item.images : (item.file_url ? [item.file_url] : [])
            }));
            setActivities(formattedData);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setActivities((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update display_order logic
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    display_order: index + 1
                }));

                // Save to database
                const saveOrder = async () => {
                    for (const update of updates) {
                        await (supabase
                            .from('activities') as any)
                            .update({ display_order: update.display_order })
                            .eq('id', update.id);
                    }
                    SwalFire.success("บันทึกลำดับใหม่เรียบร้อยแล้ว");
                };
                saveOrder();

                return newItems;
            });
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            date_display: item.date_display,
            location: item.location,
            participants: item.participants || 0,
            description: item.description || "",
            image_emoji: item.image_emoji || "🏕️",
            color_gradient_class: item.color_gradient_class || "from-primary to-coral",
            display_order: item.display_order || 1,
            images: item.images || [],
            external_links: item.external_links || []
        });
        // Determine active tab based on content
        if (item.images && item.images.length > 0) {
            setActiveTab("image");
        } else {
            setActiveTab("emoji");
        }
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            date_display: "",
            location: "",
            participants: 0,
            description: "",
            image_emoji: "🏕️",
            color_gradient_class: "from-primary to-coral",
            display_order: activities.length + 1,
            images: [],
            external_links: []
        });
        setActiveTab("emoji");
        setDialogOpen(true);
    };

    const handleSave = async () => {
        const { deleteFilesFromStorage } = await import("@/utils/storage");

        // Prepare data based on active tab
        const dataToSave = {
            ...formData,
            // Always save the emoji, regardless of tab
            image_emoji: formData.image_emoji,
            images: activeTab === "image" ? formData.images : [],
            // Clear legacy fields if switching to generic images array
            file_url: null,
            file_type: null
        };

        if (editingItem) {
            // Check for removed images
            const oldImages: string[] = Array.isArray(editingItem.images) ? editingItem.images : [];
            const newImages: string[] = dataToSave.images;

            // Find images in oldImages that are NOT in newImages
            const removedImages = oldImages.filter(img => !newImages.includes(img));

            // Should also check if we switched from Image tab to Emoji tab, all old images are removed
            // The logic above handles it because newImages would be [] if activeTab != 'image'

            if (removedImages.length > 0) {
                await deleteFilesFromStorage(removedImages);
            }

            const { error } = await (supabase.from("activities") as any).update(dataToSave).eq("id", editingItem.id);
            if (!error) SwalFire.success("แก้ไขสำเร็จ");
            else SwalFire.error("เกิดข้อผิดพลาด", error.message);
        } else {
            const { error } = await (supabase.from("activities") as any).insert(dataToSave);
            if (!error) SwalFire.success("เพิ่มสำเร็จ");
            else SwalFire.error("เกิดข้อผิดพลาด", error.message);
        }
        setDialogOpen(false);
        setEditingItem(null);
        fetchActivities();
    };

    const handleDelete = async (id: string) => {
        if (!(await SwalFire.confirm("ยืนยันการลบ?"))) return;

        // Find item to delete files
        const itemToDelete = activities.find(a => a.id === id);
        if (itemToDelete) {
            const { deleteFilesFromStorage } = await import("@/utils/storage");
            const imagesToDelete = [...(itemToDelete.images || [])];
            if (itemToDelete.file_url) imagesToDelete.push(itemToDelete.file_url);

            await deleteFilesFromStorage(imagesToDelete);
        }

        const { error } = await (supabase.from("activities") as any).delete().eq("id", id);
        if (!error) {
            SwalFire.success("ลบสำเร็จ");
            fetchActivities();
        }
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

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>กิจกรรม (Activities)</CardTitle>
                    <CardDescription>จัดการข้อมูลกิจกรรมพัฒนาผู้เรียน</CardDescription>
                </div>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" />เพิ่มกิจกรรม</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={activities.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {activities.map((item) => (
                                <SortableActivityItem
                                    key={item.id}
                                    item={item}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>ชื่อกิจกรรม</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="เช่น กิจกรรมค่ายวิชาการ"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>วันที่จัดกิจกรรม</Label>
                                    <Input
                                        value={formData.date_display}
                                        onChange={(e) => setFormData({ ...formData, date_display: e.target.value })}
                                        placeholder="เช่น 15 มกราคม 2569"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>รูปแบบการแสดงผล</Label>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="emoji" className="flex items-center gap-2">
                                            <Smile className="w-4 h-4" /> Emoji Icon
                                        </TabsTrigger>
                                        <TabsTrigger value="image" className="flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> รูปภาพ (สูงสุด 4 รูป)
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="emoji" className="space-y-4 pt-4">
                                        <div className="flex items-end gap-4">
                                            <div className="space-y-2 flex-1">
                                                <Label>เลือก Emoji</Label>
                                                <EmojiPickerButton
                                                    value={formData.image_emoji}
                                                    onChange={(emoji) => setFormData({ ...formData, image_emoji: emoji })}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="image" className="space-y-4 pt-4">
                                        <div className="space-y-2 mb-4">
                                            <Label>Emoji สำหรับแสดงหน้าแรก</Label>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <EmojiPickerButton
                                                        value={formData.image_emoji}
                                                        onChange={(emoji) => setFormData({ ...formData, image_emoji: emoji })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Existing Images Grid */}
                                        {formData.images.length > 0 && (
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                {formData.images.map((img, index) => (
                                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border group bg-muted/10">
                                                        <img src={img} alt={`image-${index}`} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" /> ลบรูปภาพ
                                                            </Button>
                                                        </div>
                                                        {index === 0 && (
                                                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                                                รูปปก
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Upload Area */}
                                        {formData.images.length < 4 ? (
                                            <div className="border rounded-lg p-4 bg-muted/20">
                                                <Label className="mb-2 block">เพิ่มรูปภาพ ({formData.images.length}/4)</Label>
                                                <FileUploader
                                                    key={formData.images.length} // Force reset after upload
                                                    folderName="activity-images"
                                                    onUploadComplete={(url) => addImage(url)}
                                                    label="อัปโหลดรูปภาพใหม่"
                                                    accept="image/*"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-center p-4 border rounded-lg bg-muted text-muted-foreground text-sm">
                                                ครบจำนวน 4 รูปแล้ว
                                            </div>
                                        )}

                                        <p className="text-xs text-muted-foreground mt-2">
                                            * รูปแรกจะถูกใช้เป็นรูปหน้าปกในหน้ารายละเอียด และแสดงในแกลเลอรี
                                        </p>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>สถานที่</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>จำนวนผู้เข้าร่วม (คน)</Label>
                                    <Input
                                        type="number"
                                        value={formData.participants}
                                        onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>รายละเอียดกิจกรรม</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>ลิงก์ภายนอก (ถ้ามี)</Label>
                                    <Button variant="outline" size="sm" onClick={addLink}>
                                        <Plus className="w-3 h-3 mr-1" /> เพิ่มลิงก์
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.external_links.map((link, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder="ชื่อลิงก์"
                                                value={link.title}
                                                onChange={(e) => updateLink(index, "title", e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="URL"
                                                value={link.url}
                                                onChange={(e) => updateLink(index, "url", e.target.value)}
                                                className="flex-[2]"
                                            />
                                            <Button variant="ghost" size="icon" onClick={() => removeLink(index)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
                            <Button onClick={handleSave}>บันทึก</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
