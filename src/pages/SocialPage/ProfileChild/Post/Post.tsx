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

  useEffect(() => {
    const fetchPostList = async () => {
      if (userInfo && userInfo.id) {
        try {
          const { data, error } = await supabase.rpc('get_user_posts', {
            this_limit: 10, // adjust the limit as needed
            this_offset: 0, // adjust the offset as needed
            this_user_id: userInfo.id,
          });
          if (error) console.error(error);
          else {
            setPostList(data);
            // console.log(data);
          }
        } catch (error) {
          console.error("Error fetching post list:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (userInfo?.id) {
      fetchPostList();
    }
  }, [userInfo]);

  if (isLoading) {
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
        <PostSection />
      </div>
      <div className="postlist">
        {postList.map((post, index) => (
          <PostCard key={index} postId={post} />
        ))}
      </div>
    </div>
  );
}

export default Post;
