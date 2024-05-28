import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function ConfirmationDialog({ open, onClose, onConfirm, title, content, loading }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
            {loading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <Button onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={onConfirm} color="primary" disabled={loading}>Confirm</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}