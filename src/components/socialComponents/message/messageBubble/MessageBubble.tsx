import { Avatar, IconButton } from "@mui/material";
import "./messageBubble.scss";
import { useEffect, useState } from "react";
import { getMessageImage } from "../../../../api/messageAPI";
import { phraseImageUrl } from "../../../../utils/imageLinkPhraser";
import ConfirmDeleteModal from "../../../modal/confirmDeleteModal/ConfirmDeleteModal";

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
  const { id, avatar, text, isDeleted, isMine = false, time } = props;
  const [messageImages, setMessageImages] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  // console.log(isDeleted);
  useEffect(() => {
    const fetchMessageImage = async () => {
      try {
        if (id && !isDeleted) {
          // Chỉ fetch nếu không bị xóa
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Ngủ 1 giây
          const data = await getMessageImage(id);
          const imageUrl = phraseImageUrl(data);
          setMessageImages(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching message image:", error);
      }
    };
    fetchMessageImage();
  }, [id, isDeleted, text]);

  // useEffect(() => {
  //   // console.log(id, text, time);
  //   // if (id) {
  //   //   getMessageImage(id)
  //   //     .then((res) => {
  //   //       console.log("Image response:", res, id);
  //   //     })
  //   //     .catch((err) => console.error(err));
  //   // }
  // }, [id]);

  return (
    <div className={`messageBubbleContainer ${isMine ? "isMine" : ""}`}>
      {!isMine && <Avatar src={avatar ? avatar : ""} alt="Avatar" />}
      <div className="hoverContent">
        <div className="none"></div>
        {isMine && !isDeleted && (
          <div className="deleteOption">
            <IconButton onClick={handleOpen} className="icon-button">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="trash-icon"
              >
                <path
                  d="M20.9997 6.73046C20.9797 6.73046 20.9497 6.73046 20.9197 6.73046C15.6297 6.20046 10.3497 6.00046 5.11967 6.53046L3.07967 6.73046C2.65967 6.77046 2.28967 6.47046 2.24967 6.05046C2.20967 5.63046 2.50967 5.27046 2.91967 5.23046L4.95967 5.03046C10.2797 4.49046 15.6697 4.70046 21.0697 5.23046C21.4797 5.27046 21.7797 5.64046 21.7397 6.05046C21.7097 6.44046 21.3797 6.73046 20.9997 6.73046Z"
                  fill="currentColor"
                />
                <path
                  d="M8.50074 5.72C8.46074 5.72 8.42074 5.72 8.37074 5.71C7.97074 5.64 7.69074 5.25 7.76074 4.85L7.98074 3.54C8.14074 2.58 8.36074 1.25 10.6907 1.25H13.3107C15.6507 1.25 15.8707 2.63 16.0207 3.55L16.2407 4.85C16.3107 5.26 16.0307 5.65 15.6307 5.71C15.2207 5.78 14.8307 5.5 14.7707 5.1L14.5507 3.8C14.4107 2.93 14.3807 2.76 13.3207 2.76H10.7007C9.64074 2.76 9.62074 2.9 9.47074 3.79L9.24074 5.09C9.18074 5.46 8.86074 5.72 8.50074 5.72Z"
                  fill="currentColor"
                />
                <path
                  d="M15.2104 22.7515H8.79039C5.30039 22.7515 5.16039 20.8215 5.05039 19.2615L4.40039 9.19154C4.37039 8.78154 4.69039 8.42154 5.10039 8.39154C5.52039 8.37154 5.87039 8.68154 5.90039 9.09154L6.55039 19.1615C6.66039 20.6815 6.70039 21.2515 8.79039 21.2515H15.2104C17.3104 21.2515 17.3504 20.6815 17.4504 19.1615L18.1004 9.09154C18.1304 8.68154 18.4904 8.37154 18.9004 8.39154C19.3104 8.42154 19.6304 8.77154 19.6004 9.19154L18.9504 19.2615C18.8404 20.8215 18.7004 22.7515 15.2104 22.7515Z"
                  fill="currentColor"
                />
                <path
                  d="M13.6601 17.25H10.3301C9.92008 17.25 9.58008 16.91 9.58008 16.5C9.58008 16.09 9.92008 15.75 10.3301 15.75H13.6601C14.0701 15.75 14.4101 16.09 14.4101 16.5C14.4101 16.91 14.0701 17.25 13.6601 17.25Z"
                  fill="currentColor"
                />
                <path
                  d="M14.5 13.25H9.5C9.09 13.25 8.75 12.91 8.75 12.5C8.75 12.09 9.09 11.75 9.5 11.75H14.5C14.91 11.75 15.25 12.09 15.25 12.5C15.25 12.91 14.91 13.25 14.5 13.25Z"
                  fill="currentColor"
                />
              </svg>
            </IconButton>
            <ConfirmDeleteModal
              open={isModalOpen}
              handleClose={handleClose}
              messageId={id!}
            />
          </div>
        )}
        {time && isMine && <div className="time">{formatTime(time)}</div>}
      </div>
      <div className="messageContentWrapper">
        {text &&
          text.trim() !== "" &&
          (isMine ? (
            <div className="bubbleText isMine">{text}</div>
          ) : (
            <div className="bubbleText isTheir">{text}</div>
          ))}
        {!isDeleted && messageImages && (
          <div className="messageImage">
            <img src={messageImages} alt="Image of message" loading="lazy" />
          </div>
        )}
      </div>
      <div className="hoverContentc">
        {time && !isMine && <span className="time">{formatTime(time)}</span>}
      </div>
      {isMine && <Avatar src={avatar ? avatar : ""} alt="Avatar" />}
    </div>
  );
};

export default MessageBubble;
