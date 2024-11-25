import React from "react";
import "./Modal.scss";

interface ModalProps {
    message: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;