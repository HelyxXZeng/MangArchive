import { useEffect, useState } from 'react';
import PostCard from '../../../components/socialComponents/Posts/PostCard/PostCard';
import PostSection from '../../../components/socialComponents/Posts/PostSection/PostSection';
import { supabase } from '../../../utils/supabase';
import './feed.scss';

const Feed = () => {
    const [postIds, setPostIds] = useState<bigint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchFeedPosts = async () => {
        try {
            const { data, error } = await supabase.rpc('get_posts_for_feed', { this_limit: 10, this_offset: 0 });
            if (error) {
                console.error("Error fetching feed posts:", error);
            } else {
                setPostIds(data);
            }
        } catch (error) {
            console.error("Error fetching feed posts:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchFeedPosts();
    }, []);

    if (loading) {
        return <div>Loading feed...</div>;
    }

    return (
        <div className="feedContainer">
            <div className="mainFeed">
                <div className="header">
                    <h2>Feed</h2>
                </div>
                <div className="newFeedSection">
                    <PostSection refreshList={fetchFeedPosts} />
                </div>
                <div className="feedList">
                    {postIds.map((postId, index) => (
                        <PostCard key={index} postId={postId}  />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Feed;
