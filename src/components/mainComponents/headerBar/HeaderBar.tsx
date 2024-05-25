import { useCallback, useEffect, useState } from "react";
import "./headerBar.scss";
import { Avatar, Badge, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useCheckSession from "../../../hooks/session";

const HeaderBar = () => {
  const navigate = useNavigate();
  const onLoginButtonClick = useCallback(() => {
    navigate("/auth/login");
  }, [navigate]);

  const onSignUpContainerClick = useCallback(() => {
    navigate("/auth/signup");
  }, [navigate]);
  const session  = useCheckSession();

  const [status, setStatus] = useState<boolean>(false);
  useEffect(() => {
    if (session !== null) {
      console.log("trigger session",session)
      setStatus(true);
    }
  }, [session]);
  const [notificationCount, setNotificationCount] = useState(1);
  const [searchInput, setSearchInput] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      navigate(`/search?title=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <div className="headerBar">
      <div className="logo">
        <img src="/Logo.png" alt="Logo" />
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
                src="https://cdn.donmai.us/original/5f/ea/__firefly_honkai_and_1_more_drawn_by_baba_ba_ba_mb__5feaaa99527187a3db0e437380ec3932.jpg"
                alt="avatar"
                sx={{ width: "48px", height: "48px", border: "2px solid #1F1F1F" }}
              />
            </div>
          ) : (
            <div className="authButton">
              <Button
                variant="contained"
                onClick={onLoginButtonClick}
                sx={{
                  '&.MuiButton-contained': {
                    backgroundColor: '#1b6fa8',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#4296cf',
                    },
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={onSignUpContainerClick}
                sx={{
                  '&.MuiButton-contained': {
                    backgroundColor: 'transparent',
                    color: '#1F1F1F',
                    border: '1px solid #1F1F1F',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
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
