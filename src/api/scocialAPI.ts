import { supabase } from "../utils/supabase";

export const followUserById = async (realUserID: number, userID: number) => {
  try {
    const { error } = await supabase.rpc("follow_user", {
      this_user_id: realUserID,
      follow_user_id: userID,
    });
    if (error) {
      console.error("Error following user:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in followUserById:", error);
    throw error;
  }
};

export const unfollowUserById = async (realUserID: number, userID: number) => {
  try {
    const { error } = await supabase.rpc("unfollow_user", {
      this_user_id: realUserID,
      follow_user_id: userID,
    });
    if (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in unfollowUserById:", error);
    throw error;
  }
};
