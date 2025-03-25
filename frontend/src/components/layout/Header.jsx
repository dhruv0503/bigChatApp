import { Chat as ChatIcon, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orange } from "../../constants/color";
import { setAreOptionsOpen, setIsMobile } from "../../redux/reducers/miscSlice";
import {
  AddGroupButton,
  LogoutButton,
  ManageGroupsButton,
  NotificationButton,
  SearchButton,
} from "../shared/IconButtons";


const Search = lazy(() => import("../specific/Search"));
const Notifications = lazy(() => import("../specific/Notifications"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const dispatch = useDispatch();
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );

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
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton
                color="inherit"
                onClick={() => dispatch(setIsMobile(true))}
              >
                <ChatIcon />
              </IconButton>
            </Box>
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
                // gap: "0.5rem",
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

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
