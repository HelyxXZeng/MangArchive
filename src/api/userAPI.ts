import { supabase } from "../utils/supabase";

export const fetchUserInfo = async (userID: string) => {
    return await supabase.rpc("get_user_info", { this_user_id: userID });
  };

  export const fetchUserProfileImages = async (userID: string) => {
    return await supabase.rpc("get_profile_image", { this_user_id: userID });
  };