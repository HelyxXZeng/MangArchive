import { supabase } from "../utils/supabase";

export const uploadImages = async (
  userId: string,
  files: File[],
  folderName: string
): Promise<{ imageName: string; publicUrl: string }[] | null> => {
  try {
    const results: { imageName: string; publicUrl: string }[] = [];

    for (const file of files) {
      const imageName = file.name;
      const path = `${userId}/${folderName}/${imageName}`;
      const { error } = await supabase.storage
        .from("userImage")
        .upload(path, file, { upsert: true });
      if (error) {
        console.error("Image upload error:", error);
        throw error;
      }

      const { data: urlData } = await supabase.storage
        .from("userImage")
        .getPublicUrl(path);

      results.push({ imageName, publicUrl: urlData.publicUrl });
    }

    return results;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};
