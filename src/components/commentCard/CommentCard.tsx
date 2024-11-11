import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import {
  fetchCommentData,
  fetchCommentImages,
  checkLikeStatus,
  addLikeForComment,
} from "../../api/commentAPI";
import "./commentCard.scss";
import { fetchUserInfo, fetchUserProfileImages } from "../../api/userAPI";
import { phraseImageUrl } from "../../utils/imageLinkPhraser";

interface CommentCardProps {
  className?: string;
  commentBoxRef?: any;
  onReplyClick?: (userId: any, username: any) => void;
  commentID: number;
  replyCount?: number;
}

const CommentCard: React.FC<CommentCardProps> = ({
  className,
  onReplyClick,
  commentID,
  replyCount,
}) => {
  const [commentData, setCommentData] = useState<any>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [profileImages, setProfileImages] = useState<{
    avatar: string | null;
  }>({ avatar: null });

  const [userInfo, setUserInfo] = useState<any>(null);
  const [commentImages, setCommentImages] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (commentID) {
          const { data: comment, error: commentError } = await fetchCommentData(
            commentID
          );
          if (commentError)
            return console.error("Error fetching comment data:", commentError);
          setCommentData(comment[0]);

          const { data: images, error: imagesError } = await fetchCommentImages(
            commentID
          );
          if (imagesError)
            return console.error("Error fetching comment images:", imagesError);
          const imageUrl = phraseImageUrl(images);
          setCommentImages(imageUrl);

          const { data: user, error: userError } = await fetchUserInfo(
            comment[0].this_user
          );
          if (userError)
            return console.error("Error fetching user info:", userError);
          setUserInfo(user[0]);

          const { data: profile, error: profileError } =
            await fetchUserProfileImages(comment[0].this_user);
          if (profileError)
            return console.error(
              "Error fetching profile images:",
              profileError
            );
          // console.log("final", phraseImageUrl(profile[0]?.avatar_link));
          setProfileImages({
            avatar: phraseImageUrl(profile[0]?.avatar_link),
          });

          const { data: liked, error: likeError } = await checkLikeStatus(
            commentID,
            comment[0].this_user
          );
          if (likeError)
            return console.error("Error checking like status:", likeError);
          setIsLiked(liked);
          setLikeCount(comment[0].likecount);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [commentID]);

  const handleProfileNavigate = () => {
    navigate(`/profile/${userInfo.username}`);
  };

  const handleReply = () => {
    if (onReplyClick && commentData && userInfo) {
      onReplyClick(commentData.this_user, userInfo.username);
    }
  };

  const handleLike = async () => {
    if (commentData?.this_user) {
      try {
        await addLikeForComment(commentID, commentData.this_user);
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      } catch (error) {
        console.error("Error liking comment:", error);
      }
    }
  };

  if (!commentData || !userInfo) {
    return <div>Loading...</div>;
  }

  const level = Math.floor((userInfo?.level || 0) / 100);

  return (
    <div className={`commentCardContainer ${className}`}>
      <div className="avatar">
        <NavLink to={`/profile/${commentData.this_user}`}>
          <Avatar
            className="Avatar"
            src={profileImages.avatar || "default_avatar_url"}
            alt="avatar"
            sx={{ width: "40px", height: "40px" }}
          />
        </NavLink>
      </div>
      <div className="leftContainer">
        <div className="mainCommentContainer">
          <div className="header" onClick={handleProfileNavigate}>
            <div className="nameNId">
              <span className="name">{userInfo.name}</span>
              <span className="idName">@{userInfo.username}</span>
              <span className="level">
                LV
                <span
                  className={`textHighlight ${
                    level < 4
                      ? "bluetext"
                      : level < 7
                      ? "yellowtext"
                      : "redtext"
                  }`}
                >
                  {level}
                </span>
              </span>
            </div>
          </div>
          <div className="CommentContent">
            <span>{commentData.content}</span>
          </div>
        </div>
        {commentImages && (
          <div className="commentImage">
            <img src={commentImages} alt="Comment visual content" />
          </div>
        )}
        <div className="option">
          <div className="datetime">
            {new Date(commentData.this_time).toLocaleDateString("en-US")}
          </div>
          <div className="like" onClick={handleLike}>
            <img
              src={isLiked ? "/icons/heart-pink.svg" : "/icons/heart.svg"}
              alt="like"
            />
            <span className="number">{likeCount}</span>
          </div>
          <div className="reply" onClick={handleReply}>
            <img src="/icons/message.svg" alt="reply" />
            <span className="number">{replyCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
