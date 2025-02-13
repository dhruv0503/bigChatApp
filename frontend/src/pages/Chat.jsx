import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Stack, IconButton, Skeleton } from "@mui/material";
import { InputBox } from "../components/styles/styledComponent";
import { AttachFile as AttachFileButton, Send as SendIcon } from "@mui/icons-material";
import { grayColor, orange } from "../constants/color";
import FileMenu from "../components/dialogs/FileMenu";
import { sampleMessage, sampleUsers } from "../constants/sampleData";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../Socket";
import { NEW_MESSAGE } from '../constants/events'
import { useGetChatDetailsQuery } from "../redux/api/api";
import { useSocketEvents } from "../components/hooks/hooks";
import { useSelector } from "react-redux";

const ChatContent = ({ chatId }) => {

  const socket = getSocket();
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const containerRef = useRef(null);
  const { user } = useSelector(state => state.auth);

  const chatDetails = useGetChatDetailsQuery({ chatId, skip: !chatId })
  const members = chatDetails?.data?.chat?.members || [];

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
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

  const newMessageHandler = useCallback((data) => {
    console.log("Received message:", data);
    if (data?.message) {
      setMessageList((prev) => [...prev, data.message]);
    }
  }, []);


  const eventHandler = useMemo(() => ({ [NEW_MESSAGE]: newMessageHandler }), [newMessageHandler])
  useSocketEvents(socket, eventHandler)

  return chatDetails.isLoading ? <Skeleton /> : (<>

    <Stack ref={containerRef} boxSizing={"border-box"} padding={"1rem"} spacing={"1rem"} bgcolor={grayColor} height={"90%"} sx={{
      overflowX: "hidden",
      overflowY: "auto",
      margin: 0,
      borderRadius: "25px"
    }}>
      {
        messageList.map((msg) => {
          return <MessageComponent key={msg?._id} message={msg} user={user._id} />
        })
      }
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
          }}>
          <AttachFileButton />
        </IconButton>

        <InputBox placeholder="Type Message Here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
    <FileMenu anchorE1={menuAnchor} handleClose={handleMenuClose} />
  </>
  );
};

const Chat = (props) => <AppLayout WrappedContent={ChatContent} {...props} />;

export default Chat;