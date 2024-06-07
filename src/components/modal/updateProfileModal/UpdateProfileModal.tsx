import { Avatar, Button, IconButton, Modal, TextField, Typography } from '@mui/material'
import './updateProfileModal.scss'
import { useRef } from 'react';
interface UPModalProps {
    open: boolean;
    handleClose: () => void;
    userid?: string;
}
const UpdateProfileModal = (props: UPModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleImageChange = () => {
        console.log("none");
    }
    const handleSend = () => {
        console.log("Content 1:");
        console.log("Content 2:");
        //liệt kê 2 tấm hình ở đây bằng console log
        //cho tất cả bằng close
        props.handleClose();
    };
    const isSendButtonDisabled = true;//sửa logic nếu không có gì thay đổi thì disable
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
                <div className="imageInput">
                    <div className="background">
                        <img src="" alt="" />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            hidden
                            multiple
                        />
                    </div>
                    <div className="avatar">
                        <Avatar
                            className="Avatar"
                            src="https://cdn.donmai.us/original/5f/ea/__firefly_honkai_and_1_more_drawn_by_baba_ba_ba_mb__5feaaa99527187a3db0e437380ec3932.jpg"
                            alt="avatar"
                            sx={{ width: "128px", height: "128px", border: "4px solid #1F1F1F" }} />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            hidden
                            multiple
                        />
                    </div>
                </div>
                <div className="textInput">
                    <div className="name">
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
                    <div className="bio">
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
                    <div className="link">
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
    )
}

export default UpdateProfileModal