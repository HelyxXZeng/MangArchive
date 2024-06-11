import { Avatar, Button } from "@mui/material";
import { useEffect, useState } from "react";
import './userCardSmall.scss';
import { supabase } from "../../../utils/supabase";
import { useNavigate } from "react-router-dom";
import useCheckSession from "../../../hooks/session";

interface UserCardSmallProps {
  userID: number;
}

const UserCardSmall: React.FC<UserCardSmallProps> = ({ userID }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<{ avatar: string, background: string } | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [realUserID, setRealUserID] = useState<any>(null);
  const session = useCheckSession();

  useEffect(() => {
    const fetchUserId = async () => {
        if (session !== null) {
            try {
                const { user } = session;
                if (user) {
                    let { data, error } = await supabase.rpc("get_user_id_by_email", {
                        p_email: session.user.email,
                    });
                    if (error) console.error(error);
                    else {
                        setRealUserID(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching username:", error);
            }
        }
    };

    fetchUserId();
}, [session]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (userID) {
          const { data, error } = await supabase.rpc("get_user_info", { this_user_id: userID });
          if (error) console.error(error);
          else {
            setUserInfo(data[0]); // Adjust based on the returned data structure
            // console.log(data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [userID]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        if (userID) {
          const { data, error } = await supabase.rpc("get_profile_image", { this_user_id: userID });
          if (error) console.error(error);
          else {
            if (data[0]) {
              const avatarLink = data[0].avatar_link ? JSON.parse(data[0].avatar_link).publicUrl : null;
              const backgroundLink = data[0].background_link ? JSON.parse(data[0].background_link).publicUrl : null;

              if (avatarLink || backgroundLink) {
                setProfileImages({ avatar: avatarLink, background: backgroundLink });
                // console.log({ avatar: avatarLink, background: backgroundLink });
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile images:", error);
      }
    };

    fetchProfileImages();
  }, [userID]);
  const followUser = async () => {
    try {
      console.log(userID, realUserID)
      const { data, error } = await supabase.rpc("follow_user", {
        this_user_id: realUserID,
        follow_user_id: userID,
      });
      if (error) {
        console.error("Error following user:", error);
      } else {
        setIsFollowed(true);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async () => {
    try {
      console.log(userID, realUserID)
      const { data, error } = await supabase.rpc("unfollow_user", {
        this_user_id: realUserID,
        follow_user_id: userID,
      });
      if (error) {
        console.error("Error unfollowing user:", error);
      } else {
        setIsFollowed(false);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const checkIfFollowed = async () => {
    try {
      const { data, error } = await supabase
        .from("UserFollowing")
        .select("*")
        .eq("user", realUserID)
        .eq("follow", userID)
        .single();
  
      if (error && error.code !== 'PGRST116') {
        throw error;
        // console.error("Error checking follow status:", error);
      } else {
        setIsFollowed(!!data);
      }
    } catch (error) {
      // throw error;
      // console.error("Error checking follow status:", error);
    }
  };

  useEffect(() => {
    if (userID && userInfo) {
      console.log(userID, realUserID)


      checkIfFollowed();
    }
  }, [userID, realUserID]);

  const onFollowedButtonClick = () => {
    if (isFollowed) {
      unfollowUser();
    } else {
      followUser();
    }
  };
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`profile/${userInfo.username}`);
  }  
  return (
    <div className="cardFrame" onClick={handleNavigate}>
      <div className="avatar">
        <Avatar
          src={profileImages?.avatar}
          alt="avatar of user"
          sx={{ width: "32px", height: "32px" }}
        />
      </div>
      <div className="nameAndId">
        <span className="name">
          {userInfo?.name}
        </span>
        <span className="idName">@{userInfo?.username}</span>
      </div>
      <div className="followedbutton">
        <Button
          className={`followedButton ${isFollowed ? "textwhite" : "textblack"}`}
          variant="contained"
          onClick={onFollowedButtonClick}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </div>
  )
}

export default UserCardSmall;