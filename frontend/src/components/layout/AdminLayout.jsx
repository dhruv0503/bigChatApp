import { Grid2, Box, IconButton, Drawer, Stack, Typography, styled } from '@mui/material'
import React, { useState } from 'react'
import { grayColor } from '../../constants/color'
import { ExitToApp as ExitToAppIcon, Groups as GroupsIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcon } from '@mui/icons-material'
import { useLocation, Link, Navigate } from 'react-router-dom'
import { Dashboard as DashboardIcon } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { useAsyncMutation } from '../hooks/hooks'
import { useAdminLogoutMutation } from '../../redux/api/adminApi'
import { setIsAdmin } from '../../redux/reducers/authSlice'

const StyledLink = styled(Link)({
    textDecoration: "none",
    color: "black",
    borderRadius: "2rem",
    padding: "1rem"
});

const tabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: <ManageAccountsIcon />
    },
    {
        name: "Chats",
        path: "/admin/chats",
        icon: <GroupsIcon />
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon />
    },
]

const Sidebar = ({ w = "100%" }) => {
    const location = useLocation();
    const [adminLogout] = useAsyncMutation(useAdminLogoutMutation);
    const logoutHandler = async (e) => {
        e.preventDefault();
        const data = await adminLogout("Logging Out...");
        if (data && data?.success) setIsAdmin(false)
    }
    return (
        <Stack
            direction={"column"}
            spacing={"3rem"}
            sx={{
                height: "100%",
                width: w,
                padding: "3rem",
                boxSizing: "border-box",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
            }}>
            <Typography variant='h5' textTransform={'uppercase'}>
                Admin
            </Typography>
            <Stack spacing={"1rem"}>
                {
                    tabs.map((tab) => {
                        return (
                            <StyledLink
                                key={tab.path}
                                to={tab.path}
                                sx={location.pathname === tab.path && {
                                    bgcolor: 'black',
                                    color: "white",
                                    ":hover": {
                                        color: 'white'
                                    }
                                }}
                            >
                                <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                                    {tab.icon}
                                    <Typography>
                                        {tab.name}
                                    </Typography>
                                </Stack>
                            </StyledLink>
                        )
                    })
                }
                <StyledLink onClick={(e) => logoutHandler(e)}>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        <ExitToAppIcon />
                        <Typography>
                            Logout
                        </Typography>
                    </Stack>
                </StyledLink>
            </Stack>
        </Stack>
    )
}


const AdminLayout = ({ children }) => {
    const { isAdmin } = useSelector(state => state.auth);
    const [isMobile, setIsMobile] = useState(false);
    const hanldeMobile = () => {
        setIsMobile(!isMobile);
    }
    const handleClose = () => {
        setIsMobile(false);
    }

    if (!isAdmin) return <Navigate to={"/admin"} />
    else <Navigate to={"/admin/dashboard"} />

    return (
        <Grid2 conatiner={"true"} minHeight={"100vh"} display={"flex"} width={"100%"} height={"100%"}>
            <Box sx={{
                display: { xs: "block", lg: "none" },
                position: "fixed",
                right: "3rem",
                top: "2.5rem"
            }}>
                <IconButton onClick={hanldeMobile}>
                    <MenuIcon />
                </IconButton>
            </Box>
            <Grid2 item="true" md={4} lg={3} sx={{ display: { xs: "none", lg: "block" }, minHeight: "100%", minWidth: "25%", }}>
                <Sidebar />
            </Grid2>
            <Grid2 item="true" xs={12} md={8} lg={9} sx={{
                backgroundColor: grayColor, minHeight: "100%", minWidth: {
                    xs: "100%",
                    lg: "75%"
                }
            }}>
                {children}
            </Grid2>
            <Drawer open={isMobile} onClose={handleClose}>
                <Sidebar w="50vw" />
            </Drawer>
        </Grid2>
    )
}

export default AdminLayout