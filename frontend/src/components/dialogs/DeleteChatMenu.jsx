import { useEffect } from 'react'
import { Menu, Stack, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/miscSlice'
import { ExitToApp as ExitToAppIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../hooks/hooks'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {

    const navigate = useNavigate();
    const { isDeleteMenu, selectedDeleteChat } = useSelector(state => state.misc)
    const isGroup = selectedDeleteChat.groupChat;
    const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation)

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false))
        deleteMenuAnchor.current = null
    }

    const leaveChatHandler = () => {
        closeHandler()
        if (isGroup) leaveGroup("Leaving Group", selectedDeleteChat.chatId)
        else deleteChat("Deleting Chat", selectedDeleteChat.chatId)
    }

    useEffect(() => {
        if (deleteChatData || leaveGroupData) navigate("/")
    }, [deleteChatData, leaveGroupData])

    return (
        <Menu
            open={isDeleteMenu}
            onClose={closeHandler}
            anchorEl={deleteMenuAnchor.current}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right"
            }}
        >
            <Stack sx={{
                width: "10rem",
                padding: "0.5rem",
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.1)"
                }
            }}
                direction={"row"}
                alignItems={"center"}
                spacing={"0.5rem"}
                onClick={leaveChatHandler}
            >
                {
                    isGroup ? (
                        <>
                            <ExitToAppIcon />
                            <Typography>Leave Group</Typography>
                        </>
                    ) : (
                        <>
                            <DeleteIcon />
                            <Typography>Delete Chat</Typography>
                        </>
                    )
                }
            </Stack>
        </Menu>)
}

export default DeleteChatMenu