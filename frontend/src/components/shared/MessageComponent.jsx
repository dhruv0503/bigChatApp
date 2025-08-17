import { Box, Typography } from '@mui/material';
import { memo } from 'react'
import { tealColor } from '../../constants/color';
import moment from 'moment';
import { fileFormat } from '../../lib/features';
import RenderAttachment from './RenderAttachment';
import { motion } from 'framer-motion'

const MessageComponent = ({ message, user }) => {
    const { sender, content, attachments = [], createdAt } = message || {};
    console.log(message)
    const sameSender = sender?._id === user?._id;
    const timeAgo = moment(createdAt).fromNow()

    const isAdminMessage = message.sender?._id.toString() === import.meta.env.VITE_ADMIN_ID;

    return (
        <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            whileInView={{ opacity: 1, x: 0 }}
            style={{
                alignSelf: sameSender ? "flex-end" : isAdminMessage ? "center" : "flex-start",
                background: isAdminMessage ? "rgb(235, 235, 235)" : "white",
                color: "black",
                borderRadius: "5px",
                padding: isAdminMessage ? "0.2rem" : "0.5rem",
                width: "fit-content",
                maxWidth: "80%",
            }}>
            {
                !isAdminMessage && !sameSender && <Typography color={tealColor} fontWeight={600} variant='caption'>
                    {sender?.username}
                </Typography>
            }
            {
                content && <Typography sx={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>{content}</Typography>
            }
            {attachments.length > 0 && (
                attachments.map((attach, idx) => {
                    const url = attach.url;
                    const file = fileFormat(url);
                    return <Box key={idx}>
                        <a
                            href={url}
                            target="_blank"
                            download
                            style={{
                                color: "black",
                            }}
                            key={idx}
                        >
                            {RenderAttachment(file, url)}
                        </a>
                    </Box>
                })
            )}
            {!isAdminMessage && <Typography variant='caption' color='text.secondary'>
                {timeAgo}
            </Typography>
            }
        </motion.div>
    )
}

export default memo(MessageComponent);