import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
    Plus,
    Pencil,
    Trash2,
    BookOpen,
    Users,
    TrendingUp,
    FileText,
    Image,
    Video,
    Link as LinkIcon,
    Upload,
    X,
} from "lucide-react";
import { SwalFire } from "@/utils/sweetalert";
import { FileUploader } from "@/components/admin/FileUploader";

interface PACategory {
    id: string;
    category_number: number;
    title: string;
    icon: string;
    color: string;
}

interface PAIndicator {
    id: string;
    category_id: string;
    indicator_number: string;
    name: string;
    description: string | null;
}

interface PAWork {
    id: string;
    indicator_id: string;
    work_type: string;
    title: string;
    url: string | null;
    sort_order: number;
}

interface PAImage {
    id: string;
    indicator_id: string;
    image_url: string;
    caption: string | null;
    sort_order: number;
}

const iconMap: Record<string, any> = {
    BookOpen,
    Users,
    TrendingUp,
};

export function AdminPA() {

    const [categories, setCategories] = useState<PACategory[]>([]);
    const [indicators, setIndicators] = useState<PAIndicator[]>([]);
    const [works, setWorks] = useState<PAWork[]>([]);
    const [images, setImages] = useState<PAImage[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);

    // Dialog states
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [indicatorDialogOpen, setIndicatorDialogOpen] = useState(false);
    const [workDialogOpen, setWorkDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);

    // Edit states
    const [editingCategory, setEditingCategory] = useState<PACategory | null>(null);
    const [editingIndicator, setEditingIndicator] = useState<PAIndicator | null>(null);
    const [editingWork, setEditingWork] = useState<PAWork | null>(null);

    // Form states
    const [categoryForm, setCategoryForm] = useState({ category_number: 1, title: "", icon: "BookOpen", color: "from-primary to-coral" });
    const [indicatorForm, setIndicatorForm] = useState({ indicator_number: "", name: "", description: "" });
    const [workForm, setWorkForm] = useState<{ work_type: string, title: string, url: string | null }>({ work_type: "document", title: "", url: "" });
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [catRes, indRes, workRes, imgRes] = await Promise.all([
            supabase.from("pa_categories").select("*").order("category_number"),
            supabase.from("pa_indicators").select("*").order("indicator_number"),
            supabase.from("pa_works").select("*").order("sort_order"),
            supabase.from("pa_indicator_images").select("*").order("sort_order"),
        ]);

        if (catRes.data) setCategories(catRes.data);
        if (indRes.data) setIndicators(indRes.data);
        if (workRes.data) setWorks(workRes.data);
        if (imgRes.data) setImages(imgRes.data);
    };

    // Category CRUD
    const saveCategory = async () => {
        let error;
        if (editingCategory) {
            const { error: updateError } = await (supabase
                .from("pa_categories") as any)
                .update(categoryForm)
                .eq("id", editingCategory.id);
            error = updateError;
        } else {
            const { error: insertError } = await (supabase.from("pa_categories") as any).insert(categoryForm);
            error = insertError;
        }

        if (error) {
            SwalFire.error("เกิดข้อผิดพลาด", error.message);
        } else {
            SwalFire.success(editingCategory ? "บันทึกสำเร็จ" : "เพิ่มสำเร็จ");
            setCategoryDialogOpen(false);
            setEditingCategory(null);
            setCategoryForm({ category_number: 1, title: "", icon: "BookOpen", color: "from-primary to-coral" });
            fetchData();
        }
    };

    const deleteCategory = async (id: string) => {
        if (!(await SwalFire.confirm("ต้องการลบด้านนี้หรือไม่?"))) return;

        // Cascade Delete Helper: Must delete files from all works and images under this category
        const { deleteFilesFromStorage } = await import("@/utils/storage");

        // 1. Find all indicators in this category
        const indicatorsInCat = indicators.filter(i => i.category_id === id);
        const indicatorIds = indicatorsInCat.map(i => i.id);

        if (indicatorIds.length > 0) {
            // 2. Find all works in these indicators
            const worksToDelete = works.filter(w => indicatorIds.includes(w.indicator_id));
            // 3. Find all images in these indicators
            const imagesToDelete = images.filter(img => indicatorIds.includes(img.indicator_id));

            // Collect URLs
            const fileUrls: string[] = [];
            worksToDelete.forEach(w => { if (w.url && w.work_type !== 'link') fileUrls.push(w.url); });
            imagesToDelete.forEach(img => { if (img.image_url) fileUrls.push(img.image_url); });

            await deleteFilesFromStorage(fileUrls);
        }

        const { error } = await supabase.from("pa_categories").delete().eq("id", id);
        if (error) {
            SwalFire.error("เกิดข้อผิดพลาด", error.message);
        } else {
            SwalFire.success("ลบสำเร็จ");
            if (selectedCategory === id) setSelectedCategory(null);
            fetchData();
        }
    };

    // Indicator CRUD
    const saveIndicator = async () => {
        if (!selectedCategory) return;

        const data = { ...indicatorForm, category_id: selectedCategory };
        let error;

        if (editingIndicator) {
            const { error: updateError } = await (supabase
                .from("pa_indicators") as any)
                .update(data)
                .eq("id", editingIndicator.id);
            error = updateError;
        } else {
            const { error: insertError } = await (supabase.from("pa_indicators") as any).insert(data);
            error = insertError;
        }

        if (error) {
            SwalFire.error("เกิดข้อผิดพลาด", error.message);
        } else {
            SwalFire.success(editingIndicator ? "บันทึกสำเร็จ" : "เพิ่มสำเร็จ");
            setIndicatorDialogOpen(false);
            setEditingIndicator(null);
            setIndicatorForm({ indicator_number: "", name: "", description: "" });
            fetchData();
        }
    };

    const deleteIndicator = async (id: string) => {
        if (!(await SwalFire.confirm("ต้องการลบตัวชี้วัดนี้หรือไม่?"))) return;

        const { deleteFilesFromStorage } = await import("@/utils/storage");

        // Find works and images to delete
        const worksToDelete = works.filter(w => w.indicator_id === id);
        const imagesToDelete = images.filter(img => img.indicator_id === id);

        const fileUrls: string[] = [];
        worksToDelete.forEach(w => { if (w.url && w.work_type !== 'link') fileUrls.push(w.url); });
        imagesToDelete.forEach(img => { if (img.image_url) fileUrls.push(img.image_url); });

        await deleteFilesFromStorage(fileUrls);

        const { error } = await supabase.from("pa_indicators").delete().eq("id", id);
        if (error) {
            SwalFire.error("เกิดข้อผิดพลาด", error.message);
        } else {
            SwalFire.success("ลบสำเร็จ");
            if (selectedIndicator === id) setSelectedIndicator(null);
            fetchData();
        }
    };

    // Work CRUD
    const saveWork = async () => {
        if (!selectedIndicator) return;

        const baseData = {
            ...workForm,
            indicator_id: selectedIndicator,
        };

        let error;

        if (editingWork) {
            const { error: updateError } = await (supabase
                .from("pa_works") as any)
                .update(baseData)
                .eq("id", editingWork.id);
            error = updateError;
        } else {
            const data = {
                ...baseData,
                sort_order: works.filter(w => w.indicator_id === selectedIndicator).length
            };
            const { error: insertError } = await (supabase.from("pa_works") as any).insert(data);
            error = insertError;
        }

        if (error) {
            SwalFire.error("เกิดข้อผิดพลาด", error.message);
        } else {
            SwalFire.success(editingWork ? "บันทึกสำเร็จ" : "เพิ่มสำเร็จ");
            setWorkDialogOpen(false);
            setEditingWork(null);
            setWorkForm({ work_type: "document", title: "", url: "" });
            fetchData();
        }
    };

    const deleteWork = async (id: string) => {
        if (!(await SwalFire.confirm("ต้องการลบผลงานนี้หรือไม่?"))) return;

        const workToDelete = works.find(w => w.id === id);
        if (workToDelete && workToDelete.url && workToDelete.work_type !== 'link') {
            const { deleteFileFromStorage } = await import("@/utils/storage");
            await deleteFileFromStorage(workToDelete.url);
        }

        const { error } = await supabase.from("pa_works").delete().eq("id", id);
        if (error) {
            SwalFire.error("เกิดข้อผิดพลาด", error.message);
        } else {
            SwalFire.success("ลบสำเร็จ");
            fetchData();
        }
    };

    // Image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedIndicator || !e.target.files || e.target.files.length === 0) return;

        setUploadingImage(true);
        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${selectedIndicator}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("pa-images")
            .upload(fileName, file);

        if (uploadError) {
            SwalFire.error("อัปโหลดไม่สำเร็จ", uploadError.message);
            setUploadingImage(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from("pa-images").getPublicUrl(fileName);

        const { error: insertError } = await (supabase.from("pa_indicator_images") as any).insert({
            indicator_id: selectedIndicator,
            image_url: publicUrl,
            sort_order: images.filter(i => i.indicator_id === selectedIndicator).length,
        });

        if (insertError) {
            SwalFire.error("บันทึกไม่สำเร็จ", insertError.message);
        } else {
            SwalFire.success("อัปโหลดสำเร็จ");
            fetchData();
        }
        setUploadingImage(false);
        setImageDialogOpen(false);
    };

    const deleteImage = async (id: string, imageUrl: string) => {
        if (!(await SwalFire.confirm("ต้องการลบรูปภาพนี้หรือไม่?"))) return;

        const { deleteFileFromStorage } = await import("@/utils/storage");
        await deleteFileFromStorage(imageUrl);

        const { error } = await supabase.from("pa_indicator_images").delete().eq("id", id);
        if (error) {
            SwalFire.error("เกิดข้อผิดพลาด", error.message);
        } else {
            SwalFire.success("ลบสำเร็จ");
            fetchData();
        }
    };

    const filteredIndicators = indicators.filter(i => i.category_id === selectedCategory);
    const filteredWorks = works.filter(w => w.indicator_id === selectedIndicator);
    const filteredImages = images.filter(i => i.indicator_id === selectedIndicator);

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Column 1: Categories */}
            <Card className="border-2 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">ด้านการประเมิน</CardTitle>
                    <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-1" onClick={() => {
                                setEditingCategory(null);
                                setCategoryForm({ category_number: categories.length + 1, title: "", icon: "BookOpen", color: "from-primary to-coral" });
                            }}>
                                <Plus className="w-4 h-4" />
                                เพิ่ม
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingCategory ? "แก้ไขด้าน" : "เพิ่มด้านใหม่"}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>ลำดับด้าน</Label>
                                    <Input
                                        type="number"
                                        value={categoryForm.category_number}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, category_number: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>ชื่อด้าน</Label>
                                    <Textarea
                                        value={categoryForm.title}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                                        placeholder="ด้านที่ 1: ด้านการจัดการเรียนรู้"
                                    />
                                </div>
                                <div>
                                    <Label>ไอคอน</Label>
                                    <Select value={categoryForm.icon} onValueChange={(v) => setCategoryForm({ ...categoryForm, icon: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BookOpen">📚 BookOpen</SelectItem>
                                            <SelectItem value="Users">👥 Users</SelectItem>
                                            <SelectItem value="TrendingUp">📈 TrendingUp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>สี Gradient</Label>
                                    <Select value={categoryForm.color} onValueChange={(v) => setCategoryForm({ ...categoryForm, color: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="from-primary to-coral">ชมพู-ส้ม</SelectItem>
                                            <SelectItem value="from-secondary to-mint">เขียว-มิ้นท์</SelectItem>
                                            <SelectItem value="from-accent to-peach">ม่วง-พีช</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={saveCategory}>บันทึก</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-2">
                    {categories.map((cat) => {
                        const IconComp = iconMap[cat.icon] || BookOpen;
                        return (
                            <div
                                key={cat.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedCategory === cat.id
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setSelectedIndicator(null);
                                }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                                            <IconComp className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm text-foreground leading-relaxed">{cat.title}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCategory(cat);
                                                setCategoryForm({
                                                    category_number: cat.category_number,
                                                    title: cat.title,
                                                    icon: cat.icon,
                                                    color: cat.color,
                                                });
                                                setCategoryDialogOpen(true);
                                            }}
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteCategory(cat.id);
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {categories.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีข้อมูล</p>
                    )}
                </CardContent>
            </Card>

            {/* Column 2: Indicators */}
            <Card className="border-2 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">ตัวชี้วัด</CardTitle>
                    {selectedCategory && (
                        <Dialog open={indicatorDialogOpen} onOpenChange={setIndicatorDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-1" onClick={() => {
                                    setEditingIndicator(null);
                                    setIndicatorForm({ indicator_number: "", name: "", description: "" });
                                }}>
                                    <Plus className="w-4 h-4" />
                                    เพิ่ม
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingIndicator ? "แก้ไขตัวชี้วัด" : "เพิ่มตัวชี้วัดใหม่"}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label>เลขตัวชี้วัด</Label>
                                        <Input
                                            value={indicatorForm.indicator_number}
                                            onChange={(e) => setIndicatorForm({ ...indicatorForm, indicator_number: e.target.value })}
                                            placeholder="1.1"
                                        />
                                    </div>
                                    <div>
                                        <Label>ชื่อตัวชี้วัด</Label>
                                        <Input
                                            value={indicatorForm.name}
                                            onChange={(e) => setIndicatorForm({ ...indicatorForm, name: e.target.value })}
                                            placeholder="การสร้างและพัฒนาหลักสูตร"
                                        />
                                    </div>
                                    <div>
                                        <Label>คำอธิบาย</Label>
                                        <Textarea
                                            value={indicatorForm.description}
                                            onChange={(e) => setIndicatorForm({ ...indicatorForm, description: e.target.value })}
                                            placeholder="รายละเอียดตัวชี้วัด..."
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={saveIndicator}>บันทึก</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardHeader>
                <CardContent className="space-y-2">
                    {!selectedCategory ? (
                        <p className="text-sm text-muted-foreground text-center py-4">เลือกด้านก่อน</p>
                    ) : filteredIndicators.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีตัวชี้วัด</p>
                    ) : (
                        filteredIndicators.map((ind) => (
                            <div
                                key={ind.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedIndicator === ind.id
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                onClick={() => setSelectedIndicator(ind.id)}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <Badge variant="outline" className="mb-1">{ind.indicator_number}</Badge>
                                        <p className="text-sm text-foreground">{ind.name}</p>
                                        {ind.description && (
                                            <p className="text-xs text-muted-foreground mt-1">{ind.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingIndicator(ind);
                                                setIndicatorForm({
                                                    indicator_number: ind.indicator_number,
                                                    name: ind.name,
                                                    description: ind.description || "",
                                                });
                                                setIndicatorDialogOpen(true);
                                            }}
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteIndicator(ind.id);
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Column 3: Works & Images */}
            <Card className="border-2 border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg">ผลงานและรูปภาพ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!selectedIndicator ? (
                        <p className="text-sm text-muted-foreground text-center py-4">เลือกตัวชี้วัดก่อน</p>
                    ) : (
                        <>
                            {/* Works Section */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-foreground">ผลงาน/หลักฐาน</h4>
                                    <Dialog open={workDialogOpen} onOpenChange={setWorkDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                                                setEditingWork(null);
                                                setWorkForm({ work_type: "document", title: "", url: "" });
                                            }}>
                                                <Plus className="w-4 h-4" />
                                                เพิ่ม
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>{editingWork ? "แก้ไขผลงาน" : "เพิ่มผลงานใหม่"}</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label>ประเภท</Label>
                                                    <Select value={workForm.work_type} onValueChange={(v) => setWorkForm({ ...workForm, work_type: v })}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="document">📄 เอกสาร</SelectItem>
                                                            <SelectItem value="image">🖼️ รูปภาพ</SelectItem>
                                                            <SelectItem value="video">🎬 วิดีโอ</SelectItem>
                                                            <SelectItem value="link">🔗 ลิงก์</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>ชื่อผลงาน</Label>
                                                    <Input
                                                        value={workForm.title}
                                                        onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                                                        placeholder="แผนการจัดการเรียนรู้..."
                                                    />
                                                </div>
                                                <div>
                                                    <Label>ไฟล์/ลิงก์</Label>
                                                    {workForm.work_type === 'link' ? (
                                                        <Input
                                                            value={workForm.url || ""}
                                                            onChange={(e) => setWorkForm({ ...workForm, url: e.target.value })}
                                                            placeholder="https://..."
                                                        />
                                                    ) : (
                                                        <FileUploader
                                                            key={workForm.url || 'empty'}
                                                            defaultUrl={workForm.url}
                                                            onUploadComplete={(url) => setWorkForm({ ...workForm, url })}
                                                            folderName="pa-works"
                                                            accept={workForm.work_type === 'image' ? "image/*" : workForm.work_type === 'video' ? "video/*" : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"}
                                                        />
                                                    )}
                                                </div>


                                            </div>
                                            <DialogFooter>
                                                <Button onClick={saveWork}>บันทึก</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="space-y-2">
                                    {filteredWorks.map((work) => {
                                        const typeIcons: Record<string, any> = { document: FileText, image: Image, video: Video, link: LinkIcon };
                                        const IconComp = typeIcons[work.work_type] || FileText;
                                        return (
                                            <div key={work.id} className="group flex flex-col gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                                <div className="flex items-center gap-2">
                                                    <IconComp className="w-4 h-4 text-primary" />
                                                    <span className="flex-1 text-sm font-medium truncate">{work.title}</span>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-6 w-6"
                                                            onClick={() => {
                                                                setEditingWork(work);
                                                                setWorkForm({
                                                                    work_type: work.work_type,
                                                                    title: work.title,
                                                                    url: work.url || ""
                                                                });
                                                                setWorkDialogOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-6 w-6 text-destructive"
                                                            onClick={() => deleteWork(work.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}
                                    {filteredWorks.length === 0 && (
                                        <p className="text-xs text-muted-foreground text-center py-2">ยังไม่มีผลงาน</p>
                                    )}
                                </div>
                            </div>

                            {/* Images Section */}
                            <div>
                                <h4 className="font-medium text-foreground mb-3">รูปภาพประกอบ ({filteredImages.length}/4)</h4>

                                {filteredImages.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {filteredImages.map((img) => (
                                            <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-muted/10">
                                                <img
                                                    src={img.image_url}
                                                    alt={img.caption || "รูปภาพ"}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => deleteImage(img.id, img.image_url)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> ลบ
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {filteredImages.length < 4 ? (
                                    <div className="border rounded-lg p-4 bg-muted/20">
                                        <Label className="mb-2 block">เพิ่มรูปภาพ ({filteredImages.length}/4)</Label>
                                        <FileUploader
                                            key={filteredImages.length}
                                            onUploadComplete={async (url) => {
                                                if (!selectedIndicator) return;
                                                const { error } = await (supabase.from("pa_indicator_images") as any).insert({
                                                    indicator_id: selectedIndicator,
                                                    image_url: url,
                                                    sort_order: images.filter(i => i.indicator_id === selectedIndicator).length,
                                                });
                                                if (error) {
                                                    SwalFire.error("บันทึกไม่สำเร็จ", error.message);
                                                } else {
                                                    SwalFire.success("อัปโหลดสำเร็จ");
                                                    fetchData();
                                                }
                                            }}
                                            folderName="pa-images"
                                            accept="image/*"
                                            label="อัปโหลดรูปภาพ"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center p-2 text-sm text-muted-foreground bg-muted rounded-md">
                                        ครบจำนวน 4 รูปแล้ว
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div >
    );
}
