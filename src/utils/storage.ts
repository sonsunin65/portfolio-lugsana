
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes a file from Supabase Storage using its public URL.
 * It automatically parses the bucket name and file path from the URL.
 * 
 * @param publicUrl The full public URL of the file
 * @returns Object containing { success, error }
 */
export const deleteFileFromStorage = async (publicUrl: string) => {
    if (!publicUrl) return { success: false, error: "No URL provided" };

    try {
        // Expected format: .../storage/v1/object/public/<bucket>/<path/to/file>
        const urlObj = new URL(publicUrl);
        const pathParts = urlObj.pathname.split("/storage/v1/object/public/");

        if (pathParts.length < 2) {
            console.warn("Invalid Supabase Storage URL format:", publicUrl);
            return { success: false, error: "Invalid URL format" };
        }

        const fullPath = pathParts[1]; // <bucket>/<path/to/file>
        const firstSlashIndex = fullPath.indexOf("/");

        if (firstSlashIndex === -1) {
            console.warn("Could not extract bucket from path:", fullPath);
            return { success: false, error: "Invalid path format" };
        }

        const bucket = fullPath.substring(0, firstSlashIndex);
        const filePath = fullPath.substring(firstSlashIndex + 1);

        console.log(`Deleting file - Bucket: ${bucket}, Path: ${filePath}`);

        const { data, error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error("Supabase storage delete error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Error parsing/deleting file:", err);
        return { success: false, error: err };
    }
};

/**
 * Deletes multiple files from Supabase Storage.
 * 
 * @param publicUrls Array of full public URLs
 */
export const deleteFilesFromStorage = async (publicUrls: string[]) => {
    if (!publicUrls || publicUrls.length === 0) return;

    const promises = publicUrls.map(url => deleteFileFromStorage(url));
    await Promise.all(promises);
};
