import { FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import "./signup.scss";
import { supabase } from "../../../utils/supabase";

const Signup: FunctionComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  //const handleMouseDownPassword = () => setShowPassword(!showPassword);



  const onSignupButtonClick = useCallback(async () => {
    console.log(password,checkPassword,email,username)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      console.log(error," - 29")
      throw error;
    }
    else {
      let { data, error } = await supabase
        .rpc('register_user', {
          p_birthdate: "2000-01-01",
          p_email: email,
          p_name: username,
          p_password: password,
          p_phone: "0",
          p_username: username
        })
      if (error) console.error(error)
      else {
        navigate("/", { replace: true })
      }

    }
    if (!session) console.log('Please check your inbox for email verification!')

  }, []);

  const onGoogleLoginContainerClick = useCallback(() => {
    // Xử lý đăng nhập bằng Google
  }, []);

  const onLoginClick = useCallback(() => {
    navigate("/auth/login");
  }, [navigate]);


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
            <span>{`Welcome`}</span>
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
              placeholder="Email"
              variant="outlined"
              type="email"
              onChange={(event) => { setEmail(event.target.value) }}
            />
            <TextField
              className="username-input-field"
              color="primary"
              placeholder="Username (không dấu, tối đa 32 ký tự)"
              variant="outlined"
              type="text"
              onChange={(event) => { setUsername(event.target.value) }}
            />
            <TextField
              className="password-input-field"
              placeholder="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              onChange={(event) => { setPassword(event.target.value) }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (<img src="/icons/eye.svg" />) : (<img src="/icons/eye-slash.svg" />)}
                    </IconButton>
                  </InputAdornment>
                ),
              }} />
            <TextField
              className="password-input-field"
              placeholder="Nhập lại Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              onChange={(event) => { setCheckPassword(event.target.value) }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (<img src="/icons/eye.svg" />) : (<img src="/icons/eye-slash.svg" />)}
                    </IconButton>
                  </InputAdornment>
                ),
              }} 
              />
          </div>
          <div className="buttonOption">
            <Button
              variant="contained"
              onClick={onSignupButtonClick}
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
              Sign up
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
                <div className="log-in-with">Sign in with Google</div>
              </div>
            </Button>
          </div>
          <div className="otherOption">
            <div className="signup">
              Already have an account?
              <span onClick={onLoginClick}><b> Login</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
