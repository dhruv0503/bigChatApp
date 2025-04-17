import {useInfiniteScrollTop} from '6pp';
import {AttachFile as AttachFileButton, Home as HomeIcon, Send as SendIcon} from "@mui/icons-material";
import {IconButton, Skeleton, Stack, Box} from "@mui/material";
import {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import FileMenu from "../components/dialogs/FileMenu";
import {useErrors, useSocketEvents} from "../components/hooks/hooks";
import AppLayout from "../components/layout/AppLayout";
import {TypingLoader} from '../components/layout/Loaders';
import MessageComponent from "../components/shared/MessageComponent";
import {InputBox} from "../components/styles/StyledComponent";
import {grayColor, orange} from "../constants/color";
import {NEW_MESSAGE, START_TYPING, STOP_TYPING} from '../constants/events';
import {useGetChatDetailsQuery, useGetChatMessagesQuery} from "../redux/api/api";
import {removeNewMessageAlert} from '../redux/reducers/chatSlice';
import {setIsFileMenu, setIsMobile} from '../redux/reducers/miscSlice';
import {getSocket} from "../Socket";

const ChatContent = ({chatId, user}) => {
    const authState = useSelector(state => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();
    const containerRef = useRef(null);
    const bottomRef = useRef(null)

    const [typing, setTyping] = useState(false);
    const [userTyping, setUserTyping] = useState(false);
    const typingTimeout = useRef(null)

    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [page, setPage] = useState(1);
    const inputRef = useRef(null);

    const chatDetails = useGetChatDetailsQuery({chatId}, {skip: !chatId})

    let oldMessagesChunk = useGetChatMessagesQuery({id: chatId, page})
    const members = chatDetails?.data?.chat?.members;

    const {data: oldMessages, setData: setOldMessages} = useInfiniteScrollTop(
        containerRef,
        oldMessagesChunk?.data?.totalPages,
        page,
        setPage,
        oldMessagesChunk?.data?.messages
    )

    const errors = [
        {isError: chatDetails.isError, error: chatDetails.error},
        {isError: oldMessagesChunk?.isError, error: oldMessagesChunk?.error}
    ]

    useEffect(() => {
        dispatch(removeNewMessageAlert(chatId));
        if (inputRef.current) inputRef.current.focus()
        return () => {
            setMessage("")
            setMessageList([])
            setPage(1)
            setOldMessages([])
        }
    }, [chatId, socket])

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: "smooth"})
        }
    }, [messageList])

    useEffect(() => {
        if (chatDetails.isError) navigate('/')
    }, [chatDetails, navigate])

    const messageChangeHandler = (e) => {
        setMessage(e.target.value);
        if (!typing) {
            socket.emit(START_TYPING, {members, chatId})
            setTyping(true)
        }
        if (typingTimeout.current) clearTimeout(typingTimeout.current)

        typingTimeout.current = setTimeout(() => {
            socket.emit(STOP_TYPING, {members, chatId})
            setTyping(false)
        }, 2000)
    }

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
        dispatch(setIsFileMenu(true))
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        socket.emit(NEW_MESSAGE, {chatId, members, message})
        setMessage("");
    }

    const newMessageListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setMessageList((prev) => [...prev, data.message]);
    }, [chatId]);

    const startTypingListener = useCallback((data) => {
        if (data.chatId !== chatId || data?.userId?.toString() === authState?.user?._id) return;
        setUserTyping(true);
    }, [chatId]);

    const stopTypingListener = useCallback((data) => {
        if (data.chatId !== chatId || data.userId.toString() === authState?.user?._id) return;
        setUserTyping(false);
    }, [chatId]);


    const eventHandler = {
        [NEW_MESSAGE]: newMessageListener,
        [START_TYPING]: startTypingListener,
        [STOP_TYPING]: stopTypingListener
    }

    useSocketEvents(socket, eventHandler)
    useErrors(errors)


    const allMessages = [...oldMessages, ...messageList]
    return chatDetails.isLoading ? <Skeleton height={"100vh"}/> : (
        <>
            <Stack
                ref={containerRef}
                padding={"1rem"}
                spacing={"1rem"}
                bgcolor={grayColor}
                height={"90%"}
                boxSizing="border-box"
                alignContent="space-between"
                sx={{
                    overflowX: "hidden",
                    overflowY: "auto",
                    margin: 0,
                    borderRadius: "25px",
                }}>
                {allMessages.map((msg) => (
                    msg && <MessageComponent key={msg?._id} message={msg} user={user}/>
                ))}

                {userTyping && <TypingLoader/>}

                <div ref={bottomRef}/>
            </Stack>
            <Box sx={{
                height : "8%",
                marginTop : "1%"
            }}>
                <form onSubmit={submitHandler} style={{height : "100%"}}>
                    <Stack direction={"row"} height={"100%"} alignItems={"center"} position={"relative"}
                           boxSizing={"border-box"} sx={{
                        width: "100%",
                    }}>
                        <IconButton onClick={() => {
                            dispatch(setIsMobile(false))
                            navigate("/")
                        }}
                        sx={{
                            color: "rgb(32, 41, 43)",
                            bottom: "10%",
                            left: "1%",
                            display: {
                                xs: "flex",
                                sm: "none"
                                },
                            position: "absolute",
                        }}>
                            <HomeIcon/>
                        </IconButton>
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{
                                position: "absolute",
                                left: {xs: "7%", sm: "1%"},
                                bottom: "10%"
                            }}
                        >
                            <AttachFileButton/>
                        </IconButton>

                        <IconButton type="submit" sx={{
                            bgcolor: orange,
                            color: "white",
                            position: "absolute",
                            right: "2%",
                            bottom: "10%",
                            "&:hover": {
                                backgroundColor: "error.dark"
                            }
                        }}>
                            <SendIcon/>
                        </IconButton>

                        <InputBox placeholder="Type Message Here..." value={message} onChange={messageChangeHandler} ref={inputRef}
                        sx={{
                            marginTop: "1%",
                            padding: {
                                xs: "0 15%",
                                sm: "0 15% 0 10%",
                                lg: "0 10% 0 7%"
                            }
                        }}
                        />
                    </Stack>
                </form>
            </Box>
            <FileMenu anchorE1={menuAnchor} chatId={chatId}/>
        </>
    );
};

const Chat = (props) => <AppLayout WrappedContent={ChatContent} {...props} />;

export default Chat;