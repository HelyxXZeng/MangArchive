import { useEffect, useState } from "react";
import PostCard from "../../../../components/socialComponents/Posts/PostCard/PostCard";
import PostSection from "../../../../components/socialComponents/Posts/PostSection/PostSection";
import "./post.scss";
import useCheckSession from "../../../../hooks/session";
import { useParams } from "react-router-dom";
import { fetchUserPosts } from "../../../../api/scocialAPI";
import LoadingWave from "../../../../components/loadingWave/LoadingWave";
import { fetchUserInfoByUsername } from "../../../../api/userAPI";

const Post = () => {
  const session = useCheckSession();
  const [userInfo, setUserInfo] = useState<any>(null);
  const { username } = useParams<{ username: string }>();
  const [postList, setPostList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showPostSection, setShowPostSection] = useState<boolean>(false); // State to control visibility of PostSection
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (username && session?.user) {
          const data = await fetchUserInfoByUsername(username);
          setUserInfo(data[0]);
          // Set showPostSection to true only if email matches session user's email
          setShowPostSection(data?.email === session.user.email);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [username, session]);

  const fetchPostList = async (
    reset: boolean = false,
    currentOffset: number = offset
  ) => {
    if (userInfo && userInfo.id) {
      try {
        const data = await fetchUserPosts(
          userInfo.id,
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

  useEffect(() => {
    if (userInfo?.id) {
      fetchPostList(false); // Initial fetch with reset
    }
  }, [userInfo]);

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
            <PostSection refreshList={() => fetchPostList(true)} />
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
          <PostSection refreshList={() => fetchPostList(true)} />
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
