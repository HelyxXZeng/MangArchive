import { Avatar, Button } from "@mui/material";
import { useState } from "react";
import './userCardLarge.scss';

interface UserCardLargeProps {
  name: string;
  idName: string;
  followedState: boolean;
  description: string;
  level: number; // Add level prop
}

const UserCardLarge: React.FC<UserCardLargeProps> = ({ name, idName, followedState, description, level }) => {
  const [avatar, setAvatar] = useState<any>();
  const [userName, setUserName] = useState<string>('');
  const [followedstate, setFollowedState] = useState<boolean>(followedState);

  const onFollowedButtonClick = () => {
    console.log(followedstate);
    setFollowedState(!followedstate);
  };

  return (
    <div className="cardFrame">
      <div className="avatar">
        <Avatar src="/wallpaper/test-avatar.png" alt="avatar of user"
          sx={{ width: "40px", height: "40px" }} />
      </div>
      <div className="nameIdNDes">
        <div className="nameNFollButt">
          <div className="nameAndId">
            <div className="userNameChild">
              <span className="name">{name}</span>
              <span className="level">LV<span className={`textHighlight ${level < 4 ? "bluetext" : level < 7 ? "yellowtext" : "redtext"}`}>{level}</span></span>
            </div>
            <span className="idName">{idName}</span>
          </div>
          <div className="followedbutton">
            <Button
              className={`followedButton ${followedstate ? "textwhite" : "textblack"}`}
              variant="contained"
              onClick={onFollowedButtonClick}
            >
              {followedstate ? "Following" : "Follow"}
            </Button>
          </div>
        </div>
        <div className="des">
          {description}
        </div>
      </div>

    </div>
  );
};

export default UserCardLarge;
