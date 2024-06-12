import { useEffect, useState } from 'react';
import PostCard from '../../../../components/socialComponents/Posts/PostCard/PostCard';
import PostSection from '../../../../components/socialComponents/Posts/PostSection/PostSection';
import './post.scss';
import useCheckSession from '../../../../hooks/session';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../../utils/supabase';

const Post = () => {
  const session = useCheckSession();
  const [userInfo, setUserInfo] = useState<any>(null);
  const { username } = useParams<{ username: string }>();
  const [postList, setPostList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (username) {
          const { data, error } = await supabase
            .from("User")
            .select("*")
            .eq("username", username)
            .single();
          if (error) console.error(error);
          else {
            setUserInfo(data);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [username, session]);

  const fetchPostList = async (reset: boolean = false) => {
    if (userInfo && userInfo.id) {
      try {
        const { data, error } = await supabase.rpc('get_user_posts', {
          this_limit: 10,
          this_offset: reset ? 0 : offset,
          this_user_id: userInfo.id,
        });
        if (error) console.error(error);
        else {
          if (data.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          setPostList(prevPostList => reset ? data : [...prevPostList, ...data]);
        }
      } catch (error) {
        console.error("Error fetching post list:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userInfo?.id) {
      fetchPostList(true); // Initial fetch with reset
    }
  }, [userInfo]);

  const loadMorePosts = () => {
    setOffset(prevOffset => prevOffset + 10);
    fetchPostList();
  };

  if (isLoading && offset === 0) {
    return <div>Loading...</div>;
  }

  if (postList.length === 0) {
    return (
      <div className="postContainer">
        <div className="postsection">
          <PostSection />
        </div>
        <div className="postlist">
          <div className='noPost'>No posts found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="postContainer">
      <div className="postsection">
        <PostSection refreshList={() => fetchPostList(true)} />
      </div>
      <div className="postlist">
        {postList.map((post, index) => (
          <PostCard key={index} postId={post} />
        ))}
      </div>
      {hasMore && !isLoading && (
        <div className="loadMore">
          <button onClick={loadMorePosts}>Load More Posts</button>
        </div>
      )}
      {!hasMore && (
        <div className="noMorePosts">
          There are no more posts
        </div>
      )}
    </div>
  );
};

export default Post;
