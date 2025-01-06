import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { TextField, Avatar, IconButton, Box, Button } from "@mui/material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import "./commentFunc.scss";
import { supabase } from "../../utils/supabase";
import useCheckSession from "../../hooks/session";
import {
  uploadComment,
  uploadCommentImage,
  uploadReply,
} from "../../api/commentAPI";
import { uploadImage } from "../../api/fileUploadAPI";
import { fetchUserIdByEmail, fetchUserProfileImages } from "../../api/userAPI";
import { phraseImageUrl } from "../../utils/imageLinkPhraser";
import { useTranslation } from "react-i18next";
import { checkContentAI } from "../../api/contentAPI";

interface CommentBoxProps {
  postId?: string | any;
  userID?: number;
  placeholder?: string;
  onCommentUploaded?: () => void;
  refreshList?: () => void;
  mangaID?: string | any;
}

export interface CommentBoxRef {
  focusTextarea: () => void;
  setReplyInfo: (replyInfo: ReplyInfo) => void;
}

interface ReplyInfo {
  commentId: number;
  userId: number;
  username: string;
  isReplyToReply: boolean;
}

const CommentBox = forwardRef<CommentBoxRef, CommentBoxProps>((props, ref) => {
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [replyInfo, setReplyInfo] = useState<ReplyInfo | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [realUserID, setRealUserID] = useState<any>(null);
  const session = useCheckSession();
  const [profileImages, setProfileImages] = useState<{ avatar: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation("", { keyPrefix: "utils-reply" });
  useImperativeHandle(ref, () => ({
    focusTextarea: () => {
      textareaRef.current?.focus();
    },
    setReplyInfo: (info: ReplyInfo) => {
      setReplyInfo(info);
    },
  }));

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user !== null) {
          setUserId(user.id); //id dành cho upload file
        } else {
          setUserId("");
        }
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    };
    getUser();
  }, [session]);

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
    setUploading(true);
    try {
      let commentId;

      const result = await checkContentAI(comment);
      if (result) {
        alert(`This comment is ` + result.type);
        setUploading(false);
        return;
      }

      if (replyInfo && comment && realUserID) {
        commentId = await uploadReply(replyInfo.commentId, realUserID, comment);
      } else {
        commentId = await uploadComment(
          props.postId,
          props.mangaID,
          realUserID,
          comment
        );
      }

      // Kiểm tra nếu có hình ảnh thì mới upload
      const imageFile = fileInputRef.current?.files?.[0];
      if (imageFile) {
        const uploadResult = await uploadImage(userId, imageFile);
        // console.log(imageFile, uploadResult, commentId);
        if (uploadResult) {
          await uploadCommentImage(
            uploadResult.imageName,
            commentId,
            uploadResult.publicUrl
          );
        }
      }

      // Reset fields
      setComment("");
      setImage(null);
      setReplyInfo(null);
      setUploading(false);
      if (props.onCommentUploaded) props.onCommentUploaded();
      if (props.refreshList) props.refreshList();
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setComment((prevComment) => prevComment + emojiData.emoji);
  };

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        if (realUserID) {
          // Sử dụng fetchUserProfileImages từ userapi.ts để lấy dữ liệu
          const { data, error } = await fetchUserProfileImages(realUserID);

          if (error) {
            console.error("Error fetching profile images:", error);
          } else {
            // Dùng phraseImageUrl để xử lý dữ liệu trả về
            if (data[0]) {
              const avatarLink = phraseImageUrl(data[0].avatar_link);
              setProfileImages({
                avatar: avatarLink || "",
              });
            } else {
              setProfileImages({ avatar: "" });
            }
          }
        } else {
          setProfileImages({ avatar: "" });
        }
      } catch (error) {
        console.error("Error fetching profile images:", error);
      }
    };

    fetchProfileImages();
  }, [realUserID]);
  const isSendButtonDisabled = comment.trim() === "" && !image;
  // console.log(profileImages)

  return (
    <Box className="comment-box">
      {image && (
        <Box className="image-preview">
          <img src={image} alt="Preview" />
          <button onClick={handleRemoveImage} className="remove-image-button">
            X
          </button>
        </Box>
      )}
      <Box className="comment-header">
        <Avatar src={profileImages?.avatar} className="comment-avatar" />
        <Box className="textarea-wrapper customScrollbar">
          <TextField
            multiline
            minRows={1}
            maxRows={10}
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              replyInfo
                ? `${t("reply-user")}${replyInfo.username}`
                : props.placeholder || "Nhập bình luận..."
            }
            // placeholder={replyInfo ? `Replying to ${replyInfo.username} (ID: ${replyInfo.userId}) (Comment ID: ${replyInfo.commentId})` : (props.placeholder || "Nhập bình luận...")}
            inputRef={textareaRef}
            className="comment-textarea customScrollbar"
            fullWidth
          />
          <Box className="comment-actions">
            <Box>
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
            </Box>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
            />
            <Button
              className="send-button"
              onClick={handleSend}
              disabled={isSendButtonDisabled || uploading}
            >
              {uploading ? "Uploading..." : "Send"}
            </Button>
          </Box>
        </Box>
      </Box>
      {showEmojiPicker && (
        <Box className="emoji-picker">
          <EmojiPicker
            autoFocusSearch={false}
            onEmojiClick={handleEmojiClick}
          />
        </Box>
      )}
    </Box>
  );
});

export default CommentBox;
