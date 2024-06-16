import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { TextField, Avatar, IconButton, Box, Button } from '@mui/material';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import './commentFunc.scss';
import { supabase } from '../../utils/supabase'; // Adjust the path to your supabase client setup
import useCheckSession from '../../hooks/session';

interface CommentBoxProps {
    postId?: string | any;
    userID?: number;
    placeholder?: string;
    onCommentUploaded?: () => void;
    refreshList?: () => void;
    mangaID?: string | any;
}

interface CommentBoxRef {
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
    const [comment, setComment] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [replyInfo, setReplyInfo] = useState<ReplyInfo | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [realUserID, setRealUserID] = useState<any>(null);
    const session = useCheckSession();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
        focusTextarea: () => {
            textareaRef.current?.focus();
        },
        setReplyInfo: (info: ReplyInfo) => {
            setReplyInfo(info);
        }
    }));

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user !== null) {
                    setUserId(user.id);
                } else {
                    setUserId('');
                }
            } catch (e) {
                console.error("Error fetching user:", e);
            }
        };
        getUser();
    }, [session]);

    useEffect(() => {
        const fetchUserId = async () => {
            if (session !== null) {
                try {
                    const { user } = session;
                    if (user) {
                        let { data, error } = await supabase.rpc("get_user_id_by_email", {
                            p_email: session.user.email,
                        });
                        if (error) console.error(error);
                        else {
                            setRealUserID(data);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user ID:", error);
                }
            }
        };
        fetchUserId();
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
            console.log(replyInfo?.commentId, realUserID, comment)
            if (replyInfo && comment && realUserID) {
                // Xử lý logic cho phản hồi
                const { data, error } = await supabase.rpc('upload_reply', {
                    this_comment_id: replyInfo.commentId,
                    this_user_id: realUserID,
                    this_content: comment,
                });
                if (error) {
                    console.error('RPC upload_reply error:', error);
                    throw error;
                }
                commentId = data;
            } else {
                // Xử lý logic cho bình luận mới
                console.log(realUserID, comment)
                if (props.postId) {
                    const { data, error } = await supabase.rpc('upload_comment_for_post', {
                        this_post_id: props.postId,
                        this_user_id: realUserID,
                        this_content: comment,
                    });
                    if (error) {
                        console.error('RPC upload_comment_for_post error:', error);
                        throw error;
                    }
                    commentId = data;
                } else if (props.mangaID) {
                    const { data, error } = await supabase.rpc('upload_comment_for_truyen', {
                        this_truyen: props.mangaID,
                        this_user_id: realUserID,
                        this_content: comment,
                    });
                    if (error) {
                        console.error('RPC upload_comment_for_truyen error:', error);
                        throw error;
                    }
                    commentId = data;
                }
            }
            
            if (image) {
                const imageFile = fileInputRef.current?.files?.[0];
                if (imageFile) {
                    const imageName = imageFile.name;
                    const { data: imageData, error: imageError } = await supabase.storage
                        .from('userImage')
                        .upload(`${userId}/${imageName}`, imageFile, { upsert: true });

                    if (imageError) {
                        console.error('Image upload error:', imageError);
                        throw imageError;
                    }

                    const { data: urlData } = await supabase.storage.from('userImage').getPublicUrl(`${userId}/${imageName}`);
                    
                    const { data: imageId, error: rpcImageError } = await supabase.rpc('upload_comment_image', {
                        this_name: imageName,
                        this_comment_id: commentId,
                        this_link: urlData,
                    });

                    if (rpcImageError) {
                        console.error('RPC upload_comment_image error:', rpcImageError);
                        throw rpcImageError;
                    }
                }
            }

            // Clear all inputs
            setComment('');
            setImage(null);
            setReplyInfo(null);
            setUploading(false);
            if (props.onCommentUploaded) props.onCommentUploaded();
            if (props.refreshList) props.refreshList();
        } catch (error) {
            console.error('Upload failed:', error);
            setUploading(false);
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setComment(prevComment => prevComment + emojiData.emoji);
    };
    const [profileImages, setProfileImages] = useState<{ avatar: string, background: string } | null>(null);

    useEffect(() => {
        const fetchProfileImages = async () => {
            try {
                if (realUserID) {
                    const { data, error } = await supabase.rpc("get_profile_image", { this_user_id: realUserID });
                    if (error) console.error(error);
                    else {
                        if (data[0]) {
                            const avatarLink = data[0].avatar_link ? JSON.parse(data[0].avatar_link).publicUrl : "";
                            const backgroundLink = data[0].background_link ? JSON.parse(data[0].background_link).publicUrl : "";
                            setProfileImages({ avatar: avatarLink || "", background: backgroundLink || "" });
                            // console.log(profileImages)

                        } else {
                            setProfileImages({ avatar: "", background: "" });
                        }
                    }
                } else {
                    setProfileImages({ avatar: "", background: "" });
                }
            } catch (error) {
                console.error("Error fetching profile images:", error);
            }
        };

        fetchProfileImages();
    }, [realUserID]);
    const isSendButtonDisabled = comment.trim() === '' && !image;
    // console.log(profileImages)

    return (
        <Box className="comment-box">
            {image && (
                <Box className="image-preview">
                    <img src={image} alt="Preview" />
                    <button onClick={handleRemoveImage} className="remove-image-button">X</button>
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
                        placeholder={replyInfo ? `Replying to ${replyInfo.username}` : (props.placeholder || "Nhập bình luận...")}
                        // placeholder={replyInfo ? `Replying to ${replyInfo.username} (ID: ${replyInfo.userId}) (Comment ID: ${replyInfo.commentId})` : (props.placeholder || "Nhập bình luận...")}
                        inputRef={textareaRef}
                        className="comment-textarea customScrollbar"
                        fullWidth
                    />
                    <Box className="comment-actions">
                        <Box>
                            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="emoji-button">
                                <img src="/icons/emoji-happy.svg" alt="" className="icon" />
                            </IconButton>
                            <IconButton onClick={() => fileInputRef.current?.click()} className="image-button">
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
                            {uploading ? 'Uploading...' : 'Send'}
                        </Button>
                    </Box>
                </Box>
            </Box>
            {showEmojiPicker && (
                <Box className="emoji-picker">
                    <EmojiPicker disableAutoFocus onEmojiClick={handleEmojiClick} />
                </Box>
            )}
        </Box>
    );
});

export default CommentBox;
