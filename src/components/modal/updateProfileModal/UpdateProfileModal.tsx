import { Avatar, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import './updateProfileModal.scss';
import { useRef, useState, useEffect } from 'react';
import { supabase } from "../../../utils/supabase"; // Adjust the path to your supabase client setup
import useCheckSession from '../../../hooks/session';

interface UPModalProps {
    open: boolean;
    handleClose: () => void;
    user: User;
}
export interface User {
    this_id: bigint;
    join_date: Date;
    birth_date: Date;
    username: string;
    password: string;
    usertype: string;
    email: string;
    avatar: bigint;
    level: bigint;
    status: string;
    phone: string;
    name: string;
    bio: string;
    background: bigint;
    link: string;
}
const UpdateProfileModal = (props: UPModalProps) => {
    const [name, setName] = useState<string>(props.user.name || '');
    const [bio, setBio] = useState<string>(props.user.bio || '');
    const [link, setLink] = useState<string>(props.user.link || '');
    const [background, setBackground] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [userId, setUserId] = useState('');//dùng cho upload, id kiểu  ký tự đặc biệt
    const [realUserID, setRealUserID] = useState<any>(null);//dùng cho các loại khác
    const [userInfo, setUserInfo] = useState<any>(null);

    const session = useCheckSession();

    // console.log(background,avatar);
    const [profileImages, setProfileImages] = useState<{ avatar: string, background: string } | null>(null);

    const getUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user !== null) {
                setUserId(user.id);
            } else {
                setUserId('');
            }
        } catch (e) {
        }
    }
    useEffect(() => {
        getUser();
    }, [userId])

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
                    console.error("Error fetching username:", error);
                }
            }
        };

        fetchUserId();
    }, [session]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (realUserID) {
                    const { data, error } = await supabase.rpc("get_user_info", { this_user_id: realUserID });
                    if (error) console.error(error);
                    else {
                        setUserInfo(data[0]); // Adjust based on the returned data structure
                        // console.log(data[0]);
                        // setBio(userInfo?.bio)
                        // setName(userInfo?.name)
                        // setLink(userInfo?.link)
                    }
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, [realUserID]);


    useEffect(() => {
        const fetchProfileImages = async () => {
            try {
                if (realUserID) {
                    const { data, error } = await supabase.rpc("get_profile_image", { this_user_id: realUserID });
                    if (error) console.error(error);
                    else {
                        if (data[0]) {
                            const avatarLink = data[0].avatar_link ? JSON.parse(data[0].avatar_link).publicUrl : null;
                            const backgroundLink = data[0].background_link ? JSON.parse(data[0].background_link).publicUrl : null;

                            if (avatarLink || backgroundLink) {
                                setProfileImages({ avatar: avatarLink, background: backgroundLink });
                                // console.log({ avatar: avatarLink, background: backgroundLink });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching profile images:", error);
            }
        };

        fetchProfileImages();
        // console.log(profileImages, realUserID)
    }, [realUserID]);
    useEffect(() => {
        // console.log(userInfo?.name,userInfo?.bio,userInfo?.link)
        if (
            name.trim() !== userInfo?.name ||
            bio.trim() !== userInfo?.bio ||
            link.trim() !== userInfo?.link ||
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
            getUser();
            let avatarImageId = userInfo.avatar;
            let backgroundImageId = userInfo.background;
            if (avatarFile) {
                console.log(userId + '/' + avatarFile.name)
                const { data: avatarData, error: avatarError } = await supabase.storage
                    .from('userImage')
                    .upload(userId + '/' + avatarFile.name, avatarFile, { upsert: true });

                if (avatarError) {
                    console.error('Avatar upload error:', avatarError);
                    throw avatarError;
                }
                var { data: urlData } = await supabase.storage.from('userImage').getPublicUrl(userId + '/' + avatarFile.name);
                const { data: avatarImage, error: avatarImageError } = await supabase
                    .rpc("upload_image", { this_link: urlData, this_name: avatarFile.name });

                if (avatarImageError) {
                    console.error('RPC upload_user_avatar error:', avatarImageError);
                    throw avatarImageError;
                }

                avatarImageId = avatarImage;
            }

            if (backgroundFile) {
                console.log(userId + '/' + backgroundFile.name)
                const { data: backgroundData, error: backgroundError } = await supabase.storage
                    .from('userImage')
                    .upload(userId + '/' + backgroundFile.name, backgroundFile, { upsert: true });

                if (backgroundError) {
                    console.error('Background upload error:', backgroundError);
                    throw backgroundError;
                }
                var { data: urlData } = await supabase.storage.from('userImage').getPublicUrl(userId + '/' + backgroundFile.name);

                const { data: backgroundImage, error: backgroundImageError } = await supabase
                    .rpc("upload_image", { this_link: urlData, this_name: backgroundFile.name });

                if (backgroundImageError) {
                    console.error('RPC upload_user_avatar error:', backgroundImageError);
                    throw backgroundImageError;
                }

                backgroundImageId = backgroundImage;
            }
            console.log(backgroundImageId, avatarImageId)
            const { error } = await supabase.rpc('update_profile', {
                avatar_image_id: avatarImageId,
                background_image_id: backgroundImageId,
                this_bio: bio,
                this_email: userInfo?.email,
                this_link: link,
                this_name: name,
                this_user_id: userInfo?.this_id,
            });

            if (error) {
                console.error('RPC update_profile error:', error);
                throw error;
            }

            // Clear all inputs
            setName(userInfo?.name);
            setBio(userInfo?.bio);
            setLink(userInfo?.link);
            setBackground('');
            setAvatar('');
            setBackgroundFile(null);
            setAvatarFile(null);

            props.handleClose();
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('Update failed:', error);
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
                        {profileImages?.background && (
                            <img src={profileImages?.background} alt="Background" />
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
                            src={profileImages?.avatar}
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
