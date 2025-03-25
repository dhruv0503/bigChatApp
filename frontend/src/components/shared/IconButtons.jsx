import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Badge, IconButton, Tooltip, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/miscSlice";

import { useNavigate } from "react-router-dom";
import api, { useLogoutMutation } from "../../redux/api/api";
import { setIsLogin, updateUser } from "../../redux/reducers/authSlice";
import { resetNotficationCount } from "../../redux/reducers/chatSlice";
import {
  setIsNewGroup,
  setIsNotification,
} from "../../redux/reducers/miscSlice";
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
  const navigateToGroup = () => {
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
    dispatch(resetNotficationCount());
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

export const LogoutButton = ({ text = false }) => {
  const [userLogout] = useAsyncMutation(useLogoutMutation);

  const dispatch = useDispatch();
  const logoutHandler = async () => {
    await userLogout("Logging Out");
    dispatch(api.util.resetApiState());
    dispatch(setIsLogin(false));
    dispatch(updateUser(null));
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
  return (
    <Tooltip title={title}>
      <Stack
        direction={"row"}
        spacing={"0.5rem"}
        alignItems={"center"}
        onClick={onClick}
        margin={text ? "0.5rem 1rem" : "unset"}
      >
        <IconButton color="inherit" size="large">
          {value ? (
            <Badge badgeContent={value} color="error">
              {icon}
            </Badge>
          ) : (
            icon
          )}
        </IconButton>
        {text && <Typography>{title}</Typography>}
      </Stack>
    </Tooltip>
  );
};
