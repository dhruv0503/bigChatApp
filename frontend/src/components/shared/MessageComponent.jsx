import { Box, Typography } from '@mui/material';
import { memo } from 'react'
import { tealColor } from '../../constants/color';
import moment from 'moment';
import { fileFormat } from '../../lib/features';
import RenderAttachment from './RenderAttachment';

const MessageComponent = ({ message, user }) => {
    const { sender, content, attachments = [], createdAt } = message || {};
    const sameSender = sender?._id === user?._id;
    const timeAgo = moment(createdAt).fromNow()

    return (
        <div style={{
            alignSelf: sameSender ? "flex-end" : "flex-start",
            background: "white",
            color: "black",
            borderRadius: "5px",
            padding: "0.5rem",
            width: "fit-content",
            maxWidth: "70%"
        }}>
            {
                !sameSender && <Typography color={tealColor} fontWeight={600} variant='caption'>
                    {sender?.username}
                </Typography>
            }
            {
                content && <Typography>{content}</Typography>
            }
            {attachments.length > 0 && (
                attachments.map((attach, idx) => {
                    const url = attach.url;
                    const file = fileFormat(url);
                    return <Box key={idx}>
                        <RenderAttachment key={idx} file={file} url={url} />
                    </Box>
                })
            )}
            <Typography variant='caption' color='text.secondary'>
                {timeAgo}
            </Typography>
        </div>
    )
}

export default MessageComponent;