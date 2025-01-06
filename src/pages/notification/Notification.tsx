import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  getUnreadMessageNotification,
  setReadNotification,
} from "../../api/notificationAPI";
import useCheckSession from "../../hooks/session";
import { fetchUserIdByEmail } from "../../api/userAPI";
import { Button } from "@mui/material";
import "./notification.scss";
import NotificationCard from "../../components/notificationCard/NotificationCard";

const Notification = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("", { keyPrefix: "notification" });
  const handleBack = () => navigate(-1);
  const [notifList, setNotifList] = useState<any[]>([]);
  const [userID, setUserID] = useState<number>();

  const session = useCheckSession();

  // Fetch User ID by email
  useEffect(() => {
    const getUserID = async () => {
      if (session && session.user) {
        try {
          const userId = await fetchUserIdByEmail(session.user.email);
          setUserID(userId);
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    getUserID();
  }, [session]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotificationList = async () => {
      if (userID) {
        try {
          const data = await getUnreadMessageNotification(userID);
          setNotifList(data);
          //   console.log(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotificationList();
  }, [userID]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Lọc các thông báo chưa đọc
      const unreadNotifications = notifList.filter((notif) => !notif.is_read);
      console.log(unreadNotifications.length);
      // Gửi request đánh dấu đã đọc cho từng thông báo
      await Promise.all(
        unreadNotifications.map((notif) => setReadNotification(notif.id))
      );

      // Cập nhật danh sách thông báo trong state
      setNotifList((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="notificationFrame">
      <section className="headernav">
        <button className="backbutton" onClick={handleBack} title={t("back")}>
          <img src="/icons/arrow-left.svg" alt={t("back")} />
        </button>
        <div className="headerInfo">
          <h2>{t("notification")}</h2>
        </div>
      </section>
      <section className="mainContent">
        <div className="optionbar">
          <Button
            variant="outlined"
            className="mark-all-read-button"
            onClick={markAllAsRead}
          >
            {t("mark_all_read")}
          </Button>
        </div>
        <div className="line"></div>
        {notifList.length > 0 ? (
          notifList.map((notif) => (
            <NotificationCard
              key={notif.id}
              id={notif.id}
              time={notif.time}
              is_read={notif.is_read}
              name={notif.name}
              content={notif.content}
              user={notif.user}
            />
          ))
        ) : (
          <p>{t("no_notifications")}</p>
        )}
      </section>
    </div>
  );
};

export default Notification;
