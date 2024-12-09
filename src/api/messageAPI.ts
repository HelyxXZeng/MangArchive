import { supabase } from '../utils/supabase';

// Hàm lấy danh sách người gửi tin nhắn
export const getMessageSenders = async (userId: number) => {
  const { data, error } = await supabase
    .rpc('get_message_senders', { user_id: userId });

  if (error) {
    console.error('Error fetching message senders:', error.message);
    throw error;
  }
  return data;
};

export const getMessagesFromUser = async (
  senderUserId: number,
  targetUserId: number
) => {
  const { data, error } = await supabase
    .rpc("get_messages_from_user", {
      sender_user_id: senderUserId,
      target_user_id: targetUserId,
    });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
  return data;
};