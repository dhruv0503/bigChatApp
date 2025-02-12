import { Stack, Avatar, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as EmailIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";
import moment from "moment"
import { useSelector } from "react-redux";
import { transformImage } from "../../lib/features";

const Profile = () => {
  const { user } = useSelector(state => state.auth)
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
          border: "5px solid white",
        }}
        src={transformImage(user?.avatar?.url)}
      />
      <ProfileCard
        heading={"Bio"}
        text={user?.bio} />
      <ProfileCard
        heading={"Username"}
        text={user?.username}
        icon={<EmailIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={user?.name}
        icon={<FaceIcon />}
      />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
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
    maxWidth={"60%"}
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
