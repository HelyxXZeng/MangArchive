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

export const fetchFollowingUsers = async (userId: string | undefined) => {
  try {
    if (userId) {
      const { data, error } = await supabase.rpc("get_follow_user", {
        this_user_id: userId,
      });

      if (error) {
        console.error("Error fetching following users:", error);
        throw error;
      }
      return data;
    }
    throw new Error("User ID is undefined");
  } catch (error) {
    console.error("Error in fetchFollowingUsers:", error);
    throw error;
  }
};

export const fetchFollowingGroups = async (userId: string | undefined) => {
  try {
    if (userId) {
      const { data, error } = await supabase.rpc("get_follow_group", {
        this_user_id: userId,
      });

      if (error) {
        console.error("Error fetching following groups:", error);
        throw error;
      }
      return data;
    }
    throw new Error("User ID is undefined");
  } catch (error) {
    console.error("Error in fetchFollowingGroups:", error);
    throw error;
  }
};

export const fetchUserPosts = async (
  userId: string,
  limit: number = 5,
  offset: number = 0
) => {
  try {
    const { data, error } = await supabase.rpc("get_user_posts", {
      this_limit: limit,
      this_offset: offset,
      this_user_id: userId,
    });

    if (error) {
      console.error("Error fetching user posts:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchUserPosts:", error);
    throw error;
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

export const followGroupById = async (realUserID: number, groupID: number) => {
  try {
    const { error } = await supabase.rpc("follow_user", {
      this_user_id: realUserID,
      follow_user_id: groupID,
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

export const unfollowGroupById = async (realUserID: number, groupID: number) => {
  try {
    const { error } = await supabase.rpc("unfollow_user", {
      this_user_id: realUserID,
      follow_user_id: groupID,
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

export const fetchGroupPosts = async (
  groupId: string,
  limit: number = 5,
  offset: number = 0
) => {
  try {
    const { data, error } = await supabase.rpc("get_group_posts", {
      this_limit: limit,
      this_offset: offset,
      this_group_id: groupId,
    });

    if (error) {
      console.error("Error fetching user posts:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchUserPosts:", error);
    throw error;
  }
};

export const fetchGroupMembers = async (groupID: string | undefined) => {
  try {
    if (groupID) {
      const { data, error } = await supabase.rpc("get_group_members", {
        this_group_id: groupID,
      });

      if (error) {
        console.error("Error fetching following users:", error);
        throw error;
      }
      return data;
    }
    throw new Error("User ID is undefined");
  } catch (error) {
    console.error("Error in fetchFollowingUsers:", error);
    throw error;
  }
};