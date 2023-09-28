import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useModal } from "../contexts/ModalContext";
import { Close } from "@mui/icons-material";

const Modal = () => {
  const { isOpen, modalContent, closeModal } = useModal();

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogActions>
        <IconButton onClick={closeModal} color="primary">
          <Close />
        </IconButton>
      </DialogActions>
      <DialogTitle>{modalContent?.title}</DialogTitle>
      <DialogContent style={{ minWidth: 300 }}>
        {modalContent?.body}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
