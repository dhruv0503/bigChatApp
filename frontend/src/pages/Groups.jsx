import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackSpaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid2, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { lazy, memo, Suspense, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAsyncMutation, useErrors } from '../components/hooks/hooks'
import { LayoutLoader } from '../components/layout/Loaders'
import AvatarCard from '../components/shared/AvatarCard'
import UserItem from '../components/shared/UserItem'
import { StyledLink } from '../components/styles/styledComponent'
import { bgGradient } from '../constants/color'
import { sampleChats } from '../constants/sampleData'
import { useDeleteChatMutation, useGetChatDetailsQuery, useGetGroupsQuery, useRemoveMemberMutation, useRenameGroupMutation } from '../redux/api/api'
import { setIsAddMember } from '../redux/reducers/miscSlice'
import { motion } from 'framer-motion'
const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'))



const Groups = () => {
  const chatId = useSearchParams()[0].get('group')
  const dispatch = useDispatch();
  const { isAddMember } = useSelector(state => state.misc)

  const myGroups = useGetGroupsQuery()
  const groupDetails = useGetChatDetailsQuery({ chatId, populate: true }, {
    skip: !chatId
  })
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation)
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveMemberMutation)

  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/")
  }
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
  const [members, setMembers] = useState([])
  const inputRef = useRef(null)


  const errors = [{ isError: myGroups.isError, error: myGroups.error }, { isError: groupDetails.isError, error: groupDetails.error }]
  useErrors(errors)

  useEffect(() => {
    myGroups.refetch()
  }, [])

  useEffect(() => {
    const groupData = groupDetails?.data?.chat
    if (groupData) {
      setGroupName(groupData.name)
      setGroupNameUpdatedValue(groupData.name)
      setMembers(groupData.members);
    }

    return () => {
      setGroupName("")
      setGroupNameUpdatedValue("")
      setMembers([])
      setIsEdit(false)
    }

  }, [groupDetails.data])

  const deleteHandler = async () => {
    deleteGroup("Deleting Group", chatId)
    navigate("/groups")
    closeConfirmDeleteHandler();
  }

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  }
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupNameHandler = () => {
    setIsEdit(false)
    updateGroup("Updating Group Name", { chatId, name: groupNameUpdatedValue })
  }

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true)
    // console.log("Confirm Delete")
  }

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false)
  }

  const openAddMemberHanlder = () => {
    dispatch(setIsAddMember(true));
  }

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member", { chatId, userId })
  }

  const ButtonGroup = () => {
    return <Stack direction={{
      xs: "column-reverse",
      sm: "row",
    }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem"
      }}>
      <Button size='large' variant='contained' color='error' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>Delete Group</Button>
      <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHanlder}>Add Member</Button>
    </Stack>
  }

  const GroupName = () => {
    return (<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem "}>
      {isEdit ? <>
        <TextField
          value={groupNameUpdatedValue}
          onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          autoFocus
          inputRef={inputRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateGroupNameHandler();
            }
          }} />
        <IconButton onClick={updateGroupNameHandler} disabled={isLoadingGroupName}>
          <DoneIcon />
        </IconButton>
      </> : <>
        <Typography variant='h4'>
          {groupName}
        </Typography>
        <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}>
          <EditIcon />
        </IconButton>
      </>}
    </Stack>)
  }
  const IconBtns = () => {
    return (<>
      <Box sx={{
        display: {
          xs: "block",
          sm: "none",
        },
        position: "fixed",
        right: "1rem",
        top: "1rem"
      }}>
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title="back">
        <IconButton sx={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          background: "rgba(0,0,0,0.8)",
          color: "white",
          "&:hover": {
            background: "rgba(0,0,0,0.7)"
          }
        }}
          onClick={navigateBack}>
          <KeyboardBackSpaceIcon />
        </IconButton>
      </Tooltip>
    </>)
  }

  return myGroups.isLoading ? <LayoutLoader /> : (
    <Grid2 container sx={{
      height: "100vh",
      display: "flex",
      flexDirection: "row",
      width: "100%",
    }} >
      <Grid2 sm={4} sx={{
        display: {
          xs: "none",
          sm: "block"
        },
        flexGrow: 1,
        maxWidth: "30%",
        boxSizing: "border-box",
        backgroundImage: bgGradient
      }}>
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid2>
      <Grid2 xs={12} sm={8} sx={{
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        padding: "1rem 3rem",
        flexGrow: 2,
        maxWidth: {
          xs: "100%",
          sm: "70%"
        }
      }}>
        {<IconBtns />}

        {
          groupDetails?.data?.chat?._id === chatId && groupName && <>
            <GroupName />
            <Typography margin={"2rem"} alignSelf={"center"} variant='body1'>
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem"
              }}
              spacing={"2rem"}
              sx={{
                // background: "bisque",
                height: "50vh",
                overflow: "auto"
              }}>
              {
                isLoadingRemoveMember ? <CircularProgress /> : members?.map((user) => {
                  return <UserItem user={user} key={user._id} isAdded styling={{
                    boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                  }}
                    handler={() => {
                      removeMemberHandler(user._id)
                    }}
                    disabled={isLoadingRemoveMember}
                    creator={groupDetails?.data?.chat?.creator}
                  />
                })
              }
            </Stack>
            <ButtonGroup />
          </>
        }
      </Grid2>
      {
        isAddMember && <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} groupMembers={groupDetails.data.chat.members.map(member => member._id)} />
        </Suspense>
      }

      {
        confirmDeleteDialog && <Suspense fallback={<Backdrop open />}><ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler} /></Suspense>
      }

      <Drawer sx={{
        display: {
          xs: "block",
          sm: "none",
        },
      }} open={isMobileMenuOpen} onClick={handleMobileClose}>
        <GroupList w="50vw" myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>
    </Grid2 >
  )
}

const GroupList = ({ w = "100%", myGroups = [], chatId }) => {
  return <Stack width={w} sx={{ backgroundImage: bgGradient }} height={"100vh"}>
    {
      myGroups.length > 0 ? (
        myGroups.map((group) => {
          return <GroupListItem group={group} chatId={chatId} key={group._id} />
        })
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}> No Groups </Typography>
      )
    }
  </Stack>
}

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id, creator } = group;
  return <StyledLink to={`?group=${_id}`} onClick={(e) => {
    if (chatId === _id) e.preventDefault();
  }}>
    <motion.div
      initial={{ opacity: 0, y: "-100%" }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} sx={{
        padding: "0.5rem",
        gap: "1rem",
        cursor: "pointer",
      }}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </motion.div>
  </StyledLink>
})

export default Groups
