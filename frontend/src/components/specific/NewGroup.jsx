import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState(sampleUsers);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const selectMemberHandler = (e, _id) => {
    setSelectedUsers((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };

  const submitHandler = () => {
    console.log("Submit");
  };

  const closeHandler = () => {
    console.log("Close");
  };

  return (
    <Dialog open onClose={closeHandler}>
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
          {members.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={selectMemberHandler}
              isAdded={selectedUsers.includes(user._id)}
            />
          ))}
        </Stack>
        <Stack direction={"row"} justifyContent="space-evenly">
          <Button variant="contained" color="error" size="large">
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={submitHandler}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
