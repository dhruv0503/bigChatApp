import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";

const HomeContent = () => {
  return (
    <Box bgcolor={"rgba(0,0,0,0.4)"} height={"100%"}>
      <Typography variant="h5" p={"2rem"} textAlign={"center"}>
        Select a Friend to Chat
      </Typography>
    </Box>
  );
};

const Home = (props) => <AppLayout WrappedContent={HomeContent} {...props} />;

export default Home;
