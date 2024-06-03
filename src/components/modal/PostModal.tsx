import React, { useState, useRef, useEffect } from 'react';
import {
    Modal,
    Typography,
    TextField,
    IconButton,
    Button
} from '@mui/material';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import './postModal.scss'; // Import your component-specific styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

interface PostModalProps {
    open: boolean;
    handleClose: () => void;
}



const PostModal = ((props: PostModalProps) => {
    const [postContent, setPostContent] = useState('');
    const [mangaSuggestContent, setMangaSuggestContent] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files).slice(0, 4 - images.length);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setImages(prevImages => [...prevImages, e.target.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        console.log("Content 1:", postContent);
        console.log("Content 2:", mangaSuggestContent); // In nội dung text vào console log
        images.forEach((image, index) => {
            console.log(`Image ${index + 1} file name:`, image); // In tên file của các ảnh đã tải lên vào console log
        });
        setPostContent('');
        setMangaSuggestContent('');

        // Xóa state của hình ảnh
        setImages([]);
        props.handleClose();
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setPostContent(prevContent => prevContent + emojiData.emoji);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false); // Ẩn emoji picker khi click ra ngoài
            }
        };

        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const isSendButtonDisabled = postContent.trim() === '' && images.length === 0;

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="post-modal-title"
            aria-describedby="post-modal-description"
        >
            <div className="post-modal">
                <div className="header">
                    <div className="none"></div>
                    <Typography className="post-modal-title" variant="h6" component="h2">
                        New Post
                    </Typography>
                    <IconButton onClick={props.handleClose} className="post-modal-title">
                        X
                    </IconButton>
                </div>
                <div className="mangaSuggest">
                    <TextField
                        placeholder="Enter comicId here (copy series code from link)"
                        variant="outlined"
                        fullWidth
                        rows={1}
                        value={mangaSuggestContent}
                        onChange={(e) => setMangaSuggestContent(e.target.value)}
                        className="mangaSuggestField"
                    />
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
                        className='customScrollbar contentField'

                    />
                </div>
                {images.length > 0 && (
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        className='previewImageContainer'
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index} className='previewImage'>
                                <div style={{ position: 'relative' }}>
                                    <img src={image} alt={`Preview ${index}`} />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            cursor: 'pointer',
                                            backdropFilter: "blur(8px)"
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
                <div className='option'>
                    <div>
                        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="emoji-button">
                            <img src="/icons/emoji-happy.svg" alt="emoji" className="icon" />
                        </IconButton>
                        <IconButton onClick={() => fileInputRef.current?.click()} className="image-button">
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
                            disabled={isSendButtonDisabled}
                        >
                            Post
                        </Button>
                    </div>
                </div>
                {showEmojiPicker && (
                    <div className="emoji-picker" ref={emojiPickerRef}>
                        <EmojiPicker disableAutoFocus onEmojiClick={handleEmojiClick} />
                    </div>
                )}
            </div>
        </Modal>
    );
});

export default PostModal;
