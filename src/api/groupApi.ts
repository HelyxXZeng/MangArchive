import { supabase } from "../utils/supabase";

export const fetchGroupData = async (groupID: string) => {
    try {
        if (groupID) {
            const { data, error } = await supabase
                .from("Groups")
                .select("*")
                .eq("name_id", groupID)
                .single();

            if (error) console.error(error);
            else {
                return data;
            }
        }
    } catch (error) {
        console.error("Error fetching Group info:", error);
    }
};

export const fetchGroupProfileImages = async (groupID: string) => {
    return await supabase.rpc("get_group_profile_images", { this_group_id: groupID });
};

export const fetchProfileCountData = async (userId: string) => {
    try {
        const [posts, followers, members] = await Promise.all([
            supabase.rpc("get_group_posts", {
                this_limit: 1000,
                this_offset: 0,
                this_group_id: userId,
            }),
            supabase.rpc("get_group_followers", { this_group_id: userId }),
            supabase.rpc("get_group_members", { this_group_id: userId }),
        ]);

        return {
            postCount: posts.data.length,
            followerCount: followers.data.length,
            memberCount: members.data.length,
        };
    } catch (error) {
        console.error("Error fetching profile count data:", error);
        throw error;
    }
};