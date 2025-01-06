import { useNavigate } from "react-router-dom";
import { setReadNotification } from "../../api/notificationAPI";
import "./notificationCard.scss";
import { useDispatch } from "react-redux";
import { subCount } from "../../reduxState/reducer/notificationReducer";

interface NotificationProps {
  id: number;
  time: string;
  is_read?: boolean;
  name: string;
  content: string;
  user?: number;
}
const formatTime = (time: string): string => {
  if (!time) return "Invalid Date";

  try {
    const messageDate = new Date(time);
    if (isNaN(messageDate.getTime())) throw new Error();

    // Add 7 hours
    messageDate.setHours(messageDate.getHours() + 7);

    const currentDate = new Date();
    const isSameDay =
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getDate() === currentDate.getDate();

    return isSameDay
      ? messageDate.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : messageDate.toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  } catch (error) {
    console.error("Invalid time format:", time);
    return "Invalid Date";
  }
};

const NotificationCard = (prop: NotificationProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = async () => {
    try {
      if (!prop.is_read) {
        await setReadNotification(prop.id); // Đánh dấu là đã đọc
        dispatch(subCount());
      }
      navigate("/chat/");
    } catch (error) {
      console.error("Failed to update notification as read:", error);
    }
  };

  return (
    <div className="notificationCardContainer" onClick={handleClick}>
      <div className="rightNof">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="nofIcon"
        >
          {/* SVG paths */}
        </svg>
        <div className="mainNof">
          <div className="nofHeader">
            <div className="nofName">{prop.name}</div>
            <div className="nofTime">{formatTime(prop.time)}</div>
          </div>
          <div className="nofContent">{prop.content}</div>
        </div>
      </div>

      <div className="leftNof">
        {!prop.is_read && <div className="circle"></div>}
      </div>
    </div>
  );
};

export default NotificationCard;
