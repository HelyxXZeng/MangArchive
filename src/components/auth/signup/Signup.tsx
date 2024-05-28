import React, { FunctionComponent, useCallback, useState } from "react";
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
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    checkPassword: "",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validateEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const checkDuplicate = async () => {
  //   const { data: duplicateUsers, error } = await supabase
  //     .from('User')
  //     .select('email, username')
  //     .or(`email.eq.${email}, username.eq.${username}`);

  //   if (error) {
  //     console.error(error);
  //     return;
  //   }

  //   if (duplicateUsers && duplicateUsers.length > 0) {
  //     duplicateUsers.forEach((user) => {
  //       if (user.email === email) {
  //         setErrors((prevErrors) => ({
  //           ...prevErrors,
  //           email: "Email already exists",
  //         }));
  //       }
  //       if (user.username === username) {
  //         setErrors((prevErrors) => ({
  //           ...prevErrors,
  //           username: "Username already exists",
  //         }));
  //       }
  //     });
  //   }
  //   return
  // };
  const onSignupButtonClick = useCallback(async () => {
    let validationErrors = {
      email: "",
      username: "",
      password: "",
      checkPassword: "",
    };
    // console.log("click")
    if (!email) {
      validationErrors.email = "Email không được để trống";
    } else if (!validateEmail(email)) {
      validationErrors.email = "Email không đúng định dạng";
    }

    if (!username) {
      validationErrors.username = "Username không được để trống";
    } else if (username.includes(" ")) {
      validationErrors.username = "Username không được chứa khoảng trắng";
    }

    if (!password) {
      validationErrors.password = "Password không được để trống";
    }

    if (!checkPassword) {
      validationErrors.checkPassword = "Nhập lại Password không được để trống";
    } else if (password !== checkPassword) {
      validationErrors.checkPassword = "Mật khẩu không khớp";
    }

    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }

    try {
      // console.log("sent");
      let { data, error: rpcError } = await supabase.rpc("register_user", {
        p_birthdate: "2000-01-01",
        p_email: email,
        p_name: username,
        p_password: password,
        p_phone: "0",
        p_username: username,
      });
      // console.log(data)
      if (rpcError) {
        console.error(rpcError);
        throw rpcError
      }
      else {
        if (data === 0) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email already exists",
            username: "Username already exists",
          }));
        } else if (data === -1) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email already exists",
          }));
        } else if (data === -2) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: "Username already exists",
          }));
        } else {
          const {
            data: { session },
            error,
          } = await supabase.auth.signUp({
            email: email,
            password: password,
          })
          if (!session) console.log("Please check your inbox for email verification!");
          if (error) {
            console.log(error, " - 29")
            throw error;
          }
          else { navigate("/", { replace: true }); }
        }
      }
    }
    catch (err) {
    console.error("Error signing up:", err);
  }
}, [email, username, password, checkPassword, navigate]);

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
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
            }}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            className="username-input-field"
            color="primary"
            placeholder="Username (không dấu, tối đa 32 ký tự)"
            variant="outlined"
            type="text"
            onChange={(event) => {
              setUsername(event.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
            }}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            className="password-input-field"
            placeholder="Password"
            variant="outlined"
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
            }}
            InputProps={{
              type: showPassword ? "text" : "password",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? (
                      <img src="/icons/eye.svg" alt="show password" />
                    ) : (
                      <img src="/icons/eye-slash.svg" alt="hide password" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            className="password-input-field"
            placeholder="Nhập lại Password"
            variant="outlined"
            onChange={(event) => {
              setCheckPassword(event.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, checkPassword: "" }));
            }}
            InputProps={{
              type: showPassword ? "text" : "password",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? (
                      <img src="/icons/eye.svg" alt="show password" />
                    ) : (
                      <img src="/icons/eye-slash.svg" alt="hide password" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!errors.checkPassword}
            helperText={errors.checkPassword}
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
