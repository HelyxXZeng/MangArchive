import { Avatar } from "@mui/material";
import "./PostCard.scss"
import { NavLink } from "react-router-dom";
import { useState } from "react";

const PostCard = () => {
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

    const handleCommentClick = () => {
        console.log("mở post lên!")
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