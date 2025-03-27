import { useState } from 'react';
import { Drawer, Grid2, Skeleton } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FRIEND_JOINED,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
  FRIEND_LEFT
} from "../../constants/events";
import { getOrSaveFromStorage } from "../../lib/features";
import { useGetChatsQuery } from "../../redux/api/api";
import {
  incrementNotficationCount,
  setNewMessagesAlert,
} from "../../redux/reducers/chatSlice";
import {
  setAreOptionsOpen,
  setIsDeleteMenu,
  setSelectedDeleteChat
} from "../../redux/reducers/miscSlice";
import { getSocket } from "../../Socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import { useErrors, useSocketEvents } from "../hooks/hooks";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import OptionsSidebar from "../specific/OptionsSidebar";
import Profile from "../specific/Profile";
import Header from "./Header";

const AppLayout = ({ WrappedContent, ...props }) => {
  const params = useParams();
  const navigate = useNavigate();
  const chatId = params.chatId;
  const socket = getSocket();
  const deleteMenuAnchor = useRef(null);

  const dispatch = useDispatch();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { isMobile, areOptionsOpen } = useSelector((state) => state.misc);
  const { newMessageAlert } = useSelector((state) => state.chat);
  const { data, isLoading, isError, error, refetch } = useGetChatsQuery();

  const newMessageAlertListener = useCallback(
    (data) => {
      console.log("New message alert", data);
      if (data.chatId !== chatId) dispatch(setNewMessagesAlert(data));
    },
    [chatId, dispatch]
  );

  const newRequestListener = useCallback(() => {
    dispatch(incrementNotficationCount());
  }, [dispatch]);

  const refetchListener = useCallback(
    (data = {}) => {
      refetch();
      if (data?.users?.includes(user?._id)) navigate("/");
    },
    [refetch, navigate, user?._id]
  );

  const friendJoinedListener = useCallback((data) => {
    setOnlineUsers((prev) => [...prev, data.userId])
  }, [])

  const friendLeftListener = useCallback((data) => {
    setOnlineUsers((prev) => prev.filter((id) => id !== data.userId))
  }, [])

  useEffect(() => {
    if (user && !data) refetch();
  }, [user, data, refetch]);

  useEffect(() => {
    getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessageAlert });
  }, [newMessageAlert]);

  useErrors([{ isError, error }]);

  const handleDeleteChat = (e, chatId, groupChat) => {
    dispatch(setIsDeleteMenu(true));
    dispatch(setSelectedDeleteChat({ chatId, groupChat }));
    deleteMenuAnchor.current = e.currentTarget;
  };

  const eventHandler = {
    [NEW_MESSAGE_ALERT]: newMessageAlertListener,
    [NEW_REQUEST]: newRequestListener,
    [REFETCH_CHATS]: refetchListener,
    [FRIEND_JOINED]: friendJoinedListener,
    [FRIEND_LEFT]: friendLeftListener
  };

  useSocketEvents(socket, eventHandler);

  return (
    <>
      <Title />
      <Header />
      <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />
      {isLoading ? (
        <Skeleton />
      ) : (
        <Drawer open={areOptionsOpen} onClose={() => dispatch(setAreOptionsOpen(false))}>
          {isLoading ? (
            <Skeleton />
          ) : (
            <OptionsSidebar />
          )}
        </Drawer>
      )}
      <Grid2
        container={true}
        sx={{
          height: "calc(100vh - 6rem)",
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Grid2
          xs={12}
          sm={4}
          md={3}
          sx={{
            flexGrow: "1",
            maxWidth: {
              xs: "100%",
              sm: "33%",
              md: "25%",
            },
            boxSizing: "border-box",
            margin: "0.5rem",
            borderRadius: "25px",
            display: {
              xs: isMobile ? "none" : "block",
              sm: "block"
            }
          }}
          height={"100%"}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessageAlert}
              onlineUsers={onlineUsers}
            />
          )}
        </Grid2>
        <Grid2
          xs={0}
          sm={8}
          md={6}
          height={"100%"}
          display={{ xs: isMobile ? "block" : "none", sm: "block" }}
          sx={{
            flexGrow: "2",
            margin: "0.5rem",
            borderRadius: "25px",
            maxWidth: {
              xs: "100%",
              sm: "67%",
              md: "50%",
            },
          }}
        >
          <WrappedContent {...props} chatId={chatId} user={user} />
        </Grid2>
        <Grid2
          md={4}
          lg={3}
          sx={{
            display: { xs: "none", md: "block" },
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            flexGrow: "1",
            maxWidth: "25%",
            margin: "0.5rem",
            borderRadius: "25px",
          }}
        >
          <Profile />
        </Grid2>
      </Grid2>
      {/* <Footer /> */}
    </>
  );
};

export default AppLayout;
