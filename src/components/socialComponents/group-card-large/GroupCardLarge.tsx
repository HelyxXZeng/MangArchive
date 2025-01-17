import { Avatar, Button } from "@mui/material";
import { useEffect, useState } from "react";
import "../userCardLarge/userCardLarge.scss";
import useCheckSession from "../../../hooks/session";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import {
  fetchUserIdByEmail,
} from "../../../api/userAPI";
import { phraseImageUrl } from "../../../utils/imageLinkPhraser";
import { followUserById, unfollowUserById } from "../../../api/scocialAPI";
import { fetchGroupDataByID, fetchGroupProfileImages } from "../../../api/groupApi";

interface GroupCardLargeProps {
  userID: number;
  fetchSuggestUser: () => void; // Add level prop
}

const GroupCardLarge: React.FC<GroupCardLargeProps> = ({
  userID,
  fetchSuggestUser,
}) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<{
    avatar: string;
  } | null>(null);
  const [isFollowed, setIsFollowed] = useState(true);
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
    const fetchUserInfos = async () => {
      try {
        if (userID) {
          const data = await fetchGroupDataByID(userID);
          setUserInfo(data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfos();
  }, [userID]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        if (userID) {
          const { data, error } = await fetchGroupProfileImages(
            userID.toString()
          );
          if (error) console.error(error);
          else {
            if (data[0]) {
              const avatarLink = phraseImageUrl(data[0].avatar_link);

              if (avatarLink) {
                setProfileImages({
                  avatar: avatarLink,
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
      if (session && session.user) {
        try {
          const { data, error } = await supabase
            .from("GroupFollowing")
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
      }
      else {
        setIsFollowed(false);
      }
    };

    if (userID && realUserID) {
      checkIfFollowed();
    }
  }, [userID, realUserID]);

  const followUser = async () => {
    try {
      await followUserById(realUserID, userID);
      setIsFollowed(true);
      fetchSuggestUser();
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async () => {
    try {
      await unfollowUserById(realUserID, userID);
      setIsFollowed(false);
      fetchSuggestUser();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleNavigate = () => {
    navigate(`/group/${userInfo.name_id}`);
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
            <span className="idName">@{userInfo?.name_id}</span>
          </div>
          <div className="followedbutton">
            <Button
              className={`followedButton ${isFollowed ? "textwhite" : "textblack"
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
        <div className="des">{userInfo?.description}</div>
      </div>
    </div>
  );
};

export default GroupCardLarge;
