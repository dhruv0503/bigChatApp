import { useNavigate } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Backdrop,
  Badge,
} from "@mui/material";
import { orange } from "../../constants/color";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon,
} from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/reducers/authSlice";
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from "../../redux/reducers/miscSlice";
import { setIsLogin } from '../../redux/reducers/authSlice'
import api from '../../redux/api/api'
import { resetNotficationCount } from "../../redux/reducers/chatSlice";
import { useAsyncMutation } from "../hooks/hooks";
import { useLogoutMutation } from "../../redux/api/api";

const Search = lazy(() => import("../specific/Search"));
const Notifications = lazy(() => import("../specific/Notifications"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSearch, isNotification } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector(state => state.chat)
  const { isNewGroup } = useSelector(state => state.misc)
  const [userLogout] = useAsyncMutation(useLogoutMutation);

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotficationCount());
  }

  const openNewGroup = () => dispatch(setIsNewGroup(true));

  const navigateToGroup = () => {
    navigate("/groups");
  };

  const logoutHandler = async () => {
    await userLogout("Logging Out")
    dispatch(api.util.resetApiState())
    dispatch(setIsLogin(false))
    dispatch(updateUser(null))
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, margin: "0.5rem" }} height={"4rem"} boxSizing={"border-box"}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: { orange },
            borderRadius: "25px",
            boxShadow: "none",
          }}
        >
          <Toolbar >
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              Big Chat App
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={() => dispatch(setIsMobile(true))}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={() => dispatch(setIsSearch(true))}
              />
              <IconBtn
                title={"Add Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />
              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />

              <IconBtn
                title={"Notifications"}
                icon={<NotificationIcon />}
                onClick={openNotification}
                value={notificationCount}
              />

              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
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

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? <Badge badgeContent={value} color="error">
          {icon}
        </Badge> : (icon)}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
