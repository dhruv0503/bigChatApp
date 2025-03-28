/* eslint-disable react/prop-types */
import { Box, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { useDispatch } from "react-redux";
import { setIsMobile } from "../../redux/reducers/miscSlice";
import AvatarCard from "../shared/AvatarCard";
import { StyledLink } from "../styles/StyledComponent";

const ChatItem = ({
  avatar = [],
  username,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  handleDeleteChat,
}) => {
  const dispatch = useDispatch();

  return (
    <StyledLink
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      onClick={() => dispatch(setIsMobile(true))}
    >
      <Stack
        direction={"row"}
        sx={{
          alignItems: "center",
          padding: "0.5rem",
          cursor: "pointer",
          backgroundColor: sameSender ? "black" : "unset",
          position: "relative",
          color: sameSender ? "white" : "unset",
          overflow: "hidden",
          gap : {
            xs : groupChat ? "1.5rem" : "unset",
            sm : "unset"
          },
        }}
      >
        <AvatarCard avatar={avatar} />
        <Stack sx={{margin : groupChat ? "0 1rem" : "unset"}}>
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
      </Stack>
    </StyledLink >
  );
};

export default memo(ChatItem);
