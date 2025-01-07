import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Typography,
  TextField,
  IconButton,
  Button,
  LinearProgress,
} from "@mui/material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import "./postModal.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/swiper-bundle.css";
import ComicCard from "../../socialComponents/comicCardSmall/ComicCard";
import useCheckSession from "../../../hooks/session";
import { supabase } from "../../../utils/supabase";
import { fetchMangaById } from "../../../api/mangaAPI";
import { uploadImage } from "../../../api/fileUploadAPI";
import { fetchUserIdByEmail } from "../../../api/userAPI";
import { checkContentAI } from "../../../api/contentAPI";

interface PostModalProps {
  open: boolean;
  handleClose: () => void;
  mangaid?: string;
  refreshList?: () => void;
  group_id?: string;
}

const PostModal = (props: PostModalProps) => {
  const [postContent, setPostContent] = useState("");
  const [mangaSuggestContent, setMangaSuggestContent] = useState(
    props.mangaid || ""
  );
  const [groupid, setGroupid] = useState(
    props.group_id || null
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imagesFile, setImagesFile] = useState<File[]>([]);
  const [idValid, setIdValid] = useState<boolean>(true);
  const [comic, setComic] = useState<any>(null);
  const [idError, setIdError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const session = useCheckSession();
  const [userId, setUserId] = useState("");
  const [realUserID, setRealUserID] = useState<any>(null);
  const isSendButtonDisabled =
    (postContent.trim() === "" && images.length === 0) ||
    (!idValid && mangaSuggestContent.trim() !== "");

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user !== null) {
          setUserId(user.id);
        } else {
          setUserId("");
        }
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    };
    getUser();
  }, []);

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

  useEffect(() => {
    if (mangaSuggestContent.trim() !== "") {
      fetchMangaById(mangaSuggestContent.trim())
        .then((response) => {
          setComic(response);
          setIdValid(true);
          setIdError(null);
        })
        .catch((error) => {
          console.error("Invalid manga ID:", error);
          setIdValid(false);
          setComic(null);
          setIdError(
            "Invalid manga ID, please copy from the link. Example: 09b80517-f0d6-44bd-94a6-0794da2e18d8"
          );
        });
    } else {
      setIdValid(true); // Allow posting when ID is empty
      setComic(null);
      setIdError(null);
    }
  }, [mangaSuggestContent]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).slice(0, 4 - images.length);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e?.target?.result) {
            setImages((prevImages) => [
              ...prevImages,
              e?.target?.result as string,
            ]);
            setImagesFile((prevImages) => [...prevImages, file]);
          }
        };
        reader.readAsDataURL(file);
      });
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setImagesFile((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setPostContent((prevContent) => prevContent + emojiData.emoji);
  };

  const handleSend = async () => {
    setUploading(true);
    setUploadProgress(0);

    const result = await checkContentAI(postContent);
    if (result) {
      alert(`This post content is ` + result.type);
      setUploading(false);
      return;
    }

    try {
      const { data: postId, error: postError } = await supabase.rpc(
        "upload_post",
        {
          this_truyen: mangaSuggestContent || null,
          this_user_id: realUserID,
          this_content: postContent,
          this_group_name_id: groupid
        }
      );

      if (postError) {
        console.error("RPC upload_post error:", postError);
        throw postError;
      }

      for (let i = 0; i < imagesFile.length; i++) {
        const imageFile = imagesFile[i];

        const result = await uploadImage(userId, imageFile);
        if (!result) {
          throw new Error("Image upload failed");
        }

        const { error: rpcImageError } = await supabase.rpc(
          "upload_post_image",
          {
            this_name: result.imageName,
            this_post_id: postId,
            this_link: result.publicUrl,
          }
        );

        if (rpcImageError) {
          console.error("RPC upload_post_image error:", rpcImageError);
          throw rpcImageError;
        }

        setUploadProgress(
          (prevProgress) => prevProgress + 80 / imagesFile.length
        );
      }

      setUploadProgress(100);

      // Clear all inputs
      setPostContent("");
      setMangaSuggestContent("");
      setGroupid(null);
      setImages([]);
      setImagesFile([]);
      setUploading(false);
      props.handleClose();
      if (props.refreshList) props.refreshList();
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={uploading ? () => { } : props.handleClose}
      aria-labelledby="post-modal-title"
      aria-describedby="post-modal-description"
    >
      <div className="post-modal customScrollbar">
        <div className="header">
          <div className="none"></div>
          <Typography className="post-modal-title" variant="h6" component="h2">
            New Post
          </Typography>
          <IconButton
            onClick={uploading ? () => { } : props.handleClose}
            className="post-modal-title"
          >
            X
          </IconButton>
        </div>
        <div className="mangaSuggest">
          <TextField
            placeholder="If post for group then group id should be here"
            variant="outlined"
            fullWidth
            rows={1}
            value={groupid}
            className="mangaSuggestField"
          />

          {mangaSuggestContent ? (
            <TextField
              placeholder="Enter comicId here (copy series code from link)"
              variant="outlined"
              fullWidth
              rows={1}
              value={mangaSuggestContent}
              className="mangaSuggestField"
              disabled
            />
          ) : (
            <TextField
              placeholder="Enter comicId here (copy series code from link)"
              variant="outlined"
              fullWidth
              rows={1}
              value={mangaSuggestContent}
              onChange={(e) => setMangaSuggestContent(e.target.value)}
              className="mangaSuggestField"
              error={Boolean(idError)}
              helperText={idError}
            />
          )}
          {idValid && comic && (
            <ComicCard
              cover={
                comic.relationships.find((r: any) => r.type === "cover_art")
                  ?.attributes.fileName
              }
              title={comic.attributes.title.en}
              comictype={comic.type}
              maintag={comic.attributes.tags[0].attributes.name.en}
              id={comic.id}
            />
          )}
        </div>
        <div className="content">
          <TextField
            placeholder="What's on your mind?"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            maxRows={10}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            className="customScrollbar contentField"
          />
        </div>
        {images.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={1}
            slidesPerGroup={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            className="previewImageContainer"
            loop={true}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="previewImage">
                <div style={{ position: "relative" }}>
                  <img src={image} alt={`Preview ${index}`} />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    X
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <div className="option">
          <div>
            <IconButton
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="emoji-button"
              disabled={uploading}
            >
              <img src="/icons/emoji-happy.svg" alt="emoji" className="icon" />
            </IconButton>
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              className="image-button"
              disabled={uploading}
            >
              <img src="/icons/camera.svg" alt="" className="icon" />
            </IconButton>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
              multiple
            />
          </div>
          <div>
            <Button
              className="send-button"
              variant="contained"
              onClick={handleSend}
              disabled={isSendButtonDisabled || uploading}
            >
              Post
            </Button>
          </div>
        </div>
        {showEmojiPicker && (
          <div className="emoji-picker" ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        {uploading && (
          <div className="upload-progress">
            <Typography variant="body2" component="p">
              Đang upload hình, đợi xíu...
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PostModal;
