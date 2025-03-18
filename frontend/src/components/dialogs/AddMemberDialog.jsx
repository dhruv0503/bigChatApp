import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAddMemberMutation, useGetFriendsQuery } from '../../redux/api/api'
import { setIsAddMember } from '../../redux/reducers/miscSlice'
import { useAsyncMutation, useErrors } from '../hooks/hooks'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({ chatId, groupMembers }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { isAddMember } = useSelector(state => state.misc)
  const dispatch = useDispatch();
  const [addMember, isLoadingAddMember] = useAsyncMutation(useAddMemberMutation)
  const { isLoading, data, error, isError } = useGetFriendsQuery(chatId)

  const groupMemberIds = new Set([...groupMembers])
  const finalArray = data?.friends.filter(item => !groupMemberIds.has(item._id))
  useErrors([{ isError, error }])

  const selectMemberHandler = (_id) => {
    setSelectedUsers((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };

  const handleClose = () => dispatch(setIsAddMember(false));

  const addMemberSubmitHandler = () => {
    addMember("Adding Members", { chatId, members: selectedUsers })
    handleClose()
  }

  return (
    <Dialog open={isAddMember} onClose={handleClose}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>
          Add Member
        </DialogTitle>
        <Stack spacing={"1rem"}>
          {
            isLoading ? <Skeleton /> : finalArray.length > 0 ? finalArray.map(user => {
              return <UserItem
                key={user._id}
                user={user}
                handler={(e) => selectMemberHandler(user._id)}
                isAdded={selectedUsers.includes(user._id)}
              />
            }) : <Typography textAlign={"center"}>No Users</Typography>
          }
        </Stack>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
          <Button color='error' variant='contained' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' onClick={addMemberSubmitHandler} disabled={isLoadingAddMember}>Add Members</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default AddMemberDialog