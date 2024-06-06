import { Button, IconButton, Modal, Typography } from '@mui/material'
import './updateProfileModal.scss'
import { useRef } from 'react';
interface UPModalProps {
    open: boolean;
    handleClose: () => void;
    userid?: string;
}
const UpdateProfileModal = ( props: UPModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleImageChange = () =>{
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
                    <div className="background"></div>
                    <div className="avatar"></div>
                </div>
                <div className="textInput">
                    <div className="name"></div>
                    <div className="bio"></div>
                    <div className="link"></div>
                </div>
                <div className='option'>
                    <div>
                        
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
                            up
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
  )
}

export default UpdateProfileModal