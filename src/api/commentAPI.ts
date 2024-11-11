import { supabase } from "../utils/supabase";

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

export const addLikeForComment = async (commentID: number, userID: string) => {
  return await supabase.rpc("add_interact_for_comment", {
    this_comment_id: commentID,
    this_user_id: userID,
    this_type: "like",
  });
};
