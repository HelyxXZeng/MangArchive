import React, { useEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import "./userCardSmall.scss";
import { supabase } from "../../../utils/supabase";
import { useNavigate } from "react-router-dom";
import useCheckSession from "../../../hooks/session";
import {
  fetchUserIdByEmail,
  fetchUserInfo,
  fetchUserProfileImages,
} from "../../../api/userAPI";
import { followUserById, unfollowUserById } from "../../../api/scocialAPI";
import { phraseImageUrl } from "../../../utils/imageLinkPhraser";

interface UserCardSmallProps {
  userID: number;
  fetchSuggestUser: () => void; // Thêm props fetchSuggestUser
}

const UserCardSmall: React.FC<UserCardSmallProps> = ({
  userID,
  fetchSuggestUser,
}) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<{
    avatar: string;
  } | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [realUserID, setRealUserID] = useState<any>(null);
  const session = useCheckSession();
  const navigate = useNavigate();

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
          const { data, error } = await fetchUserInfo(userID.toString());
          if (error) console.error(error);
          else {
            setUserInfo(data[0]);
          }
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
          const { data, error } = await fetchUserProfileImages(
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
    navigate(`/profile/${userInfo.username}`);
  };

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
        <span className="name">{userInfo?.name}</span>
        <span className="idName">@{userInfo?.username}</span>
      </div>
      <div className="followedbutton">
        <Button
          className={`followedButton ${isFollowed ? "textwhite" : "textblack"}`}
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
  );
};

export default UserCardSmall;
