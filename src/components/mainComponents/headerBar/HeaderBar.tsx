import { useCallback, useState } from "react";
import "./headerBar.scss"
import { Badge, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeaderBar = () => {
  const navigate = useNavigate();
  const onLoginButtonClick = useCallback(() => {
    navigate("/auth/login")
  }, [navigate]);

  const onSignUpContainerClick = useCallback(() => {
    navigate("/auth/signup")
  }, [navigate]);

  const [status, setStatus] = useState<boolean>(true);
  const [notificationCount, setNotificationCount] = useState(1);


  return (
    <div className="headerBar">
      <div className="logo">
        <img src="/Logo.png" alt="" />
      </div>
      <div className="leftContainer">
        <div className="searchbar">
          <button className="searchicon">
            <img src="/icons/searchiconbar.svg" alt="" />
          </button>
          <input type="text" placeholder="Search something!" spellCheck='false'/>
          <div className="verticaldotline"></div>
          <button className="filter">
            <img src="/icons/filter.svg" alt="" />
          </button>
        </div>
        <div className="auth">
          { status? 
          (
            <div className="userThings">
              <div className="notificationIcon">
                <Badge color="error" badgeContent={notificationCount} max={99} anchorOrigin={{vertical:"top", horizontal: "right"}}>
                  <img src="/icons/messagetext.svg" alt="" />
                </Badge>
              </div>
              <div className="avatar">
                <img src="/wallpaper/test-avatar.png" alt="avatar" />
              </div>
            </div>
          ) : (
            <div className="authButton">
              <Button
                variant="contained"
                onClick={onLoginButtonClick}
                sx={{
                  '&.MuiButton-contained': {
                    backgroundColor: '#1b6fa8', // Màu nền của button
                    color: '#fff', // Màu chữ của button
                    '&:hover': {
                      backgroundColor: '#4296cf', // Màu nền khi hover
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
                    backgroundColor: 'transparent', // Nền trong suốt
                    color: '#1F1F1F', // Màu chữ của button
                    border: '1px solid #1F1F1F',// Viền của button
                    '&:hover': {
                      backgroundColor: '#f0f0f0', // Màu nền khi hover
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
  )
}

export default HeaderBar