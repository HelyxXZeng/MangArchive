import React, { FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import "./login.scss";
import { supabase } from "../../../utils/supabase";

const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onLoginButtonClick = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({ email: "", password: "" }); // Clear previous errors

      if (!email) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email or Username is required",
        }));
      }
      if (!password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password is required",
        }));
      }

      if (!email || !password) return;

      try {
        const isEmail = email.includes("@");

        if (isEmail) {
          const response = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });
          if (response.error) throw response.error;

          if (response.data.user) {
            navigate(`/`, { replace: true });
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Invalid email or password",
              password: "Invalid email or password",
            }));
          }
        } else {
          const { data, error } = await supabase
            .from("User")
            .select("email")
            .eq("username", email);

          if (error) throw error;

          if (data && data.length > 0) {
            const response = await supabase.auth.signInWithPassword({
              email: data[0].email,
              password: password,
            });

            if (response.error) throw response.error;

            if (response.data.user) {
              navigate(`/`, { replace: true });
            } else {
              setErrors((prevErrors) => ({
                ...prevErrors,
                email: "Invalid username or password",
              }));
            }
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Username does not exist",
            }));
          }
        }
      } catch (error) {
        console.error("Error signing in:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Invalid username or password",
          password: "Invalid username or password",
        }));
      }
    },
    [email, password, navigate]
  );

  const onGoogleLoginContainerClick = useCallback(() => {
    alert("Tính năng hiện chưa được hỗ trợ");
  }, []);

  const onSignUpClick = useCallback(() => {
    navigate("/auth/signup");
  }, [navigate]);

  const onLogoContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        onLoginButtonClick(e as unknown as React.FormEvent);
      }
    },
    [onLoginButtonClick]
  );

  return (
    <div className="mainFrame" onKeyDown={handleKeyDown} tabIndex={0}>
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
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
              }}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              className="password-input-field"
              placeholder="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? (
                        <img src="/icons/eye.svg" alt="show" />
                      ) : (
                        <img src="/icons/eye-slash.svg" alt="hide" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password}
            />
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
              onClick={onGoogleLoginContainerClick}
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
              <img
                className="google-icon"
                alt=""
                src="/icons/logo_google_icon.png"
              />
              <div className="log-in-with-google-wrapper">
                <div className="log-in-with">Log in with Google</div>
              </div>
            </Button>
          </div>
          <div className="otherOption">
            <div className="signup">
              Don't have an account?
              <span onClick={onSignUpClick}>
                <b> Sign up</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
