import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useModal } from "../contexts/ModalContext";

const Modal = () => {
  const { isOpen, modalContent, closeModal } = useModal();

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogTitle>{modalContent?.title}</DialogTitle>
      <DialogContent>{modalContent?.body}</DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
