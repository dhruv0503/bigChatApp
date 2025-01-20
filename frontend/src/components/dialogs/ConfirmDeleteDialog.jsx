import { Dialog, DialogTitle, DialogContent, DialogContentText , DialogActions, Button} from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog = ({ open, handleClose, deleteHandler }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle> Confirm Delete? </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this chat? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={deleteHandler} color="error">Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDeleteDialog