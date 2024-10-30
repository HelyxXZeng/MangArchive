import { useCallback, useEffect, useState } from "react";
import "./headerBar.scss";
import { Avatar, Badge, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useCheckSession from "../../../hooks/session";
import { supabase } from "../../../utils/supabase";

const HeaderBar = () => {
  const navigate = useNavigate();
  const [realUserID, setRealUserID] = useState<any>(null);
  const onLoginButtonClick = useCallback(() => {
    navigate("/auth/login");
  }, [navigate]);

  const onSignUpContainerClick = useCallback(() => {
    navigate("/auth/signup");
  }, [navigate]);
  const session = useCheckSession();

  const [status, setStatus] = useState<boolean>(false);
  useEffect(() => {
    if (session !== null) {
      setStatus(true);
    }
  }, [session]);
  const [notificationCount, setNotificationCount] = useState(1);
  const [searchInput, setSearchInput] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
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
          console.error("Error fetching user ID:", error);
        }
      }
    };
    fetchUserId();
  }, [session]);

  const [profileImages, setProfileImages] = useState<{
    avatar: string;
    background: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        if (realUserID) {
          const { data, error } = await supabase.rpc("get_profile_image", {
            this_user_id: realUserID,
          });
          if (error) console.error(error);
          else {
            if (data[0]) {
              const avatarLink = data[0].avatar_link
                ? JSON.parse(data[0].avatar_link).publicUrl
                : "";
              const backgroundLink = data[0].background_link
                ? JSON.parse(data[0].background_link).publicUrl
                : "";
              setProfileImages({
                avatar: avatarLink || "",
                background: backgroundLink || "",
              });
              // console.log(profileImages)
            } else {
              setProfileImages({ avatar: "", background: "" });
            }
          }
        } else {
          setProfileImages({ avatar: "", background: "" });
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
        <img src="/Logo.png" alt="Logo" className="Icon-text"/>
      </div>
      <div className="leftContainer">
        <div className="searchbar">
          <button className="searchicon" onClick={handleSearch}>
            <img src="/icons/searchiconbar.svg" alt="Search Icon" />
          </button>
          <input
            type="text"
            placeholder="Search something!"
            spellCheck="false"
            value={searchInput}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <div className="verticaldotline"></div>
          <button className="filter">
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
                Login
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
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
