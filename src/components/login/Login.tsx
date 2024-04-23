import { FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import "./login.scss";

const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLoginButtonClick = useCallback(() => {
    // Xử lý logic đăng nhập
  }, []);

  const onGoogleLoginContainerClick = useCallback(() => {
    // Xử lý đăng nhập bằng Google
  }, []);

  const onDontHaveAnClick = useCallback(() => {
    navigate("/homepagesignin");
  }, [navigate]);

  const onGoBackToClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onLogoContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="main-area">
    <div className="main-area-child" />
    <div className="login-section">
      <div className="login-section-child" />
      <div className="welcome-content">
        <h1 className="welcome-back">
          <span>{`Welcome `}</span>
          <span className="back">back</span>
          <span>!</span>
        </h1>
        <div className="description">
          <div className="slogan">
            Discover manga, manhua and manhwa, track your progress and join
            the social network! Have fun!
          </div>
        </div>
      </div>
      <div className="login-form-container">
        <TextField
          className="username-input-field"
          color="primary"
          placeholder="Email"
          variant="filled"
          type="email"
          sx={{ "& .MuiInputBase-root": { height: "50px" } }}
        />
      </div>
      <div className="login-options">
        <div className="login-area">
          <div className="login-button">
            <TextField
              className="password-input-field"
              placeholder="Password"
              variant="outlined"
              type="password"
              InputProps={{
                endAdornment: (
                  <img
                    width="16px"
                    height="16px"
                    src="/iconsaxbulklock1.svg"
                  />
                ),
              }}
              // sx={{
              //   "& fieldset": { borderColor: "rgba(31, 31, 31, 0.5)" },
              //   "& .MuiInputBase-root": {
              //     height: "50px",
              //     backgroundColor: "#fafcfc",
              //     paddingRight: "11px",
              //     borderRadius: "10px",
              //     fontSize: "12px",
              //   },
              //   "& .MuiInputBase-input": { color: "#1f1f1f" },
              // }}
            />
            <div className="login-options1">
              <div className="remember-me-button">
                <input className="checkbox" type="checkbox" />
                <div className="remember-me">Remember me</div>
              </div>
              <b className="recovery-password">Recovery password</b>
            </div>
            <button className="login-button1" onClick={onLoginButtonClick}>
              <div className="login-button-child" />
              <b className="log-in" data-scroll-to="logInText">
                Log in
              </b>
            </button>
            <div
              className="google-login"
              onClick={onGoogleLoginContainerClick}
            >
              <div className="google-login-child" />
              <img className="google-icon" alt="" src="/google@2x.png" />
              <div className="log-in-with-google-wrapper">
                <div className="log-in-with">Log in with Google</div>
              </div>
            </div>
            <div className="sign-up">
              <div
                className="dont-have-an-container"
                onClick={onDontHaveAnClick}
              >
                <span className="dont-have-an">{`Don’t have an account? `}</span>
                <b className="sign-up1">Sign up</b>
              </div>
            </div>
          </div>
          <div className="homepage-button-area">
            <div className="go-back-to-container" onClick={onGoBackToClick}>
              <span className="go-back-to">{`Go back to `}</span>
              <b className="home-page">home page</b>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="logo" onClick={onLogoContainerClick}>
      <h1 className="mangarchive"> MangArchive</h1>
    </div>
  </div>
);
};

export default Login;
