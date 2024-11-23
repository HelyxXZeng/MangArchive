import { useCallback, useEffect, useState } from "react";
import "./headerBar.scss";
import { Avatar, Badge, Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import useCheckSession from "../../../hooks/session";
import {
  fetchUserIdByEmail,
  fetchUserInfo,
  fetchUserProfileImages,
} from "../../../api/userAPI";
import { phraseImageUrl } from "../../../utils/imageLinkPhraser";
import { useTranslation } from "react-i18next";

const HeaderBar = () => {
  const navigate = useNavigate();
  const [realUserID, setRealUserID] = useState<any>(null);
  const session = useCheckSession();
  const [status, setStatus] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  let notificationCount = 1;
  // const [notificationCount, setNotificationCount] = useState(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [profileImages, setProfileImages] = useState<{
    avatar: string;
  } | null>(null);
  const { t } = useTranslation("", { keyPrefix: "header-bar" });

  const onLoginButtonClick = useCallback(() => {
    navigate("/auth/login");
  }, [navigate]);

  const onSignUpContainerClick = useCallback(() => {
    navigate("/auth/signup");
  }, [navigate]);
  useEffect(() => {
    if (session !== null) {
      setStatus(true);
    }
  }, [session]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
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
    const getUserName = async () => {
      try {
        if (realUserID) {
          const { data, error } = await fetchUserInfo(realUserID);
          if (error) console.error(error);
          else {
            // console.log(data[0].username);
            setUsername(data[0].username);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUserName();
  }, [realUserID]);
  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        if (realUserID) {
          const { data, error } = await fetchUserProfileImages(realUserID);
          if (error) console.error(error);
          else {
            if (data[0]) {
              const avatar = phraseImageUrl(data[0].avatar_link);
              setProfileImages({
                avatar,
              });
              // console.log(profileImages)
            } else {
              setProfileImages({ avatar: "" });
            }
          }
        } else {
          setProfileImages({ avatar: "" });
        }
      } catch (error) {
        console.error("Error fetching profile images:", error);
      }
    };

    fetchProfileImages();
  }, [realUserID]);

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      navigate(`/search?title=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <div className="headerBar">
      <div className="logo">
        <img src="/MangArchive-Icon.svg" alt="" className="Icon" />
        <img src="/Logo.png" alt="Logo" className="Icon-text" />
      </div>
      <div className="leftContainer">
        <div className="searchbar">
          <button className="searchicon" onClick={handleSearch}>
            <img src="/icons/searchiconbar.svg" alt="Search Icon" />
          </button>
          <input
            type="text"
            placeholder={t("search")}
            spellCheck="false"
            value={searchInput}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <div className="verticaldotline"></div>
          <button
            className="filter"
            onClick={() => {
              navigate("/search");
            }}
          >
            <img src="/icons/filter.svg" alt="Filter Icon" />
          </button>
        </div>
        <div className="auth">
          {status ? (
            <div className="userThings">
              <div className="notificationIcon">
                <Badge
                  color="error"
                  badgeContent={notificationCount}
                  max={99}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <img src="/icons/messagetext.svg" alt="Notifications" />
                </Badge>
              </div>
              <NavLink to={`/profile/${username}`}>
                <Avatar
                  className="avatar"
                  src={profileImages?.avatar}
                  alt="avatar"
                  sx={{
                    width: "48px",
                    height: "48px",
                    border: "2px solid #1F1F1F",
                  }}
                />
              </NavLink>
            </div>
          ) : (
            <div className="authButton">
              <Button
                variant="contained"
                onClick={onLoginButtonClick}
                className="button"
                sx={{
                  "&.MuiButton-contained": {
                    backgroundColor: "#1b6fa8",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#4296cf",
                    },
                  },
                }}
              >
                {t("login")}
              </Button>
              <Button
                variant="contained"
                onClick={onSignUpContainerClick}
                className="button"
                sx={{
                  "&.MuiButton-contained": {
                    backgroundColor: "transparent",
                    color: "#1F1F1F",
                    border: "1px solid #1F1F1F",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  },
                }}
              >
                {t("signup")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
