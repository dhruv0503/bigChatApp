/* eslint-disable react/prop-types */
import { memo } from "react";
import { StyledLink } from "../styles/styledComponent";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "../shared/AvatarCard";
import { useDispatch } from "react-redux";
import { setIsMobile } from "../../redux/reducers/miscSlice";

const ChatItem = ({
  avatar = [],
  username,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const dispatch = useDispatch();

  return (
    <StyledLink
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      onClick={() => dispatch(setIsMobile(false))}
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
          <Typography>{username}</Typography>
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
