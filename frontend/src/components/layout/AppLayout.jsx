import { Drawer, Grid2, Skeleton } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetChatsQuery } from "../../redux/api/api";
import { setIsMobile } from "../../redux/reducers/miscSlice";
import { getSocket } from "../../Socket";
import { useErrors } from "../hooks/hooks";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";

const AppLayout = ({ WrappedContent, ...props }) => {
  const params = useParams();
  const chatId = params.chatId;
  const { isMobile } = useSelector(state => state.misc)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const socket = getSocket();
  const { data, isLoading, isError, error, refetch } = useGetChatsQuery();

  useEffect(() => {
    if (user) refetch();
  }, [user])

  useErrors([{ isError, error }]);

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    console.log("Delete chat", _id, groupChat);
  };

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
              // onlineUsers={["1", "2"]}
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
            maxWidth : "50%"
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
      {/* <Footer /> */ }
    </>
  );
};

export default AppLayout;
