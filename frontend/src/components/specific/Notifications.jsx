import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography
} from "@mui/material";
import { memo } from "react";
import { sampleNotifications } from "../../constants/sampleData";

const Notifications = () => {
  const friendRequestHandler = (_id, accept) => {
    console.log("Add friend", _id);
  };

  return (
    <Dialog open>
      <Stack p={{ xs: "0.5rem", sm: "1rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notificatons</DialogTitle>
        {sampleNotifications.length > 0 ? (
          sampleNotifications.map(({ sender, _id }) => (
            <NotificationItem
              sender={sender}
              _id={_id}
              handler={friendRequestHandler}
              key={_id}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>No new notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  return (
    <div>
      <ListItem>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"1rem"}
          width={"100%"}
        >
          <Avatar src={sender.avatar} />
          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {`${sender.name} sent you a friend request`}
          </Typography>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
          >
            <Button onClick={() => handler(_id, true)}> Accept </Button>
            <Button color="error" onClick={() => handler(_id, false)}>
              Reject{" "}
            </Button>
          </Stack>
        </Stack>
      </ListItem>
    </div>
  );
});

NotificationItem.displayName = "NotificationItem";

export default Notifications;
