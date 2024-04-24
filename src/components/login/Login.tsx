import { FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import "./login.scss";

const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  //const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const onLoginButtonClick = useCallback(() => {
    // Xử lý logic đăng nhập
  }, []);

  const onGoogleLoginContainerClick = useCallback(() => {
    // Xử lý đăng nhập bằng Google
  }, []);

  const onSignUpClick = useCallback(() => {
    navigate("/auth/signup");
  }, [navigate]);

  // const onGoBackToClick = useCallback(() => {
  //   navigate("/");
  // }, [navigate]);

  const onLogoContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
  <div className="mainFrame">
    <div className="heading">
      <div className="logoContent" onClick={onLogoContainerClick}>
        <h1>MangArchive</h1>
      </div>
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
      <div className="loginFrame">  
        <div className="inputContainer">
          <TextField
                className="username-input-field"
                color="primary"
                placeholder="Email or Username"
                variant="outlined"
                type="email"
          />
          <TextField
                    className="password-input-field"
                    placeholder="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    //onChange={}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                           // onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? (<img src="/icons/eye.svg"/>) : (<img src="/icons/eye-slash.svg"/>)}
                          </IconButton>
                        </InputAdornment>
                      ),
          }}/>
          <div className="loginOption">
            <div className="remember-me-button">
              <input className="checkbox" type="checkbox" />
              <div className="remember-me">Remember me</div>
            </div>
            <b className="recovery-password">Recovery password</b>
          </div>
        </div>
        <div className="buttonOption">
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
            onClick={onGoogleLoginContainerClick}
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
            <img className="google-icon" alt="" src="/icons/logo_google_icon.png" />
            <div className="log-in-with-google-wrapper">
              <div className="log-in-with">Log in with Google</div>
            </div>
          </Button>
        </div>
        <div className="otherOption">
          <div className="signup">
            Don't have an account? 
            <span onClick={onSignUpClick}><b> Sign up</b></span>        
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Login;
