import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../../utils/supabase";
import { Box, Button, IconButton, TextField } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import "./messageBox.scss";
import { fetchUserIdByEmail } from "../../../../api/userAPI";
import useCheckSession from "../../../../hooks/session";

const MessagetBox = ({ receiver_id }: { receiver_id: number }) => {
  const [Messaget, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [realUserID, setRealUserID] = useState<any>(null);
  const session = useCheckSession();

  // Ref để theo dõi EmojiPicker
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getUserID = async () => {
      if (session && session.user) {
        try {
          const userId = await fetchUserIdByEmail(session.user.email);
          setRealUserID(userId);
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    getUserID();
  }, [session]);

  const handleSend = async () => {
    if (Messaget.trim()) {
      // Check if realUserID and receiver_id are valid integers
      if (!realUserID || !receiver_id) {
        console.error("Invalid user IDs:", realUserID, receiver_id);
        return;
      }

      const { error } = await supabase.from("Messages").insert([
        {
          sender_id: realUserID,
          receiver_id: receiver_id,
          message: Messaget,
          created_at: new Date().toISOString(),
          is_deleted: false,
        },
      ]);

      if (error) {
        console.error("Error inserting message:", error);
      } else {
        setMessage(""); // Clear the message input if the insertion is successful
      }
    }
  };

  // Ẩn EmojiPicker khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box className="Messaget-box">
      <Box className="text-wrapper customScrollbar">
        <TextField
          multiline
          minRows={1}
          maxRows={6}
          variant="outlined"
          value={Messaget}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Aa"
          className="Messaget-textarea customScrollbar"
          fullWidth
        />
        <Box className="Messaget-actions">
          <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <img src="/icons/emoji-happy.svg" alt="emoji" />
          </IconButton>
          <Button
            onClick={handleSend}
            disabled={!Messaget.trim()}
            className="send-button"
          >
            Send
          </Button>
        </Box>
      </Box>
      {showEmojiPicker && (
        <Box className="emoji-picker" ref={emojiPickerRef}>
          <EmojiPicker
            autoFocusSearch={false}
            onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)}
          />
        </Box>
      )}
    </Box>
  );
};

export default MessagetBox;
