import { Avatar } from "@mui/material";
import "./PostCard.scss"
import { NavLink } from "react-router-dom";
import { useState } from "react";

interface props{
    count : number
}
const PostCard = (data:props) => {
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

    const handleLikeClick = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };
    const getRandomImages = (arr :any, count:number) => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    const limitedImages = getRandomImages(images, data.count);

    const handleCommentClick = () => {
        console.log("mở post lên!")
    }
    let galleryItems = [];


    switch (data.count) {
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
                        <span className="idName">{idName}</span>
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
                {/* <div className="gallery">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            className="gallery_item" src={image} alt={`Image ${index + 1}`}
                        />
                    ))}
                </div> */}
                { data.count > 0 && 
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