import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Group as GroupIcon,
    Message as MessageIcon,
    Notifications as NotificationIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import {
    Box,
    Container,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import moment from "moment";
import { useErrors } from "../../components/hooks/hooks";
import AdminLayout from "../../components/layout/AdminLayout";
import { LayoutLoader } from "../../components/layout/Loaders";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import {
    CurvedButton,
    SearchField,
} from "../../components/styles/StyledComponent";
import { useGetAdminDashboardQuery } from "../../redux/api/adminApi";
const Dashboard = () => {
  const { data, isError, error, isLoading } = useGetAdminDashboardQuery();
  const stats = data?.stats;

  useErrors([{ isError, error }]);
  const AppBar = () => {
    return (
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          margin: "2rem 0",
          borderRadius: "1rem",
        }}
      >
        <Stack spacing={"1rem"} alignItems={"center"} direction={"row"}>
          <AdminPanelSettingsIcon sx={{ fontSize: "2rem" }} />
          <SearchField />
          <CurvedButton>Search</CurvedButton>
          <Box flexGrow={1} />
          <Typography
            display={{
              xs: "none",
              xl: "block",
            }}
          >
            {moment().format("MMMM Do YYYY")}
          </Typography>
          <NotificationIcon />
        </Stack>
      </Paper>
    );
  };

  const Widgets = () => {
    return (
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={"2rem"}
        justifyContent={"space-between"}
        alignItems={"center"}
        margin={"2rem 0"}
      >
        <Widget
          title={"Users"}
          value={stats?.totalUsers}
          icon={<PersonIcon />}
        />
        <Widget
          title={"Chats"}
          value={stats?.totalChats}
          icon={<GroupIcon />}
        />
        <Widget
          title={"Messages"}
          value={stats?.totalMessages}
          icon={<MessageIcon />}
        />
      </Stack>
    );
  };

  return isLoading ? (
    <LayoutLoader />
  ) : (
    <AdminLayout>
      <Container component={"main"}>
        <AppBar />
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems="center"
          sx={{
            gap: "2rem",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "40rem",
            }}
          >
            <Typography margin={"2rem 0"} variant="h4">
              Last Messages
            </Typography>
            <LineChart value={stats?.last7DaysStats} />
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              position: "relative",
              maxWidth: {
                xs: "40rem",
                xl: "30rem",
              },
            }}
          >
            <DoughnutChart
              labels={["Single Chats", "Group Chats"]}
              value={[stats?.singleChats, stats?.groupChats]}
            />
            <Stack
              direction="row"
              spacing={"0.5rem"}
              sx={{
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <GroupIcon /> VS <PersonIcon />
            </Stack>
          </Paper>
        </Stack>
        <Widgets />
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, icon }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        borderRadius: "1.5rem",
        width: "20rem",
        margin: "2rem 0",
      }}
    >
      <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
          sx={{
            color: "rgba(0,0,0,0.7)",
            borderRadius: "50%",
            border: "5px solid rgba(0,0,0,0.9)",
            width: "5rem",
            height: "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {value}
        </Typography>
        <Stack spacing={"1rem"} direction={"row"} alignItems={"center"}>
          {icon}
          <Typography>{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Dashboard;
