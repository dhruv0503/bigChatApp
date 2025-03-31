import { Stack } from "@mui/material";
import { bgGradient } from "../../constants/color";
import {
  AddGroupButton,
  LogoutButton,
  ManageGroupsButton,
  NotificationButton,
  SearchButton,
} from "../shared/IconButtons";

const OptionsSidebar = () => {
  return (
    <Stack
      direction={"column"}
      width={"100%"}
      overflow={"auto"}
      height={"100%"}
      sx={{ backgroundImage: bgGradient}}
    >
      <SearchButton text={true} />
      <AddGroupButton text={true} />
      <ManageGroupsButton text={true} />
      <NotificationButton text={true} />
      <LogoutButton text={true} />
    </Stack>
  );
};

export default OptionsSidebar;
