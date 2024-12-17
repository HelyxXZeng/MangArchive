import React, { FunctionComponent, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { supabase } from "../../../utils/supabase";
import axios from "axios";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useTranslation } from "react-i18next";
import "./login.scss";
import { useDispatch } from "react-redux";
import { setSessionState } from "../../../reduxState/reducer/sessionReducer";
import { fetchEmailByUsername } from "../../../api/userAPI";

const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispact = useDispatch();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [captchaToken, setCaptchaToken] = useState("");
  const { t } = useTranslation("", { keyPrefix: "login" });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const resetCaptcha = () => {
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  };

  const onLoginButtonClick = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({ email: "", password: "" }); // Clear previous errors

      if (!email) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: t("emailrequire"),
        }));
      }
      if (!password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: t("passRequire"),
        }));
      }

      if (!email || !password) return;
      if (!captchaToken) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: t("captchaError"),
          password: t("captchaError"),
        }));
        resetCaptcha();
        return;
      }

      try {
        const { data } = await axios.get(
          `https://test.alse.workers.dev/?token=${captchaToken}`
        );

        if (!data.success) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: t("captchaError"),
            password: t("captchaError"),
          }));
          resetCaptcha();
          return;
        }

        const isEmail = email.includes("@");

        if (isEmail) {
          const response = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

          if (response.error) throw response.error;
          if (response.data.user) {
            dispact(setSessionState(false));
            navigate(`/`, { replace: true });
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: t("invalidEmailPassword"),
              password: t("invalidEmailPassword"),
            }));
            resetCaptcha();
          }
        } else {
          const udata = await fetchEmailByUsername(email);

          if (udata && udata.length > 0) {
            const response = await supabase.auth.signInWithPassword({
              email: udata,
              password: password,
            });

            if (response.error) throw response.error;

            if (response.data.user) {
              dispact(setSessionState(false));
              console.log(response.data);
              navigate(`/`, { replace: true });
            } else {
              setErrors((prevErrors) => ({
                ...prevErrors,
                email: t("invalidUsernamePassword"),
              }));
              resetCaptcha();
            }
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: t("existUsername"),
            }));
            resetCaptcha();
          }
        }
      } catch (error) {
        console.error("Error signing in:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: t("invalidUsernamePassword"),
          password: t("invalidUsernamePassword"),
        }));
        resetCaptcha();
      }
    },
    [email, password, captchaToken, navigate, t]
  );

  const onGoogleLoginContainerClick = useCallback(() => {
    alert(t("supportFeature"));
  }, [t]);

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
            <span>{t("welcome")} </span>
            <span className="back">{t("back")}</span>
            <span>!</span>
          </h1>
          <div className="description">
            <div className="slogan">{t("slogan")}</div>
          </div>
        </div>
        <div className="loginFrame">
          <div className="inputContainer">
            <TextField
              className="username-input-field"
              color="primary"
              placeholder={t("emailPlaceholder")}
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
              placeholder={t("passwordPlaceholder")}
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
            <Turnstile
              siteKey="0x4AAAAAAA0okrGozsUNzGd-"
              onSuccess={(token) => setCaptchaToken(token)}
              onError={() => setCaptchaToken("")}
              options={{ theme: "light" }}
              lang="auto"
              ref={turnstileRef}
            />
            <div className="loginOption">
              <div className="remember-me-button">
                <input className="checkbox" type="checkbox" />
                <div className="remember-me">{t("rememberMe")}</div>
              </div>
              <b className="recovery-password">{t("recoveryPassword")}</b>
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
              {t("login")}
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
                <div className="log-in-with">{t("loginWithGoogle")}</div>
              </div>
            </Button>
          </div>
          <div className="otherOption">
            <div className="signup">
              {t("dontHaveAccount")}
              <span onClick={onSignUpClick}>
                <b> {t("signUp")}</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
