/* eslint-disable react/prop-types */
import { memo } from "react";
import { StyledLink } from "../styles/styledComponent";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "../shared/AvatarCard";
import { useDispatch } from "react-redux";
import { setIsMobile } from "../../redux/reducers/miscSlice";
import { delay, motion } from "framer-motion";

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
      <motion.div
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
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
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
      </motion.div>
    </StyledLink >
  );
};

export default memo(ChatItem);
