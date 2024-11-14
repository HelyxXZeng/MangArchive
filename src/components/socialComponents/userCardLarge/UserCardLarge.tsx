import { Avatar, Button } from "@mui/material";
import { useEffect, useState } from "react";
import "./userCardLarge.scss";
import useCheckSession from "../../../hooks/session";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import { fetchUserIdByEmail } from "../../../api/userAPI";

interface UserCardLargeProps {
  userID: number;
  fetchSuggestUser: () => void; // Add level prop
}

const UserCardLarge: React.FC<UserCardLargeProps> = ({
  userID,
  fetchSuggestUser,
}) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<{
    avatar: string;
    background: string;
  } | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [realUserID, setRealUserID] = useState<any>(null);
  const session = useCheckSession();
  const navigate = useNavigate();
  const level = !isNaN(Math.floor(userInfo?.level / 100))
    ? Math.floor(userInfo?.level / 100)
    : 0;

  useEffect(() => {
    const getUserID = async () => {
      if (session && session.user) {
        try {
          const userId = await fetchUserIdByEmail(session.user.email);
          setRealUserID(userId);
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    getUserID();
  }, [session]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (userID) {
          const { data, error } = await supabase.rpc("get_user_info", {
            this_user_id: userID,
          });
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
  }, [userID]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        if (userID) {
          const { data, error } = await supabase.rpc("get_profile_image", {
            this_user_id: userID,
          });
          if (error) console.error(error);
          else {
            if (data[0]) {
              const avatarLink = data[0].avatar_link
                ? JSON.parse(data[0].avatar_link).publicUrl
                : null;
              const backgroundLink = data[0].background_link
                ? JSON.parse(data[0].background_link).publicUrl
                : null;

              if (avatarLink || backgroundLink) {
                setProfileImages({
                  avatar: avatarLink,
                  background: backgroundLink,
                });
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

  useEffect(() => {
    const checkIfFollowed = async () => {
      try {
        const { data, error } = await supabase
          .from("UserFollowing")
          .select("*")
          .eq("user", realUserID)
          .eq("follow", userID)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        } else {
          setIsFollowed(!!data);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    if (userID && realUserID) {
      checkIfFollowed();
    }
  }, [userID, realUserID]);

  const followUser = async () => {
    try {
      const { error } = await supabase.rpc("follow_user", {
        this_user_id: realUserID,
        follow_user_id: userID,
      });
      if (error) {
        console.error("Error following user:", error);
      } else {
        setIsFollowed(true);
        fetchSuggestUser(); // Gọi hàm fetchSuggestUser sau khi follow
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async () => {
    try {
      const { error } = await supabase.rpc("unfollow_user", {
        this_user_id: realUserID,
        follow_user_id: userID,
      });
      if (error) {
        console.error("Error unfollowing user:", error);
      } else {
        setIsFollowed(false);
        fetchSuggestUser(); // Gọi hàm fetchSuggestUser sau khi unfollow
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleNavigate = () => {
    navigate(`/profile/${userInfo.username}`);
  };

  return (
    <div className="cardFrame" onClick={handleNavigate}>
      <div className="avatar">
        <Avatar
          src={profileImages?.avatar}
          alt="avatar of user"
          sx={{ width: "40px", height: "40px" }}
        />
      </div>
      <div className="nameIdNDes">
        <div className="nameNFollButt">
          <div className="nameAndId">
            <div className="userNameChild">
              <span className="name">{userInfo?.name}</span>
              <span className="level">
                LV
                <span
                  className={`textHighlight ${
                    level < 4
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
            <span className="idName">@{userInfo?.username}</span>
          </div>
          <div className="followedbutton">
            <Button
              className={`followedButton ${
                isFollowed ? "textwhite" : "textblack"
              }`}
              variant="contained"
              onClick={(event) => {
                event.stopPropagation();
                isFollowed ? unfollowUser() : followUser();
              }} // Thay đổi hàm gọi khi click
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </div>
        <div className="des">{userInfo?.bio}</div>
      </div>
    </div>
  );
};

export default UserCardLarge;
