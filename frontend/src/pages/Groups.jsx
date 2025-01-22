import { Grid2, Tooltip, IconButton, Box, Drawer, Stack, Typography, TextField, Button, Backdrop } from '@mui/material'
import { KeyboardBackspace as KeyboardBackSpaceIcon, Menu as MenuIcon, Edit as EditIcon, Done as DoneIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useState, memo, useEffect, lazy, Suspense } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StyledLink } from '../components/styles/styledComponent'
import AvatarCard from '../components/shared/AvatarCard'
import { sampleChats, sampleUsers } from '../constants/sampleData'
import { bgGradient } from '../constants/color'
import UserItem from '../components/shared/UserItem'
const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'))


const Groups = () => {
  const chatId = useSearchParams()[0].get('group')
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/")
  }
  const [isAddMember, setIsAddMember] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)

  const deleteHandler = () => {
    console.log("Delete")
    closeConfirmDeleteHandler();
  }

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  }
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupNameHandler = () => {
    setIsEdit(false)
    console.log(groupNameUpdatedValue)
  }

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true)
    console.log("Confirm Delete")
  }

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false)
  }

  const openAddMemberHanlder = () => {
    setIsAddMember(true);
    console.log("Add Member")
  }

  const removeMemberHandler = (id) => {
    console.log("Remove Member", id)
  }


  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`)
      setGroupNameUpdatedValue(`Group Name ${chatId}`)
    }

    return () => {
      setGroupName("")
      setGroupNameUpdatedValue("")
      setIsEdit(false)
    }
  }, [chatId])

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
        <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} />
        <IconButton onClick={updateGroupNameHandler}>
          <DoneIcon />
        </IconButton>
      </> : <>
        <Typography variant='h4'>
          {groupName}
        </Typography>
        <IconButton onClick={() => setIsEdit(true)}>
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

  return (
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
        <GroupList myGroups={sampleChats} chatId={chatId} />
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
          groupName && <>
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
                sampleUsers.map((user) => {
                  return <UserItem user={user} key={user._id} isAdded styling={{
                    boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                  }}
                    handler={() => removeMemberHandler(user._id)}
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
          <AddMemberDialog open={isAddMember} />
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
        <GroupList w="50vw" myGroups={sampleChats} chatId={chatId} />
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
  const { name, avatar, _id } = group;
  return <StyledLink to={`?group=${_id}`} onClick={(e) => {
    if (chatId === _id) e.preventDefault();
  }}>
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} sx={{
      padding: "0.5rem",
      gap: "1rem",
      cursor: "pointer",
    }}>
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </StyledLink>
})

export default Groups
