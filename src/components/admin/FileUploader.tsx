import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SwalFire } from "@/utils/sweetalert";
import { Upload, X, FileIcon, Loader2, Eye, Trash, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
    bucketName?: string;
    folderName?: string;
    onUploadComplete: (url: string, type: string) => void;
    defaultUrl?: string | null;
    label?: string;
    accept?: string;
}

export function FileUploader({
    bucketName = "pa-images",
    folderName = "uploads",
    onUploadComplete,
    defaultUrl,
    label = "อัปโหลดไฟล์/รูปภาพ",
    accept = "image/*,.pdf"
}: FileUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentUrl, setCurrentUrl] = useState<string | null>(defaultUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync internal state with prop
    useEffect(() => {
        setCurrentUrl(defaultUrl || null);
    }, [defaultUrl]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        setProgress(10); // Start progress

        let file = e.target.files[0];
        const originalFileExt = file.name.split(".").pop()?.toLowerCase();
        let fileName = `${folderName}/${Date.now()}.${originalFileExt}`;
        let fileType = file.type.startsWith("image/") ? "image" : "file";

        // Optional: Convert images to WebP
        if (fileType === "image" && originalFileExt !== 'svg') {
            try {
                setProgress(30);
                const compressedFile = await convertToWebP(file);
                file = compressedFile;
                fileName = `${folderName}/${Date.now()}.webp`;
                fileType = "image";
            } catch (error) {
                console.error("WebP conversion failed", error);
            }
        }

        setProgress(50); // Processing done

        try {
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file, {
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            setProgress(90);

            const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);

            onUploadComplete(publicUrl, fileType);
            setCurrentUrl(publicUrl);
            setProgress(100);

            SwalFire.success("อัปโหลดเสร็จสิ้น");

        } catch (error: any) {
            console.error("Upload error:", error);
            SwalFire.error("อัปโหลดล้มเหลว", error.message);
            setCurrentUrl(null); // Reset on failure if needed, or keep old one? keeping old one is safer but let's clear for now if it was a replace
        } finally {
            setUploading(false);
            setProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset input
            }
        }
    };

    const handleRemove = () => {
        setCurrentUrl(null);
        onUploadComplete("", "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const convertToWebP = (file: File): Promise<File> => {
        // ... reusing existing logic ...
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                // resize logic
                let width = img.width;
                let height = img.height;
                const MAX_SIZE = 1920;
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp", lastModified: Date.now() }));
                        } else reject(new Error("Blob failed"));
                    }, "image/webp", 0.8);
                } else reject(new Error("Context failed"));
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };

    const isImage = currentUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i) || accept.includes("image");
    const fileName = currentUrl ? decodeURIComponent(currentUrl.split('/').pop() || "file") : "";

    return (
        <div className="space-y-3">
            <Label className="text-base font-semibold">{label}</Label>

            <div className="border-2 border-dashed rounded-lg p-6 hover:bg-muted/30 transition-colors text-center">
                {uploading ? (
                    <div className="py-4 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground">กำลังอัปโหลด... {progress}%</p>
                        <Progress value={progress} className="w-full max-w-xs mx-auto h-2" />
                    </div>
                ) : currentUrl ? (
                    <div className="flex flex-col items-center gap-4">
                        {isImage ? (
                            <div className="relative group rounded-lg overflow-hidden border shadow-sm max-w-[200px]">
                                <img src={currentUrl} alt="Preview" className="w-full h-auto object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" onClick={() => window.open(currentUrl, '_blank')}>
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border w-full max-w-sm">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <FileIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-sm font-medium truncate">{fileName}</p>
                                    <a href={currentUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">คลิกเพื่อดูไฟล์</a>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={handleRemove}
                            >
                                <Trash className="w-4 h-4 mr-2" /> ลบไฟล์ / เปลี่ยนใหม่
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 space-y-3" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 cursor-pointer hover:bg-primary/20 transition-colors">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">คลิกเพื่ออัปโหลดไฟล์</p>
                            <p className="text-xs text-muted-foreground">รองรับ: {accept?.replace(/,/g, ', ')}</p>
                        </div>
                        <Button type="button" variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                            เลือกไฟล์
                        </Button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                />
            </div>
        </div>
    );
}
