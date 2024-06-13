import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import './commentCard.scss';

interface CommentCardProps {
  className?: string;
  commentBoxRef?: any;
  onReplyClick?: (userId:any, username:any) => void;
  commentID: number;
  replyCount?: number;
}

const CommentCard: React.FC<CommentCardProps> = ({ className, commentBoxRef, onReplyClick, commentID, replyCount }) => {
  const [commentData, setCommentData] = useState<any>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [profileImages, setProfileImages] = useState<{ avatar: string | null; background: string | null }>({ avatar: null, background: null });
  const [userInfo, setUserInfo] = useState<any>(null);
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        // console.log(commentID)
        if (commentID) {
          const { data, error } = await supabase.rpc('get_comment_info', { this_comment_id: commentID });
          if (error) console.error("Error fetching comment data:", error);
          else setCommentData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching comment data:", error);
      }
    };

    fetchCommentData();
  }, [commentID]);

  useEffect(() => {
    const fetchCommentImages = async () => {
      try {
        if (commentID) {
          const { data, error } = await supabase.rpc('get_comment_image', { comment_id: commentID });
          if (error) {
            console.error("Error fetching comment images:", error);
          } else {
            setCommentImages(data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching comment images:", error);
      }
    };

    fetchCommentImages();
  }, [commentID]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (commentData) {
        try {
          const { data, error } = await supabase.rpc("get_user_info", { this_user_id: commentData.this_user });
          if (error) console.error(error);
          else {
            setUserInfo(data[0]);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [commentData]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      if (commentData) {
        try {
          const { data, error } = await supabase.rpc("get_profile_image", { this_user_id: commentData.this_user });
          if (error) console.error(error);
          else {
            if (data[0]) {
              const avatarLink = data[0].avatar_link ? JSON.parse(data[0].avatar_link).publicUrl : null;
              const backgroundLink = data[0].background_link ? JSON.parse(data[0].background_link).publicUrl : null;

              if (avatarLink || backgroundLink) {
                setProfileImages({ avatar: avatarLink, background: backgroundLink });
              }
            }
          }
        } catch (error) {
          console.error("Error fetching profile images:", error);
        }
      }
    };

    fetchProfileImages();
  }, [commentData]);

  useEffect(() => {
    if (commentData) {
      setLikeCount(commentData.likecount);
    }
  }, [commentData]);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (commentData && commentData.this_user) {
        try {
          const { data, error } = await supabase.rpc('check_like_for_comment', {
            this_comment_id: commentID,
            this_user_id: commentData.this_user
          });
          if (error) console.error("Error checking like status:", error);
          else setIsLiked(data);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    };

    if (commentData && commentData.this_user) {
      checkLikeStatus();
    }
  }, [commentData, commentID]);

  const handleProfileNavigate = () => {
    navigate(`/profile/${userInfo.username}`);
  };

  const handleReply = () => {
    if (onReplyClick && commentData && userInfo) {
      onReplyClick(commentData.this_user, userInfo.username);
    }
  };
  

  const handleLike = async () => {
    if (commentData && commentData.this_user) {
      try {
        const { data, error } = await supabase.rpc('add_interact_for_comment', {
          this_comment_id: commentID,
          this_user_id: commentData.this_user,
          this_type: 'like'
        });
        if (error) console.error("Error liking comment:", error);
        else {
          setLikeCount(prevCount => prevCount + 1);
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Error liking comment:", error);
      }
    }
  };

  if (!commentData || !userInfo) {
    return <div>Loading...</div>;
  }
  const level = !isNaN(Math.floor(userInfo?.level / 100)) ? Math.floor(userInfo?.level / 100) : 0;

  return (
    <div className={`commentCardContainer ${className}`}>
      <div className="avatar">
        <NavLink to={`/profile/${commentData.this_user}`}>
          <Avatar
            className="Avatar"
            src={profileImages.avatar || "https://cdn.donmai.us/original/5f/ea/__firefly_honkai_and_1_more_drawn_by_baba_ba_ba_mb__5feaaa99527187a3db0e437380ec3932.jpg"}
            alt="avatar"
            sx={{ width: "40px", height: "40px" }}
          />
        </NavLink>
      </div>
      <div className="leftContainer">
        <div className="mainCommentContainer">
          <div className="header" onClick={handleProfileNavigate}>
            <div className="nameNId">
              <div className="userNameChild">
                <span className="name">{userInfo.name}</span>
                <span className="idName">@{userInfo.username}</span>
                <span className="level">
                  LV<span className={`textHighlight ${level < 4 ? "bluetext" : level < 7 ? "yellowtext" : "redtext"}`}>{level}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="CommentContent">
            <span>{commentData.content}</span>
          </div>
        </div>
        {commentImages.length > 0 &&
          <div className="commentImage">
            {commentImages.map((image, index) => (
              <img key={index} src={image} alt="Comment visual content" />
            ))}
          </div>
        }
        <div className="option">
          <div className="datetime">
            {new Date(commentData.this_time).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
          </div>
          <div className="like" onClick={handleLike}>
            <img src={isLiked ? "/icons/heart-pink.svg" : "/icons/heart.svg"} alt="like" />
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
