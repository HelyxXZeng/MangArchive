import { Avatar } from '@mui/material';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './commentCard.scss';

interface CommentCardProps {
  className?: string;
  commentBoxRef?: any;
  onReplyClick?: (name: string) => void;
  key?: number;
}

const CommentCard: React.FC<CommentCardProps> = ({ className, commentBoxRef, onReplyClick }) => {
  const [name, setName] = useState<string>('test');
  const [level, setLevel] = useState<number>(3);
  const [dateTime, setdateTime] = useState<Date>(new Date("01/06/2024"));
  const [idName, setIdName] = useState<string>('@test');
  const [image, Setimage] = useState<string>('https://cdn.donmai.us/original/e4/c9/__yinlin_wuthering_waves_drawn_by_krin_krinnin__e4c98e144385e7339ac09712f28e623f.jpg');
  const navigate = useNavigate();

  const handleProfileNavigate = () => {
    navigate("/profile/test");
  };

  const handleReply = () => {
    if (onReplyClick) {
      onReplyClick(name);
    }
  };

  return (
    <div className={`commentCardContainer ${className}`}>
      <div className="avatar">
        <NavLink to="/profile/test">
          <Avatar
            className="Avatar"
            src="https://cdn.donmai.us/original/5f/ea/__firefly_honkai_and_1_more_drawn_by_baba_ba_ba_mb__5feaaa99527187a3db0e437380ec3932.jpg"
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
                <span className="name">{name}</span>
                <span className="idName">{idName}</span>
                <span className="level">
                  LV<span className={`textHighlight ${level < 4 ? "bluetext" : level < 7 ? "yellowtext" : "redtext"}`}>{level}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="CommentContent">
            <span>text content ở đây hơi bị dài để mà test thử coi nó có xuống dòng không</span>
          </div>
        </div>
        {image !== "" &&
          <div className="commentImage">
            <img src={image} alt="hình ảnh trong comment của ai đó" />
          </div>
        }
        <div className="option">
          <div className="datetime">
            {dateTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
          </div>
          <div className="like">
            <img src="/icons/heart.svg" alt="" />
            <span className="number">1</span>
          </div>
          <div className="reply" onClick={handleReply}>
            <img src="/icons/message.svg" alt="" />
            <span className="number">1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
