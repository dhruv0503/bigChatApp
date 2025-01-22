/* eslint-disable react/prop-types */
import { memo } from "react";
import { StyledLink } from "../styles/styledComponent";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "../shared/AvatarCard";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <StyledLink
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.5rem",
          gap: "1rem",
          cursor: "pointer",
          backgroundColor: sameSender ? "black" : "unset",
          position: "relative",
          color: sameSender ? "white" : "unset",
          overflow: "hidden"
        }}
      >
        <AvatarCard avatar={avatar} />
        <Stack >
          <Typography>{name}</Typography>
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Messages</Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </div>
    </StyledLink>
  );
};

export default memo(ChatItem);
