import { useDispatch, useSelector } from 'react-redux';
import { AttachFile as AttachFileButton, Send as SendIcon } from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import FileMenu from "../components/dialogs/FileMenu";
import { useErrors, useSocketEvents } from "../components/hooks/hooks";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/styledComponent";
import { grayColor, orange } from "../constants/color";
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useGetChatDetailsQuery, useGetChatMessagesQuery } from "../redux/api/api";
import { getSocket } from "../Socket";
import { useInfiniteScrollTop } from '6pp'
import { setIsFileMenu } from '../redux/reducers/miscSlice';
import { removeNewMessageAlert } from '../redux/reducers/chatSlice';
import { TypingLoader } from '../components/layout/Loaders';

const ChatContent = ({ chatId, user }) => {
  const authState = useSelector(state => state.auth)
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

  const chatDetails = useGetChatDetailsQuery({ chatId }, { skip: !chatId })

  let oldMessagesChunk = useGetChatMessagesQuery({ chatId, page })
  const members = chatDetails?.data?.chat?.members;

  // console.log(userTyping)

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.messages
  )

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk?.isError, error: oldMessagesChunk?.error }
  ]

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId));
    return () => {
      setMessage("")
      setMessageList([])
      setPage(1)
      setOldMessages([])
    }
  }, [chatId])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messageList])


  const messageChangeHandler = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      socket.emit(START_TYPING, { members, chatId })
      setTyping(true)
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId })
      setTyping(false)
    }, [2000])
  }

  useErrors(errors)

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
    dispatch(setIsFileMenu(true))
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const submitHanlder = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message })
    setMessage("");
  }

  const newMessageListener = useCallback((data) => {
    // console.log(data.userId, authState.user._id)
    if (data.chatId !== chatId) return;
    setMessageList((prev) => [...prev, data.message]);
  }, [chatId]);

  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId || data.userId.toString() === authState.user._id) return;
    setUserTyping(true);
  }, [chatId]);

  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId || data.userId.toString() === authState.user._id) return;
    setUserTyping(false);
  }, [chatId]);

  const alertListener = useCallback((data) => {
    const messageForAlert = {
      content: data,
      sender: {
        _id: "67c8485d8b5433d4cca2e1bb",
        username: "Admin1"
      },
      chatId,
      createdAt: new Date().toISOString()
    }
    setMessageList((prev) => [...prev, messageForAlert]);
  }, [chatId])

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessageListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener
  }


  useSocketEvents(socket, eventHandler)

  const allMessages = [...oldMessages, ...messageList]
  return chatDetails.isLoading ? <Skeleton /> : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          margin: 0,
          borderRadius: "25px",
        }}>
        {/* {console.log(messageList)} */}
        {allMessages.map((msg) => (
          msg && <MessageComponent key={msg?._id} message={msg} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />

      </Stack >
      <form style={{ height: "10%" }} onSubmit={submitHanlder}>
        <Stack direction={"row"} height={"100%"} padding={"1rem 0"} alignItems={"center"} position={"relative"} boxSizing={"border-box"} sx={{
          width: "100%"
        }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              position: "absolute",
              left: "0.5rem"
            }}
          >
            <AttachFileButton />
          </IconButton>

          <InputBox placeholder="Type Message Here..."
            value={message}
            onChange={messageChangeHandler}
          />

          <IconButton type="submit" sx={{
            bgcolor: orange,
            color: "white",
            padding: "0.5rem",
            "&:hover": {
              backgroundColor: "error.dark"
            }
          }}>
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={menuAnchor} chatId={chatId} />
    </>
  );
};

const Chat = (props) => <AppLayout WrappedContent={ChatContent} {...props} />;

export default Chat;