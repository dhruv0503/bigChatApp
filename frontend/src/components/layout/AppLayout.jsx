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
          <ChatList
            chats={sampleChats}
            chatId={chatId}
            handleDeleteChat={handleDeleteChat}
          // onlineUsers={["1", "2"]}
          />
        </Grid2>
        <Grid2
          xs={12}
          sm={8}
          md={5}
          lg={6}
          height={"100%"}
          sx={{
            flexGrow: "2",
            margin : "0.5rem",
            borderRadius: "25px",
          }}
        >
          <WrappedContent {...props} />
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
      </Grid2>
      {/* <Footer /> */}
    </>
  );
};

export default AppLayout;
