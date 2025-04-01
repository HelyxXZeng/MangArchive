import { supabase } from "../utils/supabase";

// Hàm lấy danh sách người gửi tin nhắn
export const getMessageSenders = async (userId: number) => {
  const { data, error } = await supabase.rpc("get_message_senders", {
    user_id: userId,
  });

  if (error) {
    console.error("Error fetching message senders:", error.message);
    throw error;
  }
  return data;
};

export const getMessagesFromUser = async (
  senderUserId: number,
  targetUserId: number
) => {
  const { data, error } = await supabase.rpc("get_messages_from_user", {
    sender_user_id: senderUserId,
    target_user_id: targetUserId,
  });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
  return data;
};

export const getMessageImage = async (id: number) => {
  const { data, error } = await supabase.rpc("get_message_image", {
    message_id: id,
  });
  if (error) {
    console.error("Error fetching image for message:", id, error);
    throw error;
  }
  return data;
};

export const markMessageAsRead = async (
  sender_id: number,
  receiver_id: number
) => {
  const { error } = await supabase.rpc("mark_messages_as_read", {
    sender_user_id: sender_id,
    receiver_user_id: receiver_id,
  });
  // console.log(sender_id, receiver_id, "mark");
  if (error) {
    console.log("Error mark read message:", error);
    throw error;
  }
};

export const uploadMessage = async (
  sender: number,
  receiver: number,
  content: string,
  aesKey: string,
  iv: string
) => {
  const { data, error } = await supabase.rpc("add_new_message", {
    sender_user_id: sender,
    receiver_user_id: receiver,
    message_content: content, // Nội dung tin nhắn đã mã hóa AES
    aes_key: aesKey, // AES key đã mã hóa bằng RSA
    iv: iv, // IV dùng để giải mã
  });

  if (error) {
    console.error("Error upload message: ", error);
    throw error;
  }
  return data;
};

export const uploadMessageImage = async (
  link: string,
  filename: string,
  message_id: number
) => {
  const { error } = await supabase.rpc("upload_message_image", {
    this_link: link,
    this_name: filename,
    message_id: message_id,
  });
  if (error) {
    console.error("Error upload image for message:", error);
    throw error;
  }
};

export const deleteMessage = async (messageId: number) => {
  const { error } = await supabase.rpc("delete_message", {
    message_id: messageId,
  });
  if (error) {
    console.error("Error delete message:", error);
    throw error;
  }
};
