import { Button, IconButton, MenuItem, Select } from "@mui/material";
import "./setting.scss";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import { useDispatch, useSelector } from "react-redux";
import { setLangState } from "../../reduxState/reducer/langReducer";
import i18n from "../../utils/i18next";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Setting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleBack = () => navigate(-1);
  const { langState } = useSelector((state: any) => state.langState);
  const { t } = useTranslation("", { keyPrefix: "setting" });
  useEffect(() => {
    const currentLang = localStorage.getItem("i18nextLng") || "vi";
    dispatch(setLangState(currentLang));
  }, []);
  const handleChangeLanguage = (event: any) => {
    const newLang = event.target.value;
    if (newLang && newLang !== langState) {
      dispatch(setLangState(newLang));
      i18n.changeLanguage(newLang.toLowerCase());
      localStorage.setItem("i18nextLng", newLang.toLowerCase());
    }
  };

  const handleAskAdmin = () => {
    window.open("https://forms.gle/AL1U8eWXCMFTtbkEA", "_blank");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="settingFrame">
      <div className="headernav">
        <button className="backbutton" onClick={handleBack}>
          <img src="/icons/arrow-left.svg" alt={t("setting-header")} />
        </button>
        <div className="headerInfo">
          <h2>{t("setting-header")}</h2>
        </div>
      </div>
      <h3>{t("general")}</h3>
      <div className="general">
        <div className="languageSelection">
          <span className="content">{t("language")}</span>
          <Select
            value={langState}
            onChange={handleChangeLanguage}
            sx={{
              fontFamily: "Lato, sans-serif",
              color: "#E7E9EA",
              backgroundColor: "#1f1f1f",
              height: "40px",
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#71767B",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ffffff",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#474A4D",
              },
              "& .MuiSelect-icon": {
                color: "#E7E9EA",
              },
            }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="vi">Tiếng Việt</MenuItem>
          </Select>
        </div>
      </div>
      <h3>{t("account")}</h3>
      <div className="account">
        <div className="status">
          <span className="content">{t("current-role")}:</span>
          <span className="role">User</span>
        </div>
        <div className="changeRoles">
          <span>
            {t("ask-admin")}
            <br />
            <span className="smalldescription">{t("cant-undon")}</span>
          </span>
          <Button className="clickhere" onClick={handleAskAdmin}>
            Click here
          </Button>
        </div>
        <div className="logout">
          <strong>{t("logout")}</strong>
          <IconButton className="logoutBtn" onClick={handleLogout}>
            <img src="/icons/logout.svg" alt={t("logout")} />
          </IconButton>
        </div>
      </div>
      <h3 className="danger">{t("danger-zone")}</h3>
      <div className="deleteAccount">
        <Button className="delete">{t("delete")}</Button>
      </div>
    </div>
  );
};

export default Setting;
