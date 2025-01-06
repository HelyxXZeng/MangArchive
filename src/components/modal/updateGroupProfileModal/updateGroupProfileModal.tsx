import {
    Avatar,
    Button,
    IconButton,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import "../updateProfileModal/updateProfileModal.scss";
import { useRef, useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase"; // Adjust the path to your supabase client setup
import {
    uploadUserImage,
} from "../../../api/userAPI";
import { phraseImageUrl } from "../../../utils/imageLinkPhraser";
import { uploadImage } from "../../../api/fileUploadAPI";
import { fetchGroupData, fetchGroupProfileImages } from "../../../api/groupApi";

interface UPModalProps {
    open: boolean;
    handleClose: () => void;
    group: User;
}
export interface User {
    id: string;
    name_id: string;
    created_at: Date;
    avatar: bigint;
    status: string;
    name: string;
    description: string;
    background: bigint;
    link: string;
}
const UpdateGroupProfileModal = (props: UPModalProps) => {
    const [name, setName] = useState<string>(props.group?.name || "");
    const [description, setdescription] = useState<string>(props.group?.description || "");
    const [link, setLink] = useState<string>(props.group?.link || "");
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [background, setBackground] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [userId, setUserId] = useState<any>(null); //dùng cho upload, id kiểu  ký tự đặc biệt
    const [realUserID, setRealUserID] = useState<any>(null); //dùng cho các loại khác
    const [groupInfo, setgroupInfo] = useState<any>(null);

    const [profileImages, setProfileImages] = useState<{
        avatar: string;
        background: string;
    } | null>(null);

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
        } catch (e) { }
    };
    useEffect(() => {
        getUser();
    }, [groupInfo]);

    useEffect(() => {
        const getUserID = async () => {
            try {
                setRealUserID(props.group?.name_id);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        getUserID();
    }, [groupInfo]);

    useEffect(() => {
        const fetchgroupInfos = async () => {
            try {
                if (props.group?.name_id) {
                    var data = await fetchGroupData(props.group?.name_id);
                    setgroupInfo(data);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchgroupInfos();
    }, [props.group]);

    useEffect(() => {
        const fetchProfileImages = async () => {
            try {
                if (realUserID) {
                    const { data, error } = await fetchGroupProfileImages(props.group.id);
                    if (error) console.error(error);
                    else {
                        if (data[0]) {
                            const avatarLink = phraseImageUrl(data[0].avatar_link);
                            const backgroundLink = phraseImageUrl(data[0].background_link);
                            if (avatarLink || backgroundLink) {
                                setProfileImages({
                                    avatar: avatarLink,
                                    background: backgroundLink,
                                });
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
        // console.log(groupInfo?.name,groupInfo?.description,groupInfo?.link)
        if (
            name.trim() !== groupInfo?.name ||
            description.trim() !== groupInfo?.description ||
            link.trim() !== groupInfo?.link ||
            backgroundFile !== null ||
            avatarFile !== null
        ) {
            setIsSendButtonDisabled(false);
        } else {
            setIsSendButtonDisabled(true);
        }
    }, [name, description, link, backgroundFile, avatarFile]);

    const handleBackgroundChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
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
        if (name.trim() === "") {
            setNameError("Name must not be empty");
            return;
        }

        try {
            getUser(); // Ensure the userId is set
            let avatarImageId = groupInfo.avatar;
            let backgroundImageId = groupInfo.background;

            // Upload avatar if it exists
            if (avatarFile) {
                const avatarUploadResult = await uploadImage(
                    userId,
                    avatarFile
                );
                if (!avatarUploadResult) {
                    throw new Error("Failed to upload avatar image");
                }

                const { imageName: avatarName, publicUrl: avatarUrl } =
                    avatarUploadResult;
                avatarImageId = await uploadUserImage(avatarUrl, avatarName);
            }

            // Upload background if it exists
            if (backgroundFile) {
                const backgroundUploadResult = await uploadImage(
                    userId,
                    backgroundFile
                );
                if (!backgroundUploadResult) {
                    throw new Error("Failed to upload background image");
                }

                const { imageName: backgroundName, publicUrl: backgroundUrl } =
                    backgroundUploadResult;
                backgroundImageId = await uploadUserImage(
                    backgroundUrl,
                    backgroundName
                );
            }

            // Update group profile
            const { error } = await supabase.rpc("update_group_profile", {
                avatar_image_id: avatarImageId,
                background_image_id: backgroundImageId,
                this_description: description,
                this_link: link,
                this_name: name,
                this_group_id: groupInfo.id,
            });

            if (error) {
                throw error;
            }

            // Clear inputs and close modal
            setName(groupInfo?.name);
            setdescription(groupInfo?.description);
            setLink(groupInfo?.link);
            setBackgroundFile(null);
            setAvatarFile(null);
            props.handleClose();
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error("Update failed:", error);
            setErrorMessage("Update failed, please try again in 10 seconds");
            setIsSendButtonDisabled(true);
            setTimeout(() => {
                setErrorMessage(null);
                setIsSendButtonDisabled(false);
            }, 10000);
        }
    };
    useEffect(() => {
        if (props.open && groupInfo) {
            // Reset lại các state về giá trị ban đầu khi modal mở
            setName(groupInfo.name || "");
            setdescription(groupInfo.description || "");
            setLink(groupInfo.link || "");

            // Reset lại avatar và background từ profile images
            if (profileImages) {
                setAvatar(profileImages.avatar || "");
                setBackground(profileImages.background || "");
            } else {
                setAvatar("");
                setBackground("");
            }

            // Clear các file đã chọn trước đó
            setAvatarFile(null);
            setBackgroundFile(null);
        }
    }, [props.open, groupInfo, profileImages]);

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
                            <img
                                src={background || profileImages?.background}
                                alt="Background"
                            />
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
                            src={avatar || profileImages?.avatar}
                            alt="avatar"
                            sx={{
                                width: "128px",
                                height: "128px",
                                border: "4px solid #1F1F1F",
                            }}
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
                                if (e.target.value.trim() !== "") {
                                    setNameError(null);
                                }
                            }}
                            className="nameInputField"
                            error={!!nameError}
                            helperText={nameError}
                        />
                    </div>
                    <div className="description">
                        <TextField
                            label="description"
                            variant="outlined"
                            fullWidth
                            multiline
                            minRows={3}
                            maxRows={10}
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                            sx={{ mt: 2, mb: 2 }}
                            className="customScrollbar contentField"
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
                <div className="option">
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

export default UpdateGroupProfileModal;
