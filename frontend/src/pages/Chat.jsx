import { useDispatch } from 'react-redux';
import { AttachFile as AttachFileButton, Send as SendIcon } from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import FileMenu from "../components/dialogs/FileMenu";
import { useErrors, useSocketEvents } from "../components/hooks/hooks";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/styledComponent";
import { grayColor, orange } from "../constants/color";
import { NEW_MESSAGE, START_TYPING } from '../constants/events';
import { useGetChatDetailsQuery, useGetChatMessagesQuery } from "../redux/api/api";
import { getSocket } from "../Socket";
import { useInfiniteScrollTop } from '6pp'
import { setIsFileMenu } from '../redux/reducers/miscSlice';
import { removeNewMessageAlert } from '../redux/reducers/chatSlice';

const ChatContent = ({ chatId, user }) => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const containerRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [page, setPage] = useState(1);
  const chatDetails = useGetChatDetailsQuery({ chatId }, { skip: !chatId })
  let oldMessagesChunk = useGetChatMessagesQuery({ chatId, page })
  const members = chatDetails?.data?.chat?.members;
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

  const messageChangeHandler = (e) => {
    setMessage(e.target.value);
    socket.emit(START_TYPING, { members, chatId })
  }

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId));
    return () => {
      setMessage("")
      setMessageList([])
      setPage(1)
      setOldMessages([])
    }
  }, [chatId])

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
    if (data.chatId !== chatId) return;
    console.log("typing", data)
  }, [chatId]);

  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setMessageList((prev) => [...prev, data.message]);
  }, [chatId]);


  const eventHandler = {
    [NEW_MESSAGE]: newMessageListener,
    [START_TYPING]: startTypingListener
  }


  useSocketEvents(socket, eventHandler)
  const allMessages = [...oldMessages, ...messageList]
  return chatDetails.isLoading ? <Skeleton /> : (<>
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