import { Button, IconButton, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { deleteMessage } from "../../../api/messageAPI";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../reduxState/store";
import { updateMessageStatus } from "../../../reduxState/reducer/messageReducer";
import "./confirmDeleteModal.scss";
interface confirmDeleteProps {
  open: boolean;
  handleClose: () => void;
  messageId: number;
}

const ConfirmDeleteModal = (props: confirmDeleteProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = async () => {
    setUploading(true);
    await deleteMessage(props.messageId);
    dispatch(updateMessageStatus({ id: props.messageId, isDeleted: true })); // Cập nhật trạng thái
    console.log("Deleted message:", props.messageId);
  };
  return (
    <Modal
      open={props.open}
      onClose={uploading ? () => {} : props.handleClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div className="delete-modal customScrollbar">
        <div className="header">
          <div className="none"></div>
          <Typography
            className="delete-modal-title"
            variant="h6"
            component="h2"
          >
            Confirm Delete
          </Typography>
          <IconButton
            onClick={uploading ? () => {} : props.handleClose}
            className="delete-modal-title"
          >
            X
          </IconButton>
        </div>
        <div className="mainContent">
          Are you sure you want to delete this message?
        </div>
        <div className="deleteOption">
          <Button
            className="cancle-button"
            variant="contained"
            onClick={props.handleClose}
          >
            Cancel
          </Button>
          <Button
            className="delete-button"
            variant="contained"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
