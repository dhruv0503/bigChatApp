import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography, Button } from "@mui/material";
import { useGetOnlineFriendsQuery } from "../redux/api/api";
import axios from "axios";
import { useState } from "react";

const HomeContent = () => {
  const onlineUsers = useGetOnlineFriendsQuery()
  return (
    <Box backgroundColor={"rgba(0,0,0,0.4)"} height={"100%"} borderRadius={"25px"} display={{ xs: "none", sm: "block" }}>
      <Typography variant="h5" p={"2rem"} textAlign={"center"} boxSizing={"border-box"}>
        Select a Friend to Chat
      </Typography>
      <Button onClick={() => {
        onlineUsers.refetch();
        console.log(onlineUsers?.data?.onlineFriends)
      }} variant="text">Press Me</Button>
    </Box>
  );
};

const Home = (props) => <AppLayout WrappedContent={HomeContent} {...props} />;

export default Home;
