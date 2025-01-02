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
}

const MessageBubble = (props: BubbleProps) => {
  const { id, avatar, text, isMine = false } = props; // Set default value for isMine
  const [messageImages, setMessageImages] = useState<string>("");

  useEffect(() => {
    const fetchMessageImage = async () => {
      try {
        if (id) {
          const data = await getMessageImage(id);
          // console.log(data, id);
          const imageUrl = phraseImageUrl(data);
          setMessageImages(imageUrl);
        }
      } catch (error) {}
    };
    fetchMessageImage();
    console.log(id, messageImages);
  }, [id]);
  // if (!text || text.trim() === "") return null;
  return (
    <div className={`messageBubbleContainer ${isMine ? "isMine" : ""}`}>
      {/* Chỉ hiển thị bubbleText nếu text không rỗng */}
      {text &&
        text.trim() !== "" &&
        (isMine ? (
          <div className="bubbleText isMine">{text}</div>
        ) : (
          <div className="bubbleText isTheir">{text}</div>
        ))}
      {/* Hiển thị Avatar */}
      {messageImages && (
        <div className="messageImage">
          <img src={messageImages} alt="Image of message" />
        </div>
      )}
      {isMine ? (
        <Avatar src={avatar ? avatar : ""} alt="Avatar" />
      ) : (
        <Avatar src={avatar ? avatar : ""} alt="Avatar" />
      )}
      {/* Hình ảnh tin nhắn */}
    </div>
  );
};

export default MessageBubble;
