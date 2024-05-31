import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { TextField, Avatar, IconButton, Box, Button } from '@mui/material';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import './commentFunc.scss'; // Import your component-specific styles

interface CommentBoxProps {
    avatarUrl?: string;
    placeholder?: string;
}

interface CommentBoxRef {
    focusTextarea: () => void;
}

const CommentBox = forwardRef<CommentBoxRef, CommentBoxProps>((props, ref) => {
    const [comment, setComment] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
        focusTextarea: () => {
            textareaRef.current?.focus();
        }
    }));

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

    const handleSend = () => {
        // Handle send comment logic
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setComment(prevComment => prevComment + emojiData.emoji);
    };

    const isSendButtonDisabled = comment.trim() === '' && !image;

    return (
        <Box className="comment-box">
            {image && (
                <Box className="image-preview">
                    <img src={image} alt="Preview" />
                    <button onClick={handleRemoveImage} className="remove-image-button">X</button>
                </Box>
            )}
            <Box className="comment-header">
                <Avatar src={props.avatarUrl} className="comment-avatar" />
                <Box className="textarea-wrapper customScrollbar">
                    <TextField
                        multiline
                        minRows={1}
                        maxRows={10}
                        variant="outlined"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={props.placeholder || "Nhập bình luận..."}
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
                            disabled={isSendButtonDisabled}
                        >
                            Send
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
