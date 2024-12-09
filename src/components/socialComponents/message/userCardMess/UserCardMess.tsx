import { Avatar } from "@mui/material";
import { useTranslation } from "react-i18next";
import useTimeAgo from "../../../../utils/timeCal"; // Import hàm tiện ích
import "./userCardMess.scss";

interface messProps {
  avatar?: string;
  name?: string;
  sender_id?: number;
  time?: string;
  isDelete: boolean;
  latestMessage: string;
  isActive: boolean; // Prop trạng thái active
  onClick: () => void; // Hàm xử lý click
}

const UserCardMess = (props: messProps) => {
  const { t } = useTranslation("", { keyPrefix: "message" });
  const timeAgo = useTimeAgo(props.time || ""); // Sử dụng hàm tiện ích để lấy thời gian "trước" trong từ điển
  // console.log(props.time, timeAgo);

  return (
    <div
      className={`messCardContainer ${props.isActive ? "active" : ""}`} // Thêm class active nếu true
      onClick={props.onClick} // Gọi hàm click khi click
    >
      <div className="avatarWrapper">
        <Avatar src={props.avatar! || ""} alt="avatar" />
      </div>
      <div className="leftInfor">
        <div className="upperInfor">
          <div className="senderName">{props.name}</div>
          <div className="latestDate">
            <span>{timeAgo}</span>
          </div>
        </div>
        <div className="latestMessage">
          {props.isDelete ? (
            <span>{t("deleted")}</span>
          ) : (
            <span>{props.latestMessage}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCardMess;
