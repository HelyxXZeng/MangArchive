import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMessageSenders,
  getMessagesFromUser,
  markMessageAsRead,
} from "../../api/messageAPI";
import UserCardMess from "../../components/socialComponents/message/userCardMess/UserCardMess";
import useCheckSession from "../../hooks/session";
import { fetchUserIdByEmail, fetchUserProfileImages } from "../../api/userAPI";
import { phraseImageUrl } from "../../utils/imageLinkPhraser";
import { useTranslation } from "react-i18next";
import "./message.scss";
import MessageBubble from "../../components/socialComponents/message/messageBubble/MessageBubble";
import { supabase } from "../../utils/supabase";
import MessagetBox from "../../components/socialComponents/message/messageBox/messageBox";
import { setMessages } from "../../reduxState/reducer/messageReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxState/store";
import { decryptMessage } from "../../utils/cryptoAES";

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
  const [activeSenderAvatar, setActiveSenderAvatar] = useState<string>("");
  const [activeSenderName, setActiveSenderName] = useState<string>("");
  const { id } = useParams(); // Lấy sender_id từ URL
  const session = useCheckSession();
  const navigate = useNavigate();
  const { t } = useTranslation("", { keyPrefix: "message-page" });
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.message.messages);
  const [profileImages, setProfileImages] = useState<{
    avatar: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // useEffect(() => {
  //   if (!userID || !id) return;

  //   const setupKey = async () => {
  //     try {
  //       let storedPrivateKey = localStorage.getItem("privateKey") || "";
  //       let storedPublicKey = localStorage.getItem("publicKey") || "";

  //       // 📌 1️⃣ Nếu key trong Local Storage rỗng, cần lấy lại từ Supabase
  //       if (!storedPrivateKey.trim() || !storedPublicKey.trim()) {
  //         console.log("🔍 Private/Public Key bị rỗng, cần lấy lại...");

  //         // 📌 2️⃣ Kiểm tra trên Supabase
  //         const hasKey = await checkUserKey(userID);
  //         if (hasKey) {
  //           console.log("✅ User có private key trên Supabase!");
  //           storedPrivateKey = await getPrivateKey(userID);
  //           localStorage.setItem("privateKey", storedPrivateKey);
  //           dispatch(setKeys({ privateKey: storedPrivateKey, publicKey: "" }));
  //         } else {
  //           console.log("❌ Chưa có key → Tạo mới...");
  //           const { privateKey: newPrivateKey, publicKey: newPublicKey } =
  //             await generateRSAKeys();
  //           localStorage.setItem("privateKey", newPrivateKey);
  //           localStorage.setItem("publicKey", newPublicKey);
  //           storedPrivateKey = newPrivateKey;
  //           storedPublicKey = newPublicKey;

  //           dispatch(setKeys({ privateKey: newPrivateKey, publicKey: "" }));

  //           // 📌 3️⃣ Lưu key lên Supabase
  //           await addNewKey(userID, newPublicKey, newPrivateKey);
  //         }
  //       } else {
  //         console.log("🔑 Đã tìm thấy private key hợp lệ trong Local Storage!");
  //         dispatch(setKeys({ privateKey: storedPrivateKey, publicKey: "" }));
  //       }

  //       // 📌 4️⃣ Lấy Public Key của Receiver
  //       const receiverPublicKey = await getReceiverPublicKey(parseInt(id));
  //       if (receiverPublicKey) {
  //         console.log(
  //           "🎯 Đã lấy được public key của receiver!",
  //           receiverPublicKey
  //         );
  //         dispatch(
  //           setKeys({
  //             privateKey: storedPrivateKey,
  //             publicKey: receiverPublicKey,
  //           })
  //         );
  //       } else {
  //         console.error("❌ Không tìm thấy public key của receiver!");
  //       }
  //     } catch (error) {
  //       console.error("🚨 Lỗi khi thiết lập key:", error);
  //     }
  //   };

  //   setupKey();
  // }, [userID, id, dispatch]);

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
            setProfileImages({ avatar });
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
        } catch (err: any) {
          setError(err.message);
        }
      }
    };

    fetchSenders();
  }, [userID]);

  // Nếu URL là "/chat/", tự động chọn sender mới nhất
  useEffect(() => {
    if (!id && senders.length > 0) {
      const latestSender = senders[senders.length - 1]; // Lấy sender mới nhất
      if (latestSender) {
        navigate(`/chat/${latestSender.sender_id}`);
      }
    }
  }, [id, senders, navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (userID && id) {
        try {
          const senderId = parseInt(id, 10);
          const sender = senders.find((s) => s.sender_id === senderId);

          if (sender) {
            setActiveSenderName(sender.username);
            setActiveSenderAvatar(sender.avatar_url);
          }

          const encryptedMessages = await getMessagesFromUser(senderId, userID);
          console.log("🔐 Tin nhắn đã mã hóa:", encryptedMessages);

          // Giải mã từng tin nhắn
          const processedMessages = await Promise.all(
            encryptedMessages.map(async (msg: any) => {
              try {
                const decryptedContent = await decryptMessage(
                  msg.message_content, // Nội dung tin nhắn đã mã hóa
                  msg.aes_key, // AES key
                  msg.iv // IV
                );

                return { ...msg, message_content: decryptedContent };
              } catch (error) {
                console.error(`❌ Lỗi giải mã tin nhắn ID ${msg.id}:`, error);
                return {
                  ...msg,
                  message_content: "(Không thể giải mã tin nhắn)",
                  error: true, // Đánh dấu lỗi để UI biết
                };
              }
            })
          );

          dispatch(setMessages(processedMessages));
          markMessageAsRead(senderId, userID);
        } catch (error) {
          console.error("❌ Lỗi khi tải tin nhắn:", error);
        }
      }
    };

    fetchMessages();
  }, [userID, id, senders, dispatch]);

  const handleSenderClick = async (sender_id: number) => {
    navigate(`/chat/${sender_id}`);
  };

  useEffect(() => {
    const subscription = supabase
      .channel("Messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Messages" },
        async () => {
          if (id) {
            const senderId = parseInt(id, 10);
            const encryptedMessages = await getMessagesFromUser(
              senderId,
              userID!
            );

            // Giải mã từng tin nhắn trước khi cập nhật Redux
            const processedMessages = await Promise.all(
              encryptedMessages.map(async (msg: any) => {
                try {
                  const decryptedContent = await decryptMessage(
                    msg.message_content, // Nội dung đã mã hóa
                    msg.aes_key, // AES key (đã giải mã từ RSA trước đó)
                    msg.iv // IV
                  );

                  return { ...msg, message_content: decryptedContent };
                } catch (error) {
                  console.error(`❌ Lỗi giải mã tin nhắn ID ${msg.id}:`, error);
                  return {
                    ...msg,
                    message_content: "(Không thể giải mã tin nhắn)",
                    error: true, // Thêm cờ để frontend biết có lỗi
                  };
                }
              })
            );

            dispatch(setMessages(processedMessages));
            markMessageAsRead(senderId, userID!);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userID, id, dispatch]);

  // console.log(messages);
  return (
    <div className="messagePageContainer">
      <div className="mainMessageFrame">
        <div className="nameBar">{activeSenderName}</div>
        <div className="renderlist">
          {[...messages].reverse().map((message, index) => (
            <MessageBubble
              id={message.message_id}
              avatar={phraseImageUrl(
                message.sender_id === userID
                  ? profileImages?.avatar!
                  : activeSenderAvatar
              )}
              key={`${message.message_id}-${index}`}
              text={
                message.is_deleted
                  ? "Tin nhắn đã bị xóa"
                  : message.message_content
              }
              isMine={message.sender_id === userID}
              time={message.message_time}
              isDeleted={message.is_deleted}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="messageSend">
          <MessagetBox receiver_id={parseInt(id!)} />
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
                isActive={sender.sender_id === parseInt(id!)}
                onClick={() => handleSenderClick(sender.sender_id)}
              />
            ))}
          </div>
          <div className="see-more">{t("see_more")}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
