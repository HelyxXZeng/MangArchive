import { supabase } from "../utils/supabase";
import { phraseImageUrl } from "../utils/imageLinkPhraser";

export const fetchFeedPostsAPI = async (
  limit: number = 10,
  offset: number = 0
): Promise<bigint[]> => {
  try {
    const { data, error } = await supabase.rpc("get_posts_for_feed", {
      this_limit: limit,
      this_offset: offset,
    });

    if (error) {
      console.error("Error fetching feed posts:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchFeedPostsAPI:", error);
    throw new Error("Failed to fetch feed posts");
  }
};

export const fetchPostInfo = async (postId: any) => {
  const { data: post, error } = await supabase.rpc("get_post_info", {
    this_post_id: postId,
  });
  if (error) {
    console.error("Error fetching post info:", error);
    throw error;
  }
  return post ? post[0] : null;
};

export const fetchPostImages = async (postId: any) => {
  const { data, error } = await supabase.rpc("get_post_image", {
    post_id: postId,
  });
  if (error) {
    console.error("Error fetching post images:", error);
    throw error;
  }
  return data.map((image: any) => phraseImageUrl(image));
};

export const fetchComments = async (
  postId: any,
  offset: number,
  limit: number = 10
) => {
  const { data, error } = await supabase.rpc("get_comments_for_post", {
    this_limit: limit,
    this_offset: offset,
    this_post_id: postId,
  });
  if (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
  return data;
};

// Fetch replies for a comment
export const fetchRepliesForComment = async (
  commentId: number,
  offset: number,
  limit: number = 5
) => {
  const { data, error } = await supabase.rpc("get_replies_for_comment", {
    this_limit: limit,
    this_offset: offset,
    this_comment_id: commentId,
  });
  if (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
  return data;
};

export const fetchCommentsAndReplies = async (postId: any) => {
  const { data: comments, error: commentsError } = await supabase.rpc(
    "get_comments_for_post",
    { this_limit: 99999, this_offset: 0, this_post_id: postId }
  );
  if (commentsError) {
    console.error("Error fetching comments:", commentsError);
    throw commentsError;
  }

  let totalRepliesCount = 0;
  const repliesPromises = comments.map(async (comment: any) => {
    const { data: replies, error: repliesError } = await supabase.rpc(
      "get_replies_for_comment",
      { this_limit: 99999, this_offset: 0, this_comment_id: comment }
    );
    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
    }
    return replies ? replies.length : 0;
  });

  const repliesCounts = await Promise.all(repliesPromises);
  totalRepliesCount = repliesCounts.reduce((acc, count) => acc + count, 0);
  return comments.length + totalRepliesCount;
};

export const toggleLikeStatus = async (
  postId: any,
  userId: any,
  liked: boolean
) => {
  const { error } = await supabase.rpc("add_interact_for_post", {
    this_post_id: postId,
    this_user_id: userId,
    this_type: liked ? "LIKE" : "NONE",
  });
  if (error) {
    console.error("Error updating like status:", error);
    throw error;
  }
};

export const fetchLikeStatus = async (postId: string, userId: string) => {
  const { data, error } = await supabase.rpc("check_like_for_post", {
    this_post_id: postId,
    this_user_id: userId,
  });

  if (error) {
    console.error("Error checking like status:", error);
    return false;
  }
  return data;
};
