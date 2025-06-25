import axios from "axios";
import { supabase } from "../utils/supabase";

export const fetchMangaById = async (mangaId: string) => {
  try {
    const { data } = await axios.get(
      `https://mangapi.alse.workers.dev/api/${mangaId.trim()}?includes[]=cover_art&includes[]=artist&includes[]=author`
    );
    return data.data;
  } catch (error) {
    console.error("Error fetching manga by ID:", error);
    throw error;
  }
};

interface AddCollectionParams {
  collection: any;
  manga_id: string;
  userID: number;
}

interface AddRatingParams {
  rating: number;
  manga_id: string;
  userID: number;
}

export async function addCollection({
  collection,
  manga_id,
  userID,
}: AddCollectionParams) {
  const { error } = await supabase.rpc("add_to_collection", {
    this_collection_name: collection,
    this_slug: manga_id,
    this_user_id: userID,
  });
  if (error) throw new Error(`Error in add collection: ${error.message}`);
}

export async function getCollection(manga_id: string, userID: number) {
  const { data, error } = await supabase.rpc("get_collection_for_manga", {
    this_slug: manga_id,
    this_user_id: userID,
  });
  if (error) throw new Error(`Error in get collection: ${error.message}`);
  return data;
}

export async function addRating({ rating, manga_id, userID }: AddRatingParams) {
  const { error } = await supabase.rpc("add_rating", {
    this_rating: rating,
    this_slug: manga_id,
    this_user_id: userID,
  });
  if (error) throw new Error(`Error in add rating: ${error.message}`);
}

export async function getRating(manga_id: string, userID: number) {
  const { data, error } = await supabase.rpc("get_rating", {
    this_slug: manga_id,
    this_user_id: userID,
  });
  if (error) throw new Error(`Error in get rating: ${error.message}`);
  return data;
}

export async function fetchMangaPosts(manga_id: string) {
  const { data, error } = await supabase.rpc("get_posts_for_truyen", {
    this_limit: 10,
    this_offset: 0,
    this_truyen: manga_id,
  });
  if (error) throw new Error(`Error fetching manga posts: ${error.message}`);
  return data;
}

export async function fetchCommentsForManga(
  manga_id: string,
  offset: number,
  limit: number
) {
  const { data, error } = await supabase.rpc("get_comments_for_truyen", {
    this_truyen: manga_id,
    this_limit: limit,
    this_offset: offset,
  });
  if (error) throw new Error(`Error fetching comments: ${error.message}`);
  return data;
}

// Fetch replies for comments
export async function fetchRepliesForComment(
  commentId: number,
  limit: number,
  offset: number
) {
  try {
    const { data, error } = await supabase.rpc("get_replies_for_comment", {
      this_limit: limit,
      this_offset: offset,
      this_comment_id: commentId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
}
