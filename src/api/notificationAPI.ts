import { supabase } from "../utils/supabase";

export const getUnreadMessageNotification = async (userId: number) => {
  const { data, error } = await supabase.rpc(
    "get_unread_message_notification",
    {
      user_id: userId,
    }
  );

  if (error) {
    console.error("Error get unread message notification:", error);
  }

  return data;
};

export const countUnreadNotification = async (userId: number) => {
  const { data, error } = await supabase.rpc("count_unread_notifications", {
    user_id: userId,
  });

  if (error) {
    console.error("Error count unread notification:", error);
  }

  return data;
};

export const setReadNotification = async (notificationId: number) => {
  const { error } = await supabase.rpc("set_read_notification", {
    notification_id: notificationId,
  });

  if (error) {
    console.error("Error count unread notification:", error);
  }
};
