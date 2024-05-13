import { Avatar, Button } from "@mui/material";
import { useState } from "react"
import './userCardSmall.scss'

interface UserCardSmallProps {
  name: string;
}
const UserCardSmall: React.FC<UserCardSmallProps> = ({ name }) => {
  const [avatar, setAvatar] = useState<any>();
  const [userName, setUserName] = useState<string>('');
  const [idname, setIdName] = useState<string>('');
  const [followedstate, setFollowedState] = useState<boolean>(false);

  const onFollowedButtonClick = () => {
    console.log(followedstate);
    setFollowedState(!followedstate);
  }

  return (
    <div className="cardFrame">
      <div className="avatar">
        <Avatar src="/wallpaper/test-avatar.png" alt="avatar of user"
          sx={{ width: "32px", height: "32px" }} />
      </div>
      <div className="nameAndId">
        <span className="name">
          {name}
        </span>
        <span className="idName">@test</span>
      </div>
      <div className="followedbutton">
        <Button
          className={`followedButton ${followedstate ?"textwhite" : "textblack" }`}
          variant="contained"
          onClick={onFollowedButtonClick}
        >
          {followedstate ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </div>
  )
}

export default UserCardSmall