import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateNewGroupMutation, useGetFriendsQuery } from '../../redux/api/api';
import { setIsNewGroup } from '../../redux/reducers/miscSlice';
import { useAsyncMutation, useErrors } from '../hooks/hooks';
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const dispatch = useDispatch();
  const { isNewGroup } = useSelector(state => state.misc)
  const { isError, isLoading, error, data } = useGetFriendsQuery();
  const [groupName, setGroupName] = useState("");
  const [newGroup, newGroupisLoading] = useAsyncMutation(useCreateNewGroupMutation)
  const [selectedUsers, setSelectedUsers] = useState([]);
  useErrors([{ isError, error }])

  const selectMemberHandler = (e, _id) => {
    setSelectedUsers((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };

  const submitHandler = () => {
    if (!groupName.trim()) return toast.error("Group name is required")
    if (selectedUsers.length < 2) return toast.error("Please select atleast 2 members")
    newGroup("Creating New Group", { name: groupName, members: selectedUsers })
    closeHandler()
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false))
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} spacing={"1rem"} width={"25rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <Typography variant="body1">Members</Typography>
        <Stack sx={{ padding: "1rem", paddingTop: "unset" }}>
          {isLoading ? <Skeleton /> : data?.friends.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={selectMemberHandler}
              isAdded={selectedUsers.includes(user._id)}
            />
          ))}
        </Stack>
        <Stack direction={"row"} justifyContent="space-evenly">
          <Button variant="contained" color="error" size="large" onClick={closeHandler}>
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={submitHandler} disabled={newGroupisLoading}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
