import { supabase } from "../utils/supabase";

export const fetchUserInfo = async (userID: string) => {
  return await supabase.rpc("get_user_info", { this_user_id: userID });
};

export const fetchUserProfileImages = async (userID: string) => {
  return await supabase.rpc("get_profile_image", { this_user_id: userID });
};

export const fetchUserIdByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase.rpc("get_user_id_by_email", {
      p_email: email,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    throw error;
  }
};

export const fetchProfileCountData = async (userId: string) => {
  try {
    const [posts, groups, friends] = await Promise.all([
      supabase.rpc("get_user_posts", {
        this_limit: 1000,
        this_offset: 0,
        this_user_id: userId,
      }),
      supabase.rpc("get_group_following", { this_user_id: userId }),
      supabase.rpc("get_follow_user", { this_user_id: userId }),
    ]);

    return {
      postCount: posts.data.length,
      groupCount: groups.data.length,
      friendCount: friends.data.length,
    };
  } catch (error) {
    console.error("Error fetching profile count data:", error);
    throw error;
  }
};

export const fetchMostSimilarUsers = async (
  userID: string,
  limit: number = 3
) => {
  try {
    const { data, error } = await supabase.rpc("get_most_similar_users", {
      this_limit: limit,
      user_id: userID,
    });

    if (error) {
      console.error("Error fetching most similar users:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching most similar users:", error);
    throw error;
  }
};
// Set
export const uploadUserImage = async (publicUrl: string, imageName: string) => {
  try {
    const { data: image, error } = await supabase.rpc("upload_image", {
      this_link: publicUrl,
      this_name: imageName,
    });

    if (error) {
      throw error;
    }

    return image;
  } catch (error) {
    console.error("Error in uploadUserImage:", error);
    throw error;
  }
};
