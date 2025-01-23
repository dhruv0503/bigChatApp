import React from 'react'
import { transformImage } from '../../lib/features'
import { FileOpen as FileOpenIcon } from '@mui/icons-material'

const RenderAttachment = ({ file, url }) => {
    if (file === "video") {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer">
                <video src={url} preload='none' width={"200px"} controls />
            </a>
        )
    }
    else if (file === "image") {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer">
                <img src={transformImage(url, 200)} alt="attachment" width={"200px"} height={"150px"} style={{
                    objectFit: "contain"
                }} />
            </a>
        )
    }
    else if (file === "audio") {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer">
                <audio src={url} preload='none' controls />
            </a>
        )
    }
    else return < FileOpenIcon />
}

export default RenderAttachment