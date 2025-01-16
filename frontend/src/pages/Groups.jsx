import { Grid2, Tooltip, IconButton, Box, Drawer, Stack, Typography } from '@mui/material'
import { KeyboardBackspace as KeyboardBackSpaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { StyledLink } from '../components/styles/styledComponent'
import AvatarCard from '../components/shared/AvatarCard'
import { sampleChats } from '../constants/sampleData'

const Groups = () => {
  const chatId = "asdsa";
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/")
  }
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  }
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const IconBtns = <>
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
  </>
  return (
    <Grid2 container sx={{
      height: "100vh",
      display: "flex",
      flexDirection: "row",
      width: "100%",
    }} >
      <Grid2 item sm={4} sx={{
        display: {
          xs: "none",
          sm: "block"
        },
        flexGrow: 1,
        maxWidth: "33%",
        boxSizing: "border-box",
        background: "bisque"
      }}>
        <GroupList myGroups={sampleChats} chatId={chatId} />
      </Grid2>
      <Grid2 item xs={12} sm={8} sx={{
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        padding: "1rem 3rem",
        flexGrow: 2
      }}>
        {IconBtns}
      </Grid2>
      <Drawer sx={{
        display: {
          xs: "block",
          sm: "none"
        }
      }} open={isMobileMenuOpen} onClick={handleMobileClose}>
        <GroupList w="50vw" myGroups={sampleChats} chatId={chatId} />
      </Drawer>
    </Grid2>
  )
}

const GroupList = ({ w = "100%", myGroups = [], chatId }) => {
  console.log(myGroups)
  return <Stack width={w}>
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
