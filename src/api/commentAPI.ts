import { supabase } from "../utils/supabase";

//GET
export const fetchCommentData = async (commentID: number) => {
  return await supabase.rpc("get_comment_info", { this_comment_id: commentID });
};

export const fetchCommentImages = async (commentID: number) => {
  return await supabase.rpc("get_comment_image", { comment_id: commentID });
};

export const checkLikeStatus = async (commentID: number, userID: string) => {
  return await supabase.rpc("check_like_for_comment", {
    this_comment_id: commentID,
    this_user_id: userID,
  });
};

//PUSH
export const addLikeForComment = async (commentID: number, userID: string) => {
  return await supabase.rpc("add_interact_for_comment", {
    this_comment_id: commentID,
    this_user_id: userID,
    this_type: "like",
  });
};

export const uploadComment = async (
  postId: string | null,
  mangaID: string | null,
  userId: string,
  content: string
) => {
  if (postId) {
    const { data, error } = await supabase.rpc("upload_comment_for_post", {
      this_post_id: postId,
      this_user_id: userId,
      this_content: content,
    });
    if (error) {
      console.error("RPC upload_comment_for_post error:", error);
      throw error;
    }
    return data;
  } else if (mangaID) {
    const { data, error } = await supabase.rpc("upload_comment_for_truyen", {
      this_truyen: mangaID,
      this_user_id: userId,
      this_content: content,
    });
    if (error) {
      console.error("RPC upload_comment_for_truyen error:", error);
      throw error;
    }
    return data;
  }
};

export const uploadReply = async (
  commentId: number,
  userId: number,
  content: string
) => {
  const { data, error } = await supabase.rpc("upload_reply", {
    this_comment_id: commentId,
    this_user_id: userId,
    this_content: content,
  });
  if (error) {
    console.error("RPC upload_reply error:", error);
    throw error;
  }
  return data;
};

export const uploadCommentImage = async (
  imageName: string,
  commentId: string,
  imageUrl: string
) => {
  const { data: imageId, error: rpcImageError } = await supabase.rpc(
    "upload_comment_image",
    {
      this_name: imageName,
      this_comment_id: commentId,
      this_link: imageUrl,
    }
  );

  if (rpcImageError) {
    console.error("RPC upload_comment_image error:", rpcImageError);
    throw rpcImageError;
  }

  return imageId;
};
