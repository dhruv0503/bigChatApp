import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { transformImage } from "../../lib/features";

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false, styling = {}, creator = "" }) => {
  const { username, _id } = user;
  let avatar;
  const avatarType = typeof (user?.avatar);
  if (avatarType === "string") avatar = user?.avatar;
  else if (avatarType === "object") avatar = user?.avatar?.url;

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        <Avatar src={transformImage(avatar)} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
              width: "200px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
          }}
        >
          {creator.toString() === _id.toString() ? <strong>{username}</strong> : username}
        </Typography>
        <IconButton
          onClick={(e) => handler(e, _id)}
          disabled={handlerIsLoading}
          size="small"
          sx={{
            backgroundColor: isAdded ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: isAdded ? "error.dark" : "primary.dark",
            },
          }}
        >
          {isAdded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
