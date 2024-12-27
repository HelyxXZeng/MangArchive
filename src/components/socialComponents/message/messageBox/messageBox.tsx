import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../../utils/supabase";
import { Box, Button, IconButton, TextField } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import "./messageBox.scss";
import { fetchUserIdByEmail } from "../../../../api/userAPI";
import useCheckSession from "../../../../hooks/session";

const MessagetBox = ({ receiver_id }: { receiver_id: number }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [realUserID, setRealUserID] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const session = useCheckSession();
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Kiểm tra dung lượng tệp (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        alert("Dung lượng file không được vượt quá 10MB.");
        fileInputRef.current!.value = ""; // Reset giá trị của input file
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSend = async () => {
    if (message.trim() || image) {
      // Gửi tin nhắn trước nếu có
      if (message.trim()) {
        if (!realUserID || !receiver_id) {
          console.error("Invalid user IDs:", realUserID, receiver_id);
          return;
        }

        const { error } = await supabase.from("Messages").insert([
          {
            sender_id: realUserID,
            receiver_id: receiver_id,
            message: message,
            created_at: new Date().toISOString(),
            is_deleted: false,
          },
        ]);

        if (error) {
          console.error("Error inserting message:", error);
          return;
        } else {
          setMessage(""); // Clear message input
        }
      }

      // Gửi hình ảnh (nếu có)
      if (image) {
        const imageFile = fileInputRef.current?.files?.[0];
        if (imageFile) {
          console.log("Image file:", imageFile); // Thay vì upload, chỉ log ra file hình
        }
        fileInputRef.current!.value = ""; // Reset giá trị của input file
        setImage(null);
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

  const isSendButtonDisabled = !message.trim() && !image;

  return (
    <Box className="Messaget-box">
      {image && (
        <Box className="image-preview">
          <img src={image} alt="Preview" />
          <button onClick={handleRemoveImage} className="remove-image-button">
            X
          </button>
        </Box>
      )}
      <Box className="text-wrapper customScrollbar">
        <TextField
          multiline
          minRows={1}
          maxRows={6}
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Aa"
          className="Messaget-textarea customScrollbar"
          fullWidth
        />
        <Box className="Messaget-actions">
          <IconButton
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="emoji-button"
          >
            <img src="/icons/emoji-happy.svg" alt="" className="icon" />
          </IconButton>
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            className="image-button"
          >
            <img src="/icons/camera.svg" alt="" className="icon" />
          </IconButton>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            hidden
          />
          <Button
            onClick={handleSend}
            disabled={isSendButtonDisabled}
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
