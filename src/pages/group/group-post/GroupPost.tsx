import { useEffect, useState } from "react";
import PostCard from "../../../components/socialComponents/Posts/PostCard/PostCard";
import PostSection from "../../../components/socialComponents/Posts/PostSection/PostSection";
import "../../SocialPage/ProfileChild/Post/post.scss";
import { useParams } from "react-router-dom";
import {
    fetchGroupData,
} from "../../../api/groupApi";
import { fetchGroupPosts } from "../../../api/scocialAPI";
import LoadingWave from "../../../components/loadingWave/LoadingWave";
import useCheckSession from "../../../hooks/session";
import { fetchUserIdByEmail } from "../../../api/userAPI";
import { supabase } from "../../../utils/supabase";

const Post = () => {
    const [GroupInfo, setGroupInfo] = useState<any>(null);
    const { groupid } = useParams<{ groupid: string }>();
    const [postList, setPostList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [showPostSection, setShowPostSection] = useState<boolean>(false); // State to control visibility of PostSection
    const session = useCheckSession();

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                if (groupid) {
                    var data1 = await fetchGroupData(groupid);
                    setGroupInfo(data1);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchGroupInfo();
    }, [groupid]);

    const fetchPostList = async (
        reset: boolean = false,
        currentOffset: number = offset
    ) => {
        if (GroupInfo && GroupInfo.id) {
            try {
                const data = await fetchGroupPosts(
                    GroupInfo.id,
                    5,
                    reset ? 0 : currentOffset
                );

                if (data.length < 5) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

                setPostList((prevPostList) =>
                    reset ? data : [...prevPostList, ...data]
                );
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const checkIfJoined = async () => {
        if (session && session.user) {
            try {
                var thisUserId = await fetchUserIdByEmail(session.user.email);
                const { data, error } = await supabase
                    .from("GroupMembers")
                    .select("*")
                    .eq("user_id", thisUserId)
                    .eq("group_id", GroupInfo.id)
                    .single();

                if (error && error.code !== "PGRST116") {
                    throw error;
                    // console.error("Error checking follow status:", error);
                } else {
                    setShowPostSection(!!data);
                }
            } catch (error) {
                throw error;
            }
        }
        else setShowPostSection(false);
    };

    useEffect(() => {
        if (groupid && GroupInfo) {
            checkIfJoined();
        }
    }, [groupid, GroupInfo]);

    useEffect(() => {
        if (GroupInfo?.id) {
            fetchPostList(true); // Initial fetch with reset
        }
    }, [GroupInfo]);

    const loadMorePosts = () => {
        const newOffset = offset + 5; // Tính offset mới
        setOffset(newOffset); // Cập nhật state để re-render
        fetchPostList(false, newOffset); // Gọi fetchPostList với offset mới
    };

    if (isLoading && offset === 0) {
        return (
            <div className="loading">
                <LoadingWave />
            </div>
        );
    }

    if (postList.length === 0) {
        return (
            <div className="postContainer">
                <div className="postsection">
                    {showPostSection && (
                        <PostSection
                            refreshList={() => fetchPostList(true)}
                            group_id={GroupInfo.id} />
                    )}
                </div>
                <div className="postlist">
                    <div className="noPost">No posts found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="postContainer">
            <div className="postsection">
                {showPostSection && (
                    <PostSection
                        refreshList={() => fetchPostList(true)}
                        group_id={GroupInfo.name_id} />
                )}
            </div>
            <div className="postlist">
                {postList.map((post, index) => (
                    <PostCard key={index} postId={post} />
                ))}
            </div>
            {hasMore && !isLoading && (
                <div className="loadMore" onClick={loadMorePosts}>
                    <strong>Load More Posts</strong>
                </div>
            )}
            {!hasMore && <div className="noMorePosts">There are no more posts</div>}
        </div>
    );
};

export default Post;
