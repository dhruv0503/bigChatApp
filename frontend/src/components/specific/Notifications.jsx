import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAcceptFriendeRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/miscSlice";
import { useAsyncMutation, useErrors } from '../hooks/hooks';



const Notifications = () => {
  const { isNotification } = useSelector(state => state.misc)
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  console.log(data);

  const [acceptRequest] = useAsyncMutation(useAcceptFriendeRequestMutation)

  const friendRequestHandler = async (_id, accept) => {
    dispatch(setIsNotification(false))
    await acceptRequest("Accepting Friend Request", { requestId: _id, accept })
  };

  useErrors([{ error, isError }])

  return (
    <Dialog open={isNotification} onClose={() => dispatch(setIsNotification(false))}>
      <Stack p={{ xs: "0.5rem", sm: "1rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notificatons</DialogTitle>
        {
          isLoading ? <Skeleton /> : (
            <>
              {data?.notifications.length > 0 ? (
                data?.notifications?.map(({ sender, _id }) => (
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
            </>
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
            {sender.username}
          </Typography>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
          >
            <Button onClick={() => handler(_id, true)}> Accept </Button>
            <Button color="error" onClick={() => handler(_id, false)}>Reject</Button>
          </Stack>
        </Stack>
      </ListItem>
    </div>
  );
});

NotificationItem.displayName = "NotificationItem";

export default Notifications;
