import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Badge, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {setAreOptionsOpen, setIsMobileGroup, setIsSearch} from "../../redux/reducers/miscSlice";

import { useNavigate } from "react-router-dom";
import api, { useLogoutMutation } from "../../redux/api/api";
import { setIsLogin, updateUser } from "../../redux/reducers/authSlice";
import { resetNotificationCount } from "../../redux/reducers/chatSlice";
import {
  setIsNewGroup,
  setIsNotification,
} from "../../redux/reducers/miscSlice";
import { getSocket } from "../../Socket";
import { useAsyncMutation } from "../hooks/hooks";

export const SearchButton = ({ text = false }) => {
  const dispatch = useDispatch();
  return (
    <IconBtn
      text={text}
      title={"Search"}
      icon={<SearchIcon />}
      onClick={() => dispatch(setIsSearch(true))}
    />
  );
};

export const AddGroupButton = ({ text = false }) => {
  const dispatch = useDispatch();
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  return (
    <IconBtn
      text={text}
      title={"Add Group"}
      icon={<AddIcon />}
      onClick={openNewGroup}
    />
  );
};
export const ManageGroupsButton = ({ text = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateToGroup = () => {
    dispatch(setIsMobileGroup(true))
    navigate("/groups");
  };

  return (
    <IconBtn
      text={text}
      title={"Manage Groups"}
      icon={<GroupIcon />}
      onClick={navigateToGroup}
    />
  );
};
export const NotificationButton = ({ text = false }) => {
  const { notificationCount } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  return (
    <IconBtn
      text={text}
      title={"Notifications"}
      icon={<NotificationIcon />}
      onClick={openNotification}
      value={notificationCount}
    />
  );
};

export const LogoutButton = ({ text = false}) => {
  const [userLogout] = useAsyncMutation(useLogoutMutation);
  const socket = getSocket();
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    await userLogout("Logging Out");
    dispatch(api.util.resetApiState());
    dispatch(setIsLogin(false));
    dispatch(updateUser(null));
    socket.disconnect();
  };
  return (
    <IconBtn
      text={text}
      title={"Logout"}
      icon={<LogoutIcon />}
      onClick={logoutHandler}
    />
  );
};

const IconBtn = ({ title, icon, onClick, value, text }) => {
  const dispatch = useDispatch();
  const combiedHandler = () =>{
    onClick();
    if(text) dispatch(setAreOptionsOpen(false));
  }
  return (
    <Stack
      direction="row"
      spacing="0.5rem"
      alignItems="center"
      onClick={combiedHandler}
      margin={text ? "0.5rem 1rem" : "unset"}
      padding={text ? "0 1rem 0 0" : "unset"}
      sx={{
        ...(text && {
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "0.5rem",
          },
        }),
      }}
    >
      <Tooltip title={text ? "" : title}>
        <IconButton color="inherit" size="large">
          {value ? (
            <Badge badgeContent={value} color="error">
              {icon}
            </Badge>
          ) : (
            icon
          )}
        </IconButton>
      </Tooltip>
      {text && <Typography>{title}</Typography>}
    </Stack>
  );
};
