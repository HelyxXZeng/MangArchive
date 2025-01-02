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
  if (!time) return "Invalid Date"; // Kiểm tra time có giá trị hay không

  try {
    const messageDate = new Date(time); // Parse time thành Date
    if (isNaN(messageDate.getTime())) throw new Error(); // Kiểm tra date có hợp lệ không

    // Cộng thêm 7 giờ
    messageDate.setHours(messageDate.getHours() + 7);

    const currentDate = new Date();
    const isSameDay =
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getDate() === currentDate.getDate();

    // Định dạng thời gian
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
