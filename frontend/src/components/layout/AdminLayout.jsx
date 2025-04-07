import {
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid2,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Link, Navigate, useLocation, useNavigate} from "react-router-dom";
import { grayColor } from "../../constants/color";
import { useAdminLogoutMutation } from "../../redux/api/adminApi";
import { setIsAdmin } from "../../redux/reducers/authSlice";
import { useAsyncMutation } from "../hooks/hooks";

const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "black",
  borderRadius: "2rem",
  padding: "1rem",
});

const tabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminLogout] = useAsyncMutation(useAdminLogoutMutation);
  const dispatch = useDispatch();
  const logoutHandler = async (e) => {
    e.preventDefault();
    const data = await adminLogout("Logging Out...", {});
    if (data && data?.success) {
      dispatch(setIsAdmin(false));
    }
    navigate('/');
  };
  return (
    <Stack
      direction={"column"}
      spacing={"3rem"}
      sx={{
        height: "100%",
        width: "100%",
        padding: "3rem 2rem",
        boxSizing: "border-box",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
        flexGrow: 1,
      }}
    >
      <Typography variant="h5" textAlign={"center"} fontWeight={600}>
        Admin Panel
      </Typography>
      <Stack spacing={"1rem"}>
        {tabs.map((tab) => {
          return (
            <StyledLink
              key={tab.path}
              to={tab.path}
              sx={
                location.pathname === tab.path && {
                  bgcolor: "black",
                  color: "white",
                  ":hover": {
                    color: "white",
                  },
                }
              }
            >
              <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                {tab.icon}
                <Typography>{tab.name}</Typography>
              </Stack>
            </StyledLink>
          );
        })}
        <StyledLink onClick={(e) => logoutHandler(e)}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon />
            <Typography>Logout</Typography>
          </Stack>
        </StyledLink>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const hanldeMobile = () => {
    setIsMobile(!isMobile);
  };
  const handleClose = () => {
    setIsMobile(false);
  };

  if (!isAdmin) return <Navigate to={"/admin"} />;
  else <Navigate to={"/admin/dashboard"} />;

  return (
    <Grid2
      conatiner={"true"}
      display={"flex"}
      width={"100%"}
      height={{
        xs: "100%",
        lg: "100vh",
      }}
    >
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "absolute",
          right: {
            xs : "0.5rem",
            sm : "1.5rem"
          },
          top: "2rem",
        }}
      >
        <IconButton onClick={hanldeMobile}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Grid2
        item="true"
        xs={0}
        lg={3}
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%",
          minWidth: "25%",
          flexGrow: 1,
        }}
      >
        <Sidebar />
      </Grid2>
      <Grid2
        item="true"
        xs={12}
        lg={9}
        sx={{
          backgroundColor: grayColor,
          height: "100%",
          minWidth: {
            xs: "100%",
            md: "75%",
          },
        }}
      >
        {children}
      </Grid2>
      <Drawer anchor="right" open={isMobile} onClose={handleClose}>
        <Sidebar />
      </Drawer>
    </Grid2>
  );
};

export default AdminLayout;
