import { useEffect, useState } from "react";
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
          created_at: new Date().toISOString(), // Automatically set created_at
          is_deleted: false, // Default to false (if this column is required)
        },
      ]);

      if (error) {
        console.error("Error inserting message:", error);
      } else {
        setMessage(""); // Clear the message input if the insertion is successful
      }
    }
  };

  return (
    <Box className="Messaget-box">
      <Box className="Messaget-header">
        <Box className="textarea-wrapper customScrollbar">
          <TextField
            multiline
            minRows={1}
            maxRows={10}
            variant="outlined"
            value={Messaget}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhắn tin với ..."
            className="Messaget-textarea customScrollbar"
            fullWidth
          />
          <Box className="Messaget-actions">
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <img src="/icons/emoji-happy.svg" alt="emoji" />
            </IconButton>
            <Button onClick={handleSend} disabled={!Messaget.trim()}>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)}
        />
      )}
    </Box>
  );
};

export default MessagetBox;
