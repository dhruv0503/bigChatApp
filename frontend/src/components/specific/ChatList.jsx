/* eslint-disable react/prop-types */
import { Stack } from "@mui/material";
import { bgGradient } from "../../constants/color";
import ChatItem from "../shared/ChatItem";
import { useMemo } from "react";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineFriends = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {

  const onlineUserIds = useMemo(() => new Set(onlineFriends.map((user) => user._id.toString())), [onlineFriends]);


  return (
    <Stack
      direction={"column"}
      width={w}
      overflow={"auto"}
      height="100%"
      sx={{ backgroundImage: bgGradient, borderRadius: "25px" }}
    >
      {chats?.map((data, idx) => {
        const { avatar, _id, name, groupChat, members } = data;
        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );
        const isOnline = members?.some((member) => onlineUserIds.has(member));
        return (
          <ChatItem
            index={idx}
            key={_id}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            username={name}
            _id={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
