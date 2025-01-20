import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({ open }) => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const selectMemberHandler = (e, _id) => {
    setSelectedUsers((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };

  const handleClose = () => {
    setMembers([]);
    setSelectedUsers([]);
    setIsAddMember(false);
  }

  const addMemberSubmitHandler = () => {
    console.log("Add Member Submit")
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>
          Add Member
        </DialogTitle>
        <Stack spacing={"1rem"}>
          {
            members.length > 0 ? members.map(user => {
              return <UserItem
                key={user._id}
                user={user}
                handler={(e) => selectMemberHandler(e, user._id)}
                isAdded={selectedUsers.includes(user._id)}
              />
            }) : <Typography textAlign={"center"}>No Users</Typography>
          }
        </Stack>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
          <Button color='error' variant='contained' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' onClick={addMemberSubmitHandler}>Add Members</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default AddMemberDialog