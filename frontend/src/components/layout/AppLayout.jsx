import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid2 } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";

const AppLayout = ({ WrappedContent, ...props }) => {
  const params = useParams();
  const chatId = params.chatId;

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    console.log("Delete chat", _id, groupChat);
  };

  return (
    <>
      <Title />
      <Header />
      <Grid2
        container
        sx={{
          height: "calc(100vh - 4rem)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Grid2
          item
          sm={4}
          md={3}
          sx={{
            display: { xs: "none", sm: "block" },
            flexGrow: "1",
            maxWidth: "25%",
          }}
          height={"100%"}
        >
          {/* First */}
          <ChatList
            chats={sampleChats}
            chatId={chatId}
            handleDeleteChat={handleDeleteChat}
            // onlineUsers={["1", "2"]}
          />
        </Grid2>
        <Grid2
          item
          xs={12}
          sm={8}
          md={5}
          lg={6}
          height={"100%"}
          sx={{ flexGrow: "2" }}
        >
          <WrappedContent {...props} />
        </Grid2>
        <Grid2
          item
          md={4}
          lg={3}
          sx={{
            display: { xs: "none", md: "block" },
            height: "100%",
            bgcolor: "rgba(0,0,0,0.7)",
            flexGrow: "1",
            maxWidth: "25%",
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
