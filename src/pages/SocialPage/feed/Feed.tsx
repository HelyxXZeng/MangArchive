import { useEffect, useState } from "react";
import PostCard from "../../../components/socialComponents/Posts/PostCard/PostCard";
import PostSection from "../../../components/socialComponents/Posts/PostSection/PostSection";
import "./feed.scss";
import { fetchFeedPostsAPI } from "../../../api/postAPI";
import { useTranslation } from "react-i18next";

const Feed = () => {
  const [postIds, setPostIds] = useState<bigint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation("", { keyPrefix: "feed" });
  const fetchFeedPosts = async () => {
    try {
      const data = await fetchFeedPostsAPI(10, 0); // Fetch 10 posts with offset 0
      setPostIds(data);
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
    return <div>{t("loading")}...</div>;
  }

  return (
    <div className="feedContainer">
      <div className="mainFeed">
        <div className="header">
          <h2>{t("Feed")}</h2>
        </div>
        <div className="newFeedSection">
          <PostSection refreshList={fetchFeedPosts} />
        </div>
        <div className="feedList">
          {postIds.map((postId, index) => (
            <PostCard key={index} postId={postId} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
