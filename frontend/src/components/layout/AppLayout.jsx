import { Drawer, Grid2, Skeleton } from "@mui/material";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetChatsQuery } from "../../redux/api/api";
import { setIsMobile } from "../../redux/reducers/miscSlice";
import { getSocket } from "../../Socket";
import { useErrors, useSocketEvents } from "../hooks/hooks";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constants/events";
import { incrementNotficationCount, setNewMessagesAlert } from "../../redux/reducers/chatSlice";
import { getOrSaveFromStorage } from "../../lib/features";

const AppLayout = ({ WrappedContent, ...props }) => {
  const params = useParams();
  const chatId = params.chatId;
  const { isMobile } = useSelector(state => state.misc)
  const { user } = useSelector(state => state.auth)
  const {newMessageAlert} = useSelector(state => state.chat)
  const dispatch = useDispatch();
  const socket = getSocket();
  const { data, isLoading, isError, error, refetch } = useGetChatsQuery();

  // console.log("newMessagesAlert", newMessageAlert);

  const newMessageAlertHandler = useCallback((data) => {
    if(data.chatId !== chatId) dispatch(setNewMessagesAlert(data))
  }, [chatId, dispatch])

  const newRequestHandler = useCallback(() => {
    dispatch(incrementNotficationCount())
  }, [dispatch])

  useEffect(() => {
    if (user) refetch();
  }, [user])

  useEffect(() => {
    getOrSaveFromStorage({key : NEW_MESSAGE_ALERT, value : newMessageAlert})
  }, [newMessageAlert])

  useErrors([{ isError, error }]);

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    console.log("Delete chat", _id, groupChat);
  };

  const eventHandler = {
    [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
    [NEW_REQUEST]: newRequestHandler
  }

  useSocketEvents(socket, eventHandler)

  return (
    <>
      <Title />
      <Header />
      {
        isLoading ? <Skeleton /> : (
          <Drawer open={isMobile} onClose={() => dispatch(setIsMobile(false))}>
            {isLoading ? <Skeleton /> :
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessageAlert}
              />
            }
          </Drawer>
        )
      }
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
          sm={4}
          md={3}
          sx={{
            display: { xs: "none", sm: "block" },
            flexGrow: "1",
            maxWidth: "25%",
            boxSizing: "border-box",
            margin: "0.5rem",
            borderRadius: "25px"
          }}
          height={"100%"}

        >
          {/* First */}
          {
            isLoading ? <Skeleton /> :
              (<ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessageAlert}
              // onlineUsers={["1", "2"]}
              />)
          }
        </Grid2>
        <Grid2
          xs={12}
          sm={8}
          md={5}
          lg={6}
          height={"100%"}
          sx={{
            flexGrow: "2",
            margin: "0.5rem",
            borderRadius: "25px",
            maxWidth: "50%"
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
            borderRadius: "25px"
          }}
        >
          <Profile />
        </Grid2>
      </Grid2 >
      {/* <Footer /> */}
    </>
  );
};

export default AppLayout;
