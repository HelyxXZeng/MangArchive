import { supabase } from "../utils/supabase";

//GET
export const fetchUserSuggestList = async (
  userID: number,
  // page: number,
  limit: number = 10
) => {
  try {
    const { data, error } = await supabase.rpc("get_most_similar_users", {
      user_id: userID,
      this_limit: limit,
      // this_offset: (page - 1) * limit,
    });

    if (error) {
      console.error("Error fetching user suggestions:", error);
      throw error;
    }
    return data;
  } catch (error) {
    throw new Error("Error fetching user suggestions");
  }
};

export const fetchGroupSuggestList = async (
  userID: number,
  // page: number,
  limit: number = 10
) => {
  try {
    const { data, error } = await supabase.rpc("get_most_similar_users", {
      user_id: userID,
      this_limit: limit,
      // this_offset: (page - 1) * limit,
    });

    if (error) {
      console.error("Error fetching group suggestions:", error);
      throw error;
    }
    return data;
  } catch (error) {
    throw new Error("Error fetching group suggestions");
  }
};

//SET
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
