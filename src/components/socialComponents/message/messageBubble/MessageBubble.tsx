import { Avatar } from "@mui/material";
import "./messageBubble.scss";
interface BubbleProps {
  avatar?: string;
  text?: string;
  isDeleted?: boolean;
  isMine?: boolean;
}

const MessageBubble = (props: BubbleProps) => {
  const { avatar, text, isMine = false } = props; // Set default value for isMine

  return (
    <div className={`messageBubbleContainer ${isMine ? "isMine" : ""}`}>
      {isMine ? (
        <>
          <div className="bubbleText isMine">{text}</div>
          <Avatar src={avatar ? avatar : ""} alt="Avatar" />
        </>
      ) : (
        <>
          <Avatar src={avatar ? avatar : ""} alt="Avatar" />
          <div className="bubbleText isTheir">{text}</div>
        </>
      )}
    </div>
  );
};

export default MessageBubble;
