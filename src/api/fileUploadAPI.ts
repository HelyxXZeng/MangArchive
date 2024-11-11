import { supabase } from "../utils/supabase";

export const uploadImage = async (
  userId: string,
  file: File
): Promise<{ imageName: string; publicUrl: string } | null> => {
  try {
    const imageName = file.name;
    const { error } = await supabase.storage
      .from("userImage")
      .upload(`${userId}/${imageName}`, file, { upsert: true });
    if (error) {
      console.error("Image upload error:", error);
      throw error;
    }

    const { data: urlData } = await supabase.storage
      .from("userImage")
      .getPublicUrl(`${userId}/${imageName}`);

    return { imageName, publicUrl: urlData.publicUrl };
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};
