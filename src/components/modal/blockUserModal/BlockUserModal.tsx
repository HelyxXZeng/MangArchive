import { Button, IconButton, Modal, Typography } from "@mui/material";
import { blockUser } from "../../../api/userAPI";
import "./blockUserModal.scss";
interface BlockUserProps {
  open: boolean;
  handleClose: () => void;
  currentUID: number;
  targetUID: number;
  targetName: string;
  handleBlock: () => void;
}

const BlockUserModal = (props: BlockUserProps) => {
  const handleBlock = async () => {
    await blockUser(props.currentUID, props.targetUID);
    props.handleBlock();
    props.handleClose();
  };
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="block-modal-title"
      aria-describedby="block-modal-description"
    >
      <div className="block-modal customScrollbar">
        <div className="header">
          <div className="none"></div>
          <Typography className="block-modal-title" variant="h6" component="h2">
            Confirm block {props.targetName}?
          </Typography>
          <IconButton onClick={props.handleClose} className="block-modal-title">
            X
          </IconButton>
        </div>
        <div className="mainContent">
          <span>{props.targetName} can not:</span>
          <ul>
            <li>Watch your post</li>
            <li>Invite you to join Group</li>
            <li>Chat with you</li>
            <li>Following you</li>
          </ul>
          <span>
            If you and {props.targetName} are friend, blocking{" "}
            {props.targetName} will unfollwing his/her
          </span>
        </div>
        <div className="blockOption">
          <Button
            className="cancle-button"
            variant="contained"
            onClick={props.handleClose}
          >
            Cancel
          </Button>
          <Button
            className="block-button"
            variant="contained"
            onClick={handleBlock}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BlockUserModal;
