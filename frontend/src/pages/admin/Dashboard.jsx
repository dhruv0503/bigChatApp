import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Container, Paper, Stack, Box, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Notifications as NotificationIcon, Group as GroupIcon, Person as PersonIcon, Message as MessageIcon } from '@mui/icons-material'
import moment from 'moment'
import { SearchField, CurvedButton } from '../../components/styles/styledComponent'
import { LineChart, DoughnutChart } from '../../components/specific/Charts'
const Dashboard = () => {
    const AppBar = () => {
        return (
            <Paper elevation={3} sx={{
                padding: "2rem",
                margin: "2rem 0",
                borderRadius: "1rem"
            }}>
                <Stack spacing={"1rem"} alignItems={"center"} direction={"row"}>
                    <AdminPanelSettingsIcon sx={{ fontSize: "2rem" }} />
                    <SearchField />
                    <CurvedButton>Search</CurvedButton>
                    <Box flexGrow={1} />
                    <Typography display={{
                        xs: "none",
                        xl: "block"
                    }}>
                        {moment().format('MMMM Do YYYY')}
                    </Typography>
                    <NotificationIcon />
                </Stack>
            </Paper>
        )
    }

    const Widgets = () => {
        return (
            <Stack direction={{
                xs: 'column',
                sm: 'row'
            }}
                spacing={"2rem"}
                justifyContent={"space-between"}
                alignItems={"center"}
                margin={"2rem 0"}
            >
                <Widget title={"Users"} value={55} icon={<PersonIcon />} />
                <Widget title={"Chats"} value={3} icon={<GroupIcon />} />
                <Widget title={"Messages"} value={545} icon={<MessageIcon />} />
            </Stack>
        )
    }

    return (
        <AdminLayout>
            <Container component={"main"}>
                <AppBar />
                <Stack direction={{
                    xs: "column",
                    lg: "row"
                }} flexWrap={"wrap"} justifyContent={"center"} alignItems="center"
                    sx={{
                        gap: "2rem"
                    }}>
                    <Paper elevation={3} sx={{
                        padding: "2rem",
                        borderRadius: "1rem",
                        width: "100%",
                        maxWidth: "40rem"
                    }}>
                        <Typography margin={"2rem 0"} variant='h4'>Last Messages</Typography>
                        <LineChart value={[65, 59, 80, 81, 56, 55, 40]} />
                    </Paper>
                    <Paper elevation={3} sx={{
                        padding: "2rem",
                        borderRadius: "1rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        position: "relative",
                        maxWidth: {
                            xs: "40rem",
                            xl: "30rem"
                        }
                    }}>
                        <DoughnutChart labels={["Single Chats", "Group Chats"]} value={[23, 67]} />
                        <Stack direction="row" spacing={"0.5rem"} sx={{
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                        }}>
                            <GroupIcon /> VS <PersonIcon />
                        </Stack>
                    </Paper>
                </Stack>
                <Widgets />
            </Container>
        </AdminLayout >
    )
}

const Widget = ({ title, value, icon }) => {
    return (
        <Paper elevation={3} sx={{
            padding: "2rem",
            borderRadius: "1.5rem",
            width: "20rem",
            margin: "2rem 0"
        }}>
            <Stack alignItems={"center"} spacing={"1rem"}>
                <Typography sx={{
                    color: "rgba(0,0,0,0.7)",
                    borderRadius: "50%",
                    border: "5px solid rgba(0,0,0,0.9)",
                    width: "5rem",
                    height: "5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {value}
                </Typography>
                <Stack spacing={"1rem"} direction={"row"} alignItems={"center"}>
                    {icon}
                    <Typography>
                        {title}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    )
}

export default Dashboard