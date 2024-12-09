// Message.tsx
import { useEffect, useState } from "react";
import { getMessageSenders, getMessagesFromUser } from "../../api/messageAPI";
import UserCardMess from "../../components/socialComponents/message/userCardMess/UserCardMess"; // Import UserCardMess
import useCheckSession from "../../hooks/session";
import { fetchUserIdByEmail, fetchUserProfileImages } from "../../api/userAPI";
import { phraseImageUrl } from "../../utils/imageLinkPhraser";
import { useTranslation } from "react-i18next";
import "./message.scss";
import MessageBubble from "../../components/socialComponents/message/messageBubble/MessageBubble";
import { supabase } from "../../utils/supabase"; // Import Supabase client
import MessagetBox from "../../components/socialComponents/message/messageBox/messageBox";
import { setMessages } from "../../reduxState/reducer/messageReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxState/store";

interface Sender {
  sender_id: number;
  username: string;
  avatar_url: string;
  newest_message: string;
  message_time: string;
  is_deleted: boolean;
}

const Message = () => {
  const [senders, setSenders] = useState<Sender[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<number | null>(null);
  const [activeSenderId, setActiveSenderId] = useState<number | null>(null); // State active
  const [activeSenderAvatar, setActiveSenderAvatar] = useState<string>(""); // State active
  const [activeSenderName, setActiveSenderName] = useState<string>(""); // State active
  const session = useCheckSession();
  const { t } = useTranslation("", { keyPrefix: "message-page" });
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.message.messages);
  const [profileImages, setProfileImages] = useState<{
    avatar: string;
  } | null>(null);

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

  useEffect(() => {
    const getProfileImages = async () => {
      if (userID) {
        try {
          const { data, error } = await fetchUserProfileImages(
            userID.toString()
          );
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
  }, [userID]);

  useEffect(() => {
    const fetchSenders = async () => {
      if (userID) {
        try {
          const data = await getMessageSenders(userID);
          setSenders(data || []);
          console.log(data);
          if (data.length > 0) {
            const newestSender = data.reduce((prev: any, current: any) =>
              new Date(prev.message_time) > new Date(current.message_time)
                ? prev
                : current
            );
            console.log(newestSender);
            setActiveSenderId(newestSender.sender_id);
            setActiveSenderAvatar(newestSender.avatar_url);
            setActiveSenderName(newestSender.username);
            const messagesData = await getMessagesFromUser(
              newestSender.sender_id,
              userID
            );
            dispatch(setMessages(messagesData || []));
          }
        } catch (err: any) {
          setError(err.message);
        }
      }
    };

    fetchSenders();
  }, [userID, dispatch]);

  const handleSenderClick = async (sender_id: number) => {
    setActiveSenderId(sender_id); // Cập nhật trạng thái active
    try {
      const data = await getMessagesFromUser(sender_id, userID!); // Lấy tin nhắn từ RPC
      dispatch(setMessages(data || [])); // Cập nhật danh sách tin nhắn
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const reloadChat = async () => {
    if (userID) {
      try {
        // Lấy danh sách senders
        const data = await getMessageSenders(userID);
        setSenders(data || []);

        if (data.length > 0) {
          // Lấy người gửi mới nhất
          const newestSender = data.reduce((prev: any, current: any) =>
            new Date(prev.message_time) > new Date(current.message_time)
              ? prev
              : current
          );

          setActiveSenderId(newestSender.sender_id);
          setActiveSenderAvatar(newestSender.avatar_url);
          setActiveSenderName(newestSender.username);

          // Lấy tin nhắn của sender mới nhất
          const messagesData = await getMessagesFromUser(
            newestSender.sender_id,
            userID
          );
          dispatch(setMessages(messagesData));
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  // Real-time listener để theo dõi tin nhắn mới
  useEffect(() => {
    const subscription = supabase
      .channel("Messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Messages" },
        async () => {
          // Gọi reload để đảm bảo cập nhật toàn bộ giao diện
          await reloadChat();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userID, dispatch]);

  return (
    <div className="messagePageContainer">
      <div className="mainMessageFrame">
        <div className="nameBar">{activeSenderName}</div>
        <div className="renderlist">
          {[...messages].reverse().map((message, index) => (
            <MessageBubble
              avatar={phraseImageUrl(
                message.sender_id === userID
                  ? profileImages?.avatar!
                  : activeSenderAvatar!
              )}
              key={`${message.message_id}-${index}`} // Đảm bảo key là duy nhất
              text={
                message.is_deleted
                  ? "Tin nhắn đã bị xóa"
                  : message.message_content
              }
              isMine={message.sender_id === userID}
            />
          ))}
        </div>
        <div className="messageSend">
          <MessagetBox receiver_id={activeSenderId!} />
        </div>
      </div>
      <div className="rightSection">
        <div className="senderList">
          <h2>{t("message")}</h2>
          {error && <div className="error">{error}</div>}
          <div className="senderTable">
            {senders.reverse().map((sender) => (
              <UserCardMess
                key={sender.sender_id}
                avatar={phraseImageUrl(sender.avatar_url)}
                name={sender.username}
                sender_id={sender.sender_id}
                time={sender.message_time}
                isDelete={sender.is_deleted}
                latestMessage={sender.newest_message}
                isActive={sender.sender_id === activeSenderId} // Truyền trạng thái active
                onClick={() => handleSenderClick(sender.sender_id)} // Xử lý click
              />
            ))}
          </div>
          <div className="see-more">{t("see_more")}</div>
        </div>
        <div className="imageHistory">{/* Khung lịch sử hình ảnh */}</div>
      </div>
    </div>
  );
};

export default Message;
