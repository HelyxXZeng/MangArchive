import { Avatar, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import './updateProfileModal.scss';
import { useRef, useState, useEffect } from 'react';

interface UPModalProps {
    open: boolean;
    handleClose: () => void;
    uid: string;
    background: string; // link, có thể rỗng vì user không có sẵn hình
    avatar: string; // link, có thể rỗng vì user không có sẵn hình
    name: string;
    bio: string;
    link: string;
}

const UpdateProfileModal = (props: UPModalProps) => {
    const [name, setName] = useState<string>(props.name || '');
    const [bio, setBio] = useState<string>(props.bio);
    const [link, setLink] = useState<string>(props.link);
    const [background, setBackground] = useState<string>(props.background);
    const [avatar, setAvatar] = useState<string>(props.avatar);
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (
            name !== props.name ||
            bio !== props.bio ||
            link !== props.link ||
            backgroundFile !== null ||
            avatarFile !== null
        ) {
            setIsSendButtonDisabled(false);
        } else {
            setIsSendButtonDisabled(true);
        }
    }, [name, bio, link, backgroundFile, avatarFile]);

    const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setBackgroundFile(event.target.files[0]);
            setBackground(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarFile(event.target.files[0]);
            setAvatar(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleSend = async () => {
        if (name.trim() === '') {
            setNameError('Name must not be empty');
            return;
        }

        try {
            // Simulate an API call
           
            console.log("Name:", name);
            console.log("Bio:", bio);
            console.log("Link:", link);
            console.log("Background Image File:", backgroundFile);
            console.log("Avatar Image File:", avatarFile);

            // Clear all inputs
            setName(props.name);
            setBio(props.bio);
            setLink(props.link);
            setBackground(props.background);
            setAvatar(props.avatar);
            setBackgroundFile(null);
            setAvatarFile(null);

            props.handleClose();
            setTimeout(() => {
            window.location.reload();
            },5000);
        } catch (error) {
            // Handle error
            setErrorMessage('Update failed, please try again in 10 seconds');
            setIsSendButtonDisabled(true);
            setTimeout(() => {
                setErrorMessage(null);
                setIsSendButtonDisabled(false);
            }, 10000);
        }
    };

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="up-modal-title"
            aria-describedby="up-modal-description"
        >
            <div className="up-modal">
                <div className="header">
                    <div className="none"></div>
                    <Typography className="up-modal-title" variant="h6" component="h2">
                        Edit your profile
                    </Typography>
                    <IconButton onClick={props.handleClose} className="up-modal-title">
                        X
                    </IconButton>
                </div>
                {errorMessage && (
                    <Typography className="error-message" variant="body2" component="p">
                        {errorMessage}
                    </Typography>
                )}
                <div className="imageInput">
                    <div
                        className="background"
                        onClick={() => backgroundInputRef.current?.click()}
                    >
                        {background && (
                            <img src={background} alt="Background" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            ref={backgroundInputRef}
                            onChange={handleBackgroundChange}
                            hidden
                        />
                    </div>
                    <div
                        className="avatar"
                        onClick={() => avatarInputRef.current?.click()}
                    >
                        <Avatar
                            className="Avatar"
                            src={avatar}
                            alt="avatar"
                            sx={{ width: "128px", height: "128px", border: "4px solid #1F1F1F" }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={avatarInputRef}
                            onChange={handleAvatarChange}
                            hidden
                        />
                    </div>
                </div>
                <div className="textInput">
                    <div className="name">
                        <TextField
                            label="Your display name"
                            variant="outlined"
                            fullWidth
                            rows={1}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (e.target.value.trim() !== '') {
                                    setNameError(null);
                                }
                            }}
                            className="nameInputField"
                            error={!!nameError}
                            helperText={nameError}
                        />
                    </div>
                    <div className="bio">
                        <TextField
                            label="Bio"
                            variant="outlined"
                            fullWidth
                            multiline
                            minRows={3}
                            maxRows={10}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            sx={{ mt: 2, mb: 2 }}
                            className='customScrollbar contentField'
                        />
                    </div>
                    <div className="link">
                        <TextField
                            label="Website"
                            variant="outlined"
                            fullWidth
                            rows={1}
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="linkField"
                        />
                    </div>
                </div>
                <div className='option'>
                    <Button
                        className="send-button"
                        variant="contained"
                        onClick={handleSend}
                        disabled={isSendButtonDisabled}
                    >
                        Update
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateProfileModal;
