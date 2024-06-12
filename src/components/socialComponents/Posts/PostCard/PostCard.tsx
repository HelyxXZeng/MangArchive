import { Avatar } from "@mui/material";
import "./PostCard.scss"
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { CommentBoxRef } from "../../../commentFunc/CommentFunc";
import ComicCard from "../../comicCardSmall/ComicCard";
import axios from "axios";

interface PostCardProps {
    postId: number;
    isInDetailPage?: boolean; // Xác định xem PostCard được sử dụng trong trang chi tiết hay không
    onCommentSectionClick?: () => void; // Hàm xử lý khi CommentSection được click (chỉ cần định nghĩa nếu isInDetailPage là true)
    commentBoxRef?: React.RefObject<CommentBoxRef>; // Ref để truy cập vào CommentBox từ PostDetail
    displayImage?: boolean;//giá trị mặc định là true
    mangaid?: string;
}
const PostCard = (data: PostCardProps) => {
    const [mangaSuggestContent, setMangaSuggestContent] = useState(data.mangaid || "");
    const [idValid, setIdValid] = useState<boolean>(true);
    const [comic, setComic] = useState<any>(null);

    const images = [
        'https://cdn.donmai.us/original/f2/dd/__acheron_honkai_and_1_more_drawn_by_szlljxk__f2dd492d1ef8fbaa4c8a0f0cabc280ed.jpg',
        'https://cdn.donmai.us/original/d2/1b/__robin_honkai_and_1_more_drawn_by_himey__d21bab2de5bbe278d34f85f42664b4fc.jpg',
        'https://cdn.donmai.us/original/6d/aa/__black_swan_honkai_and_1_more_drawn_by_chiyikoupangsanjin__6daa01579c497f2530ce4ca1e595b7b9.jpg',
        'https://cdn.donmai.us/original/0a/54/__robin_honkai_and_1_more_drawn_by_kbnimated__0a54c19422393c4bcc3a90b10b3e8553.jpg',
    ];

    const [name, setName] = useState<string>('test');
    const [level, setLevel] = useState<number>(3);
    const [idName, setIdName] = useState<string>('@test');
    const [liked, setLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(1000);
    const [comments, setComments] = useState<number>(3);
    const [dateTime, setdateTime] = useState<Date>(new Date("01/06/2024"));

    const handleLikeClick = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };
    const getRandomImages = (arr :any, count:number) => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    const limitedImages = getRandomImages(images, 3);

    const handleCommentClick = () => {
        if (data.isInDetailPage && data.onCommentSectionClick) {
            data.onCommentSectionClick();
        } else {
            console.log("mở post lên!");
        }
    };
    let galleryItems = [];

    useEffect(() => {
        if (mangaSuggestContent) {
            axios.get(`https://api.mangadex.org/manga/${mangaSuggestContent.trim()}?includes[]=cover_art&includes[]=artist&includes[]=author`)
                .then(response => {
                    console.log(response.data.data);
                    setComic(response.data.data);
                    setIdValid(true);
                })
                .catch(error => {
                    console.error("Invalid manga ID:", error);
                    setIdValid(false);
                    setComic(null);                  
                });
        } else {
            setIdValid(true);  // Allow posting when ID is empty
            setComic(null);
        }
    }, [mangaSuggestContent]);

    switch (3) {
        case 1:
            galleryItems.push(
                <img
                    key={0}
                    className="gallery_item fullWidth"
                    src={images[0]}
                    alt={`Image 1`}
                />
            );
            break;
        case 2: 
            limitedImages.forEach((image:string, index:number) => {
                galleryItems.push(
                    <img
                        key={index}
                        className={`gallery_item halfWidth image${index}`}
                        src={image}
                        alt={`Image ${index + 1}`}
                    />
                );
            });
            break;
            case 3:
                galleryItems.push(
                    <img
                        key={0}
                        className={`gallery_item halfWidth image0`}
                        src={images[0]}
                        alt={`Image 1`}
                    />
                );
                galleryItems.push(
                    <div key={1} className={`gallery_item halfWidth`}>
                        <img
                            className={`image1`}
                            src={images[1]}
                            alt={`Image 2`}
                        />
                        <img
                            className={`image2`}
                            src={images[2]}
                            alt={`Image 3`}
                        />
                    </div>
                );
                break;
        case 4:
            for (let i = 0; i < images.length; i++) {
                galleryItems.push(
                    <img
                        key={i}
                        className={`gallery_item quarterWidth image${i}`}
                        src={images[i]}
                        alt={`Image ${i + 1}`}
                    />
                );
            }
            break;
        default:
            break;
    }
    return (
        <div className="postCardContainer">
            <div className="cardHeader">
                <div className="avatarContainer">
                    <NavLink to="/profile/test">
                        <Avatar
                            className="Avatar"
                            src="https://cdn.donmai.us/original/5f/ea/__firefly_honkai_and_1_more_drawn_by_baba_ba_ba_mb__5feaaa99527187a3db0e437380ec3932.jpg"
                            alt="avatar"
                            sx={{ width: "40px", height: "40px" }} />
                    </NavLink>
                </div>
                <div className="leftContainer">
                    <div className="nameNId">
                        <div className="userNameChild">
                            <span className="name">{name}</span>
                            <span className="level">LV<span className={`textHighlight ${level < 4 ? "bluetext" : level < 7 ? "yellowtext" : "redtext"}`}>{level}</span></span>
                        </div>
                        <div className="idNameAndDate">
                            <span className="idName">{idName} · </span>
                            <span className="datetime">{dateTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                        </div>
                    </div>
                    <div className="moreOption">...</div>
                </div>
            </div>
            <div className="cardContent">
                {/* Ca này khó */}
                <div className="textContent">
                    <span>Thử text content
                        coi sao</span>
                </div>
                {mangaSuggestContent &&
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
                {/* <div className="gallery">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            className="gallery_item" src={image} alt={`Image ${index + 1}`}
                        />
                    ))}
                </div> */}
                { 3 > 0 && 
                    <div className="gallery">{galleryItems}</div>
                }
            </div>
            <div className="optionBar">
                <div className="likeSection">
                    <div className="iconNnumber" onClick={handleLikeClick}>
                        <div className={`heart-icon ${liked ? 'liked' : ''}`}>
                            {/* <img className={`heart-icon ${liked ? 'liked' : ''}`} src="/heart.svg" alt="heart" /> */}
                        </div>
                    </div>
                    <span className={`likes-amount ${liked ? 'liked' : ''}`}>{likes}</span>
                </div>
                <div className="line"></div>
                <div className="commentSection" onClick={handleCommentClick}>
                    <div className="imgwrapper">
                        <img src="/icons/message.svg" alt="message" />
                    </div>
                    {comments}
                </div>
            </div>
        </div>
    )
}

export default PostCard