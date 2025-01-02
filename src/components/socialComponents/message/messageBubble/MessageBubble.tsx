import { Avatar } from "@mui/material";
import "./messageBubble.scss";
import { useEffect, useState } from "react";
import { getMessageImage } from "../../../../api/messageAPI";
import { phraseImageUrl } from "../../../../utils/imageLinkPhraser";

interface BubbleProps {
  id?: number;
  avatar?: string;
  text?: string;
  isDeleted?: boolean;
  isMine?: boolean;
  time?: string; // Thời gian được truyền vào dưới dạng ISO string
}

const formatTime = (time: string): string => {
  const messageDate = new Date(time);
  const currentDate = new Date();

  // Kiểm tra cùng ngày hay không
  const isSameDay =
    messageDate.getFullYear() === currentDate.getFullYear() &&
    messageDate.getMonth() === currentDate.getMonth() &&
    messageDate.getDate() === currentDate.getDate();

  if (isSameDay) {
    // Cùng ngày -> Hiển thị giờ:phút:giây
    return messageDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } else {
    // Khác ngày -> Hiển thị ngày/tháng/năm giờ:phút
    return messageDate.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

const MessageBubble = (props: BubbleProps) => {
  const { id, avatar, text, isMine = false, time } = props;
  const [messageImages, setMessageImages] = useState<string>("");

  useEffect(() => {
    const fetchMessageImage = async () => {
      try {
        if (id) {
          const data = await getMessageImage(id);
          const imageUrl = phraseImageUrl(data);
          setMessageImages(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching message image:", error);
      }
    };
    fetchMessageImage();
  }, [id]);

  return (
    <div className={`messageBubbleContainer ${isMine ? "isMine" : ""}`}>
      {!isMine && <Avatar src={avatar ? avatar : ""} alt="Avatar" />}
      {time && isMine && <span className="time">{formatTime(time)}</span>}
      <div className="messageContentWrapper">
        {text &&
          text.trim() !== "" &&
          (isMine ? (
            <div className="bubbleText isMine">{text}</div>
          ) : (
            <div className="bubbleText isTheir">{text}</div>
          ))}
        {messageImages && (
          <div className="messageImage">
            <img src={messageImages} alt="Image of message" loading="lazy" />
          </div>
        )}
      </div>
      {time && !isMine && <span className="time">{formatTime(time)}</span>}
      {isMine && <Avatar src={avatar ? avatar : ""} alt="Avatar" />}
    </div>
  );
};

export default MessageBubble;
