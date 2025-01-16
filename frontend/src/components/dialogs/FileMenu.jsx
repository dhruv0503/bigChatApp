import { Menu } from '@mui/material'
import React from 'react'

const FileMenu = ({ anchorE1, handleClose }) => {
    return (
        <Menu open={Boolean(anchorE1)} anchorEl={anchorE1} onClose={handleClose}> <div>
            sad</div></Menu>
    )
}

export default FileMenu