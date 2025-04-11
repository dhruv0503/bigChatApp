import {Group as GroupIcon, Message as MessageIcon, Person as PersonIcon,} from "@mui/icons-material";
import {Container, Paper, Stack, Typography} from "@mui/material";
import {useErrors} from "../../components/hooks/hooks";
import AdminLayout from "../../components/layout/AdminLayout";
import {LayoutLoader} from "../../components/layout/Loaders";
import {DoughnutChart, LineChart} from "../../components/specific/Charts";
import {useGetAdminDashboardQuery} from "../../redux/api/adminApi";

const Dashboard = () => {
  const { data, isError, error, isLoading } = useGetAdminDashboardQuery();
  const stats = data?.stats;

  useErrors([{ isError, error }]);

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
      <Container component={"main"} sx={{ marginTop: "2rem", alignItem : "center", justifyContent : "center" }}> 
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          justifyContent={"center"}
          alignItems={{
            xs: "center",
            lg: "strech",
          }}
          sx={{
            gap: "2rem",
            flexWrap : "wrap"
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              borderRadius: "1rem",
              width: "100%",
              height: "100%",
              maxWidth: {
                xs: "80%",
                lg: "40%",
              },
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
              height: "100%",
              maxWidth: {
                xs: "80%",
                lg: "40%",
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
        padding: {
          xs: "1rem",
          xl: "2rem",
        },
        borderRadius: "1.5rem",
        width: "90%",
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
