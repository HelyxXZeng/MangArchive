import { Avatar } from "@mui/material";
import "./PostCard.scss";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ComicCard from "../../comicCardSmall/ComicCard";
import { phraseImageUrl } from "../../../../utils/imageLinkPhraser";
import { fetchUserInfo, fetchUserProfileImages } from "../../../../api/userAPI";
import {
  fetchCommentsAndReplies,
  fetchLikeStatus,
  fetchPostImages,
  fetchPostInfo,
  toggleLikeStatus,
} from "../../../../api/postAPI";
import { fetchMangaById } from "../../../../api/mangaAPI";
import LoadingWave from "../../../loadingWave/LoadingWave";
import { checkContentAI } from "../../../../api/contentAPI";

interface PostCardProps {
  postId: any;
  onCommentSectionClick?: () => void;
  displayImage?: boolean;
  mangaid?: string;
}

const PostCard = ({
  postId,
  onCommentSectionClick,
  displayImage = true,
  mangaid,
}: PostCardProps) => {
  const [mangaSuggestContent, setMangaSuggestContent] = useState(mangaid || "");
  const [comic, setComic] = useState<any>(null);
  const [postInfo, setPostInfo] = useState<any>(null);
  const [postImages, setPostImages] = useState<string[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<{
    avatar: string;
  } | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [contentCovered, setContentCovered] = useState<boolean>(false);
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  const navigate = useNavigate();

  const getPostInfo = async () => {
    const post = await fetchPostInfo(postId);

    // Check content offensiveness
    const offensiveResult = await checkContentAI(post.content);
    if (offensiveResult && offensiveResult.score > 0.5) {
      setContentCovered(true); // Cover content if offensive
    }
    setPostInfo(post);
  };

  useEffect(() => {
    getPostInfo();
  }, [postId]);

  useEffect(() => {
    const getPostImages = async () => {
      if (postId) {
        const images = await fetchPostImages(postId);
        setPostImages(images);
      }
    };
    getPostImages();
  }, [postId, displayImage]);

  useEffect(() => {
    if (postInfo && postInfo.truyen) {
      setMangaSuggestContent(postInfo.truyen);
    }
  }, [postInfo]);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        if (mangaSuggestContent) {
          const mangaDetailed = await fetchMangaById(mangaSuggestContent);
          setComic(mangaDetailed);
        } else {
          setComic(null);
        }
      } catch (error) {
        console.error("Error fetching manga details:", error);
        setComic(null); // Đảm bảo không set state với dữ liệu lỗi
      }
    };

    fetchManga();
  }, [mangaSuggestContent]);

  useEffect(() => {
    const getCommentsAndReplies = async () => {
      if (postId) {
        const count = await fetchCommentsAndReplies(postId);
        setTotalComments(count);
      }
    };
    getCommentsAndReplies();
  }, [postId]);

  const handleLikeClick = async () => {
    try {
      await toggleLikeStatus(postId, userInfo?.this_id, !liked);
      setLiked(!liked);
      getPostInfo();
    } catch (error) {
      console.error("Failed to update like status", error);
    }
  };

  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        if (postInfo) {
          const { data, error } = await fetchUserInfo(postInfo?.this_user); // Đảm bảo có await trước
          if (error) {
            console.error("Error fetching user info:", error);
          } else {
            setUserInfo(data[0]); // Đảm bảo truy xuất data đúng cách
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfos();
  }, [postInfo]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        if (userInfo?.this_id) {
          const { data, error } = await fetchUserProfileImages(
            userInfo.this_id
          );
          if (error) console.error(error);
          else {
            setProfileImages({ avatar: phraseImageUrl(data[0]?.avatar_link) });
          }
        } else {
          setProfileImages({ avatar: "" });
        }
      } catch (error) {
        console.error("Error fetching profile images:", error);
      }
    };

    fetchProfileImages();
  }, [userInfo, postInfo]);

  useEffect(() => {
    const fetchLikeStatusData = async () => {
      if (postId && userInfo?.this_id) {
        const status = await fetchLikeStatus(postId, userInfo.this_id);
        setLiked(status);
      }
    };
    fetchLikeStatusData();
  }, [postId, userInfo]);

  const handleImageClick = (index: any) => {
    navigate(`/profile/${userInfo?.username}/post/${postId}`, {
      state: { displayImageIndex: index },
    });
  };

  const handleCommentClick = () => {
    if (onCommentSectionClick) {
      onCommentSectionClick();
    } else {
      navigate(`/profile/${userInfo?.username}/post/${postId}`);
    }
  };

  const handleContentToggle = () => {
    setIsContentVisible((prev) => !prev);
  };

  const { username: CurrentuserName } = useParams();
  const handleNavigate = () => {
    if (userInfo && userInfo.username !== CurrentuserName) {
      navigate(`/profile/${userInfo.username}`);
    }
  };

  const galleryItems = [];

  switch (postImages.length) {
    case 1:
      galleryItems.push(
        <img
          key={0}
          className="gallery_item fullWidth"
          src={postImages[0]}
          alt={`Image 1`}
          onClick={() => handleImageClick(0)}
        />
      );
      break;
    case 2:
      postImages.forEach((image, index) => {
        galleryItems.push(
          <img
            key={index}
            className={`gallery_item halfWidth image${index}`}
            src={image}
            alt={`Image ${index + 1}`}
            onClick={() => handleImageClick(index)}
          />
        );
      });
      break;
    case 3:
      galleryItems.push(
        <img
          key={0}
          className={`gallery_item halfWidth image0`}
          src={postImages[0]}
          alt={`Image 1`}
          onClick={() => handleImageClick(0)}
        />
      );
      galleryItems.push(
        <div key={1} className={`gallery_item halfWidth`}>
          <img
            className={`image1`}
            src={postImages[1]}
            alt={`Image 2`}
            onClick={() => handleImageClick(1)}
          />
          <img
            className={`image2`}
            src={postImages[2]}
            alt={`Image 3`}
            onClick={() => handleImageClick(2)}
          />
        </div>
      );
      break;
    case 4:
      postImages.forEach((image, index) => {
        galleryItems.push(
          <img
            key={index}
            className={`gallery_item quarterWidth image${index}`}
            src={image}
            alt={`Image ${index + 1}`}
            onClick={() => handleImageClick(index)}
          />
        );
      });
      break;
    default:
      break;
  }

  if (!postInfo)
    return (
      <div className="loading">
        <LoadingWave />
      </div>
    );
  const level = !isNaN(Math.floor(userInfo?.level / 100))
    ? Math.floor(userInfo?.level / 100)
    : 0;

  return (
    <div className="postCardContainer">
      <div className="cardHeader">
        <div className="avatarContainer">
          <NavLink to={`/profile/${userInfo?.username}`}>
            <Avatar
              className="Avatar"
              src={profileImages?.avatar}
              alt="avatar"
              sx={{ width: "40px", height: "40px" }}
            />
          </NavLink>
        </div>
        <div className="leftContainer">
          <div className="nameNId" onClick={handleNavigate}>
            <div className="userNameChild">
              <span className="name">{userInfo?.name}</span>
              <span className="level">
                LV
                <span
                  className={`textHighlight ${level < 4
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
            <div className="idNameAndDate">
              <span className="idName">@{userInfo?.username} · </span>
              <span className="datetime">
                {new Date(postInfo.post_time).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="moreOption">...</div>
        </div>
      </div>
      <div className="cardContent">
        <div className="textContent" onClick={handleContentToggle}>
          {contentCovered && !isContentVisible ? (
            <span className="coveredContent">
              Content is covered due to offensiveness
            </span>
          ) : (
            <span>{postInfo.content}</span>
          )}
        </div>
        {comic && (
          <div className="comicslug">
            <ComicCard
              cover={
                comic?.relationships.find((r: any) => r.type === "cover_art")
                  ?.attributes.fileName
              }
              title={comic?.attributes.title.en}
              comictype={comic?.type}
              maintag={comic?.attributes.tags[0].attributes.name.en}
              id={comic?.id}
            />
          </div>
        )}
        {displayImage && postImages.length > 0 && (
          <div className="gallery">{galleryItems}</div>
        )}
      </div>
      <div className="optionBar">
        <div className="likeSection">
          <div className="iconNnumber" onClick={handleLikeClick}>
            <div className={`heart-icon ${liked ? "liked" : ""}`}>
              {/* <img className={`heart-icon ${liked? 'liked' : ''}`} src="/heart.svg" alt="heart" /> */}
            </div>
          </div>
          <span className={`likes-amount ${liked ? "liked" : ""}`}>
            {postInfo.likecount}
          </span>
        </div>
        <div className="line"></div>
        <div className="commentSection" onClick={handleCommentClick}>
          <div className="imgwrapper">
            <img src="/icons/message.svg" alt="message" />
          </div>
          {totalComments}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
