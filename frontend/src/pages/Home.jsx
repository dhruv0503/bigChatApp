import { Box, Typography } from "@mui/material";
import React from "react";
import AppLayout from "../components/layout/AppLayout";

const HomeContent = () => {
  return (
    <Box backgroundColor={"rgba(0,0,0,0.4)"} height={"100%"} borderRadius={"25px"} display={{ xs: "none", sm: "block" }}>
      <Typography variant="h5" p={"2rem"} textAlign={"center"} boxSizing={"border-box"}>
        Select a Friend to Chat
      </Typography>
    </Box>
  );
};

const Home = (props) => <AppLayout WrappedContent={HomeContent} {...props} />;

export default Home;
