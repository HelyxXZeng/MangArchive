import { Avatar, Button } from "@mui/material";
import "./postSection.scss";
import { NavLink } from "react-router-dom"; // Ensure you've imported NavLink
import PostModal from "../../../modal/postModal/PostModal";
import { useEffect, useState } from "react";
import useCheckSession from "../../../../hooks/session";
import {
  fetchUserIdByEmail,
  fetchUserProfileImages,
} from "../../../../api/userAPI";
import { phraseImageUrl } from "../../../../utils/imageLinkPhraser";
import { useTranslation } from "react-i18next";

interface Props {
  refreshList?: () => void;
  manga_id?: string;
  group_id?: string;
}

const PostSection = (prop: Props) => {
  const { t } = useTranslation("", { keyPrefix: "postSection" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const session = useCheckSession();
  const [realUserID, setRealUserID] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<{
    avatar: string;
  } | null>(null);

  useEffect(() => {
    const getUserID = async () => {
      if (session && session.user) {
        try {
          const userId = await fetchUserIdByEmail(session.user.email);
          setRealUserID(userId);
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    getUserID();
  }, [session]);

  useEffect(() => {
    const getProfileImages = async () => {
      if (realUserID) {
        try {
          const { data, error } = await fetchUserProfileImages(realUserID);
          if (error) console.error(error);
          if (data) {
            const avatar = phraseImageUrl(data[0].avatar_link);
            setProfileImages({
              avatar,
            });
          }
        } catch (error) {
          console.error("Error fetching profile images:", error);
        }
      }
    };

    getProfileImages();
  }, [realUserID]);
  // console.log(prop.manga_id)
  return (
    <div className="postSectionComponent">
      <div className="postpress">
        <div className="avatarContainer">
          <NavLink to="/profile/test">
            <Avatar
              className="Avatar"
              src={profileImages?.avatar}
              alt={t("avatarAlt")}
              sx={{ width: "40px", height: "40px" }}
            />
          </NavLink>
        </div>
        <div className="press">
          <Button className="click" variant="contained" onClick={handleOpen}>
            <span className="text">{t("promptText")}</span>
          </Button>
          <PostModal
            open={isModalOpen}
            handleClose={handleClose}
            refreshList={prop.refreshList}
            mangaid={prop.manga_id}
            group_id={prop.group_id}
          />
        </div>
      </div>
      <h4>{t("orText")}</h4>
      <div className="navHistory">
        <NavLink to="/history">
          <Button className="click" variant="contained">
            <span className="text">{t("suggestButtonText")}</span>
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default PostSection;
