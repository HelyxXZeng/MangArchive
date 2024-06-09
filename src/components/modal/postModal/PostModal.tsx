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
import ComicCard from '../../socialComponents/comicCardSmall/ComicCard';
import axios from 'axios';

interface PostModalProps {
    open: boolean;
    handleClose: () => void;
    mangaid?: string;
}

const PostModal = (props: PostModalProps) => {
    const [postContent, setPostContent] = useState('');
    const [mangaSuggestContent, setMangaSuggestContent] = useState(props.mangaid || '');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [idValid, setIdValid] = useState<boolean>(true);
    const [comic, setComic] = useState<any>(null);
    const [idError, setIdError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [imagesName,setImagesName] = useState<string[]>([]);
    const [imagesFile,setImagesFile] = useState<File[]>([]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files).slice(0, 4 - images.length);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setImages(prevImages => [...prevImages, e.target.result as string]);
                        setImagesFile(prevImages => [...prevImages, file]);
                        setImagesName(prevNames => [...prevNames, file.name]);
                    }
                };
                reader.readAsDataURL(file);
            });
            event.target.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prevImages => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleSend = () => {
        console.log("Content 1:", postContent);
        console.log("Content 2:", mangaSuggestContent);
        // images.forEach((image, index) => {
        //     console.log(`Image ${index + 1} file name:`, image);
        // });
        imagesName.forEach((image, index) => {
            console.log(`Image ${index + 1} file name:`, image);
        });
        imagesFile.forEach((image, index) => {
            console.log(`Image ${index + 1} file path:`, image);
        });
        setPostContent('');
        setMangaSuggestContent('');
        setImages([]);
        setImagesFile([]);
        setImagesName([]);
        props.handleClose();
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setPostContent(prevContent => prevContent + emojiData.emoji);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (mangaSuggestContent.trim() !== '') {
            axios.get(`https://api.mangadex.org/manga/${mangaSuggestContent.trim()}?includes[]=cover_art&includes[]=artist&includes[]=author`)
                .then(response => {
                    setComic(response.data.data);
                    setIdValid(true);
                    setIdError(null);
                })
                .catch(error => {
                    console.error("Invalid manga ID:", error);
                    setIdValid(false);
                    setComic(null);
                    setIdError("ID truyện không đúng, copy từ link truyện để dùng. VD: 09b80517-f0d6-44bd-94a6-0794da2e18d8");
                });
        } else {
            setIdValid(true);  // Allow posting when ID is empty
            setComic(null);
            setIdError(null);
        }
    }, [mangaSuggestContent]);

    const isSendButtonDisabled = (postContent.trim() === '' && images.length === 0) || (!idValid && mangaSuggestContent.trim() !== '');

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="post-modal-title"
            aria-describedby="post-modal-description"
        >
            <div className="post-modal customScrollbar">
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
                        error={Boolean(idError)}
                        helperText={idError}
                    />
                    {idValid && comic && (
                        <ComicCard
                            cover={comic.relationships.find((r: any) => r.type === "cover_art")?.attributes.fileName}
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
                        className='customScrollbar contentField'
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
                        className='previewImageContainer'
                        loop={true}
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
};

export default PostModal;
