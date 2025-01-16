import React, { useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Stack, IconButton } from "@mui/material";
import { InputBox } from "../components/styles/styledComponent";
import { AttachFile as AttachFileButton, Send as SendIcon } from "@mui/icons-material";
import { grayColor, orange } from "../constants/color";
import FileMenu from "../components/dialogs/FileMenu";
import { sampleMessage, sampleUsers } from "../constants/sampleData";
import MessageComponent from "../components/shared/MessageComponent";

const ChatContent = () => {

  const [menuAnchor, setMenuAnchor] = useState(null); // State to track menu anchor
  const containerRef = useRef(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget); // Set the clicked element as the anchor
  };

  const handleMenuClose = () => {
    setMenuAnchor(null); // Close the menu
  };

  return (<>

    <Stack ref={containerRef} boxSizing={"border-box"} padding={"1rem"} spacing={"1rem"} bgcolor={grayColor} height={"90%"} sx={{
      overflowX: "hidden",
      overflowY: "auto",
      margin: 0
    }}>
      {

        sampleMessage.map((msg) => {
          return <MessageComponent key={msg._id} message={msg} user={sampleUsers[0]} />
        })
      }
    </Stack >
    <form style={{ height: "10%" }}>
      <Stack direction={"row"} height={"100%"} padding={"1rem 0"} alignItems={"center"} position={"relative"} boxSizing={"border-box"} sx={{
        paddingRight: "1rem"
      }}>
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            position: "absolute",
            left: "0.5rem"
          }}>
          <AttachFileButton />
        </IconButton>

        <InputBox placeholder="Type Message Here..." />

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
