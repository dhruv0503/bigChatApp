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

const Search = lazy(() => import("../specific/Search"));
const Notifications = lazy(() => import("../specific/Notifications"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleMobile = () => {
    setIsMobile(!isMobile);
  };

  const openSearch = () => {
    setIsSearch(!isSearch);
  };

  const openNewGroup = () => {
    setIsNewGroup(!isNewGroup);
  };

  const openNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const navigateToGroup = () => {
    navigate("/groups");
  };

  const logoutHandler = () => {
    console.log("Logout");
    // navigate("/");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: { orange },
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
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
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
                <Suspense fallback={<Backdrop open/>}>
                  <Search />
                </Suspense>
              )}

              {isNewGroup && (
                <Suspense fallback={<Backdrop open/>}>
                  <NewGroup />
                </Suspense>
              )}

              {isNotificationOpen && (
                <Suspense fallback={<Backdrop open/>}>
                  <Notifications />
                </Suspense>
              )}

    </>
  );
};

const IconBtn = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
