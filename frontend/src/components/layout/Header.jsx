import {
  Menu as MenuIcon
} from "@mui/icons-material";
import {
  AppBar,
  Backdrop,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Stack
} from "@mui/material";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orange } from "../../constants/color";
import { setAreOptionsOpen } from "../../redux/reducers/miscSlice";
import {
  AddGroupButton,
  LogoutButton,
  ManageGroupsButton,
  NotificationButton,
  SearchButton,
} from "../shared/IconButtons";
import { useParams } from "react-router-dom";
import { useGetChatDetailsQuery } from "../../redux/api/api";
import AvatarCard from "../shared/AvatarCard";


const Search = lazy(() => import("../specific/Search"));
const Notifications = lazy(() => import("../specific/Notifications"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const { user } = useSelector(state => state.auth)
  const params = useParams();
  const chatId = params?.chatId;
  const dispatch = useDispatch();
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const chatDetails = useGetChatDetailsQuery({ chatId, populate: true }, { skip: !chatId })
  const chatInfo = chatDetails?.data?.chat;
  const [openChatInfo, setOpenChatInfo] = useState({
    chat: "",
    avatar: []
  })

  useEffect(() => {
    if (chatInfo?.groupChat) {
      const groupAvatar = chatInfo?.members.slice(0, 3).map(member => member.avatar);
      setOpenChatInfo({
        chat: chatInfo?.name,
        avatar: groupAvatar
      })
    }
    else {
      const otherMember = chatInfo?.members?.filter(member => member._id !== user._id)
      if (Array.isArray(otherMember)) {
        setOpenChatInfo({
          chat: otherMember[0]?.username,
          avatar: [otherMember[0]?.avatar]
        })
      }
    }
  }, [chatInfo, setOpenChatInfo])

  const MobileChatComponent = ({groupChat = false}) => (
    <Stack
      direction={"row"}
      sx={{
        alignItems: "center",
        margin : "0.7rem 0",
        backgroundColor: "inherit",
        gap: "1rem",
        display: { xs: "block", sm: "none" },
        boxSizing : "border-box"
      }}
    >
      <Stack direction={"row"} gap={groupChat ? "2rem" : "unset"} alignItems={"center"}>
        <AvatarCard avatar={openChatInfo?.avatar} />
        <Typography>{openChatInfo.chat}</Typography>
      </Stack>
    </Stack >
  )

  return (
    <>
      <Box
        sx={{ flexGrow: 1, margin: "0.5rem" }}
        height={"4rem"}
        boxSizing={"border-box"}
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: { orange },
            borderRadius: "25px",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              Big Chat App
            </Typography>
            <MobileChatComponent groupChat={chatInfo?.groupChat}/>

            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton
                color="inherit"
                onClick={() => dispatch(setAreOptionsOpen(true))}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SearchButton />
              <AddGroupButton />
              <ManageGroupsButton />
              <NotificationButton />
              <LogoutButton />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <Search />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroup />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notifications />
        </Suspense>
      )}
    </>
  );
};

export default Header;
