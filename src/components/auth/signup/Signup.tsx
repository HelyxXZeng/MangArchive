import { FunctionComponent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import "./signup.scss";
import { supabase } from "../../../utils/supabase";
import { Turnstile } from "@marsidev/react-turnstile";
import { useTranslation } from "react-i18next";
import axios from "axios";

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
  const [captchaToken, setCaptchaToken] = useState("");
  const { t } = useTranslation("", { keyPrefix: "signup" });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSignupButtonClick = useCallback(async () => {
    let validationErrors = {
      email: "",
      username: "",
      password: "",
      checkPassword: "",
    };
    if (!email) {
      validationErrors.email = t("emailError.empty");
    } else if (!validateEmail(email)) {
      validationErrors.email = t("emailError.invalid");
    }

    if (!username) {
      validationErrors.username = t("usernameError.empty");
    } else if (username.includes(" ")) {
      validationErrors.username = t("usernameError.whitespace");
    }

    if (!password) {
      validationErrors.password = t("passwordError.empty");
    }

    if (!checkPassword) {
      validationErrors.checkPassword = t("passwordError.empty");
    } else if (password !== checkPassword) {
      validationErrors.checkPassword = t("passwordError.mismatch");
    }

    setErrors(validationErrors);
    if (Object.values(validationErrors).some((error) => error !== "")) return;
    const { data } = await axios.get(
      "https://test.alse.workers.dev/?token=" + captchaToken
    );

    if (!data.success) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: t("captchaError"),
        password: t("captchaError"),
        checkPassword: t("captchaError"),
        username: t("captchaError"),
      }));
      return;
    }
    try {
      let { data, error: rpcError } = await supabase.rpc("register_user", {
        p_birthdate: "2000-01-01",
        p_email: email,
        p_name: username,
        p_password: password,
        p_phone: "0",
        p_username: username,
      });

      if (rpcError) {
        console.error(rpcError);
        throw rpcError;
      } else {
        if (data === 0) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: t("emailError.exists"),
            username: t("usernameError.exists"),
          }));
        } else if (data === -1) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: t("emailError.exists"),
          }));
        } else if (data === -2) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: t("usernameError.exists"),
          }));
        } else {
          const {
            data: { session },
            error,
          } = await supabase.auth.signUp({
            email: email,
            password: password,
          });
          if (!session) console.log(t("signupError.emailVerification"));
          if (error) {
            console.log(error, " - 29");
            throw error;
          } else {
            navigate("/", { replace: true });
          }
        }
      }
    } catch (err) {
      console.error("Error signing up:", err);
    }
  }, [email, username, password, checkPassword, navigate, t]);

  const onGoogleLoginContainerClick = useCallback(() => {
    alert(t("supportFeature"));
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
            <span>{t("welcome")}</span>
            <span>!</span>
          </h1>
          <div className="description">
            <div className="slogan">{t("slogan")}</div>
          </div>
        </div>
        <div className="loginFrame">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSignupButtonClick();
            }}
          >
            <div className="inputContainer">
              <TextField
                className="username-input-field"
                color="primary"
                placeholder={t("emailPlaceholder")}
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
                placeholder={t("usernamePlaceholder")}
                variant="outlined"
                type="text"
                onChange={(event) => {
                  setUsername(event.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    username: "",
                  }));
                }}
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                className="password-input-field"
                placeholder={t("passwordPlaceholder")}
                variant="outlined"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: "",
                  }));
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
                placeholder={t("retypePasswordPlaceholder")}
                variant="outlined"
                onChange={(event) => {
                  setCheckPassword(event.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    checkPassword: "",
                  }));
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
              <Turnstile
                siteKey="0x4AAAAAAA0okrGozsUNzGd-"
                onSuccess={(token) => setCaptchaToken(token)}
                onError={() => setCaptchaToken("")}
                options={{ theme: "light" }}
                lang="auto"
              />
            </div>
            <div className="buttonOption">
              <Button
                variant="contained"
                type="submit"
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
                {t("signupButton")}
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
                  <div className="log-in-with">{t("googleSignup")}</div>
                </div>
              </Button>
            </div>
            <div className="otherOption">
              <div className="signup">
                {t("alreadyHaveAccount")}
                <span onClick={onLoginClick}>
                  <b> {t("loginHere")}</b>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
