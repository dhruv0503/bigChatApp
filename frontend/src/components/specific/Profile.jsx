import { Stack, Avatar, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as EmailIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";
import moment from "moment"

const Profile = () => {
  return (
    <Stack
      spacing={"2rem"}
      direction={"column"}
      alignItems={"center"}
      marginTop={"1rem"}
      boxSizing={"border-box"}
    >
      <Avatar
        sx={{
          width: "10rem",
          height: "10rem",
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard
        heading={"Bio"}
        text={"This is a great bio"} />
      <ProfileCard
        heading={"Username"}
        text={"_dhruv2505_"}
        icon={<EmailIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={"Dhruv Agrawal"}
        icon={<FaceIcon />}
      />
      <ProfileCard
        heading={"Joined"}
        text={moment('2025-01-09T13:12:15.636Z').fromNow()}
        icon={<CalenderIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
    marginTop={"1rem"}
  >
    {icon && icon}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);
export default Profile;
