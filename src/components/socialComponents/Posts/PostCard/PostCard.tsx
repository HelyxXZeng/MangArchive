import { Avatar } from "@mui/material";
import "./PostCard.scss";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase";
import ComicCard from "../../comicCardSmall/ComicCard";
import axios from "axios";

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
    mangaid
}: PostCardProps) => {
    const [mangaSuggestContent, setMangaSuggestContent] = useState(mangaid || "");
    const [comic, setComic] = useState<any>(null);
    const [postInfo, setPostInfo] = useState<any>(null);
    const [postImages, setPostImages] = useState<string[]>([]);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [profileImages, setProfileImages] = useState<{ avatar: string, background: string } | null>(null);
    const [liked, setLiked] = useState<boolean>(false);

    const navigate = useNavigate();

    const fetchPostInfo = async () => {
        if (postId) {
            try {
                const { data: post, error } = await supabase.rpc('get_post_info', { this_post_id: postId });
                if (error) {
                    console.error("Error fetching post info:", error);
                } else {
                    setPostInfo(post[0]);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        fetchPostInfo();
    }, [postId]);

    useEffect(() => {
        const fetchPostImages = async () => {
            try {
                if (postId) {
                    const { data, error } = await supabase.rpc('get_post_image', { post_id: postId });
                    if (error) {
                        console.error("Error fetching post images:", error);
                    } else {
                        const images = data.map((image: any) => JSON.parse(image).publicUrl);
                        setPostImages(images);
                        // console.log(postImages.length)
                    }
                }
            } catch (error) {
                console.error("Error fetching post images:", error);
            }
        };

        fetchPostImages();
    }, [postId]);

    useEffect(() => {
        if (postInfo && postInfo.truyen) {
            setMangaSuggestContent(postInfo.truyen);
        }
    }, [postInfo]);

    useEffect(() => {
        if (mangaSuggestContent) {
            axios.get(`https://api.mangadex.org/manga/${mangaSuggestContent.trim()}?includes[]=cover_art&includes[]=artist&includes[]=author`)
                .then(response => {
                    setComic(response.data.data);
                })
                .catch(error => {
                    console.error("Invalid manga ID:", error);
                    setComic(null);
                });
        } else {
            setComic(null);
        }
    }, [mangaSuggestContent]);

    useEffect(() => {
        const fetchCommentsAndReplies = async () => {
            try {
                if (postId) {
                    const { data: comments, error: commentsError } = await supabase.rpc('get_comments_for_post', { this_limit: 0, this_offset: 0, this_post_id: postId });
                    if (commentsError) {
                        console.error("Error fetching comments:", commentsError);
                    }

                    let totalRepliesCount = 0;
                    if (comments && comments.length > 0) {
                        const repliesPromises = comments.map(async (commentId: bigint) => {
                            const { data: replies, error: repliesError } = await supabase.rpc('get_replies_for_comment', { this_limit: 0, this_offset: 0, this_comment_id: commentId });
                            if (repliesError) {
                                console.error("Error fetching replies:", repliesError);
                            }
                            return replies ? replies.length : 0;
                        });
                        const repliesCounts = await Promise.all(repliesPromises);
                        totalRepliesCount = repliesCounts.reduce((acc, count) => acc + count, 0);
                    }

                    setTotalComments(comments.length + totalRepliesCount);
                }
            } catch (error) {
                console.error("Error fetching comments and replies:", error);
            }
        };

        fetchCommentsAndReplies();
    }, [postId]);

    const handleLikeClick = async () => {
        try {
            const newLikedState = !liked;
            const { error } = await supabase.rpc('add_interact_for_post', {
                this_post_id: postId,
                this_user_id: userInfo?.this_id,
                this_type: newLikedState ? 'LIKE' : 'NONE'
            });

            if (error) {
                console.error("Error updating like status:", error);
                return;
            }

            setLiked(newLikedState);
            fetchPostInfo(); // Fetch new post info including updated like count
        } catch (error) {
            console.error("Error handling like click:", error);
        }
    };

    // Load user info/ lưu ý là user info của người khác, không phải của bản thân
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (postInfo) {
                    const { data, error } = await supabase.rpc("get_user_info", { this_user_id: postInfo.this_user });
                    if (error) console.error(error);
                    else {
                        setUserInfo(data[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, [postInfo]);

    // Load avatar
    useEffect(() => {
        const fetchProfileImages = async () => {
            try {
                if (userInfo?.this_id) {
                    const { data, error } = await supabase.rpc("get_profile_image", { this_user_id: userInfo.this_id });
                    if (error) console.error(error);
                    else {
                        if (data[0]) {
                            const avatarLink = data[0].avatar_link ? JSON.parse(data[0].avatar_link).publicUrl : "";
                            const backgroundLink = data[0].background_link ? JSON.parse(data[0].background_link).publicUrl : "";

                            setProfileImages({ avatar: avatarLink || "", background: backgroundLink || "" });
                        } else {
                            setProfileImages({ avatar: "", background: "" });
                        }
                    }
                } else {
                    setProfileImages({ avatar: "", background: "" });
                }
            } catch (error) {
                console.error("Error fetching profile images:", error);
            }
        };

        fetchProfileImages();
    }, [userInfo, postInfo]);

    const handleImageClick = (index: any) => {
        navigate(`/profile/${userInfo?.username}/post/${postId}`, { state: { displayImageIndex: index } });
    };

    const handleCommentClick = () => {
        if (onCommentSectionClick) {
            onCommentSectionClick();
        } else {
            navigate(`/profile/${userInfo?.username}/post/${postId}`);
        }
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

    if (!postInfo) return <div>Loading Current Post...</div>;
    const level = !isNaN(Math.floor(userInfo?.level / 100)) ? Math.floor(userInfo?.level / 100) : 0;

    return (
        <div className="postCardContainer">
            <div className="cardHeader">
                <div className="avatarContainer">
                    <NavLink to={`/profile/${userInfo?.username}`}>
                        <Avatar
                            className="Avatar"
                            src={profileImages?.avatar}
                            alt="avatar"
                            sx={{ width: "40px", height: "40px" }} />
                    </NavLink>
                </div>
                <div className="leftContainer">
                    <div className="nameNId" onClick={handleNavigate}>
                        <div className="userNameChild">
                            <span className="name">{userInfo?.name}</span>
                            <span className="level">LV<span className={`textHighlight ${level < 4 ? "bluetext" : level < 7 ? "yellowtext" : "redtext"}`}>{level}</span></span>
                        </div>
                        <div className="idNameAndDate">
                            <span className="idName">@{userInfo?.username} · </span>
                            <span className="datetime">{new Date(postInfo.post_time).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                        </div>
                    </div>
                    <div className="moreOption">...</div>
                </div>
            </div>
            <div className="cardContent">
                <div className="textContent">
                    <span>{postInfo.content}</span>
                </div>
                {comic &&
                    <div className="comicslug">
                        <ComicCard
                            cover={comic?.relationships.find((r: any) => r.type === "cover_art")?.attributes.fileName}
                            title={comic?.attributes.title.en}
                            comictype={comic?.type}
                            maintag={comic?.attributes.tags[0].attributes.name.en}
                            id={comic?.id}
                        />
                    </div>
                }
                {displayImage && postImages.length > 0 &&
                    <div className="gallery">
                        {galleryItems}
                    </div>
                }
            </div>
            <div className="optionBar">
                <div className="likeSection">
                    <div className="iconNnumber" onClick={handleLikeClick}>
                        <div className={`heart-icon ${liked ? 'liked' : ''}`}>
                            {/* <img className={`heart-icon ${liked? 'liked' : ''}`} src="/heart.svg" alt="heart" /> */}
                        </div>
                    </div>
                    <span className={`likes-amount ${liked ? 'liked' : ''}`}>{postInfo.likecount}</span>
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
}

export default PostCard;
