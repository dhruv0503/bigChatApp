import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid2 } from "@mui/material";

const AppLayout = ({ WrappedContent, ...props }) => {
  return (
    <>
      <Title />
      <Header />
      <Grid2 container height={"calc(100vh - 4rem)"}>
        <Grid2
          item
          size={{ sm: 4, md: 3, sx: { display: { xs: "none", sm: "block" } } }}
          height={"100%"}
        >
          First
        </Grid2>
        <Grid2 item size={{ xs: 12, sm: 8, md: 5, lg: 6 }} height={"100%"}>
          <WrappedContent {...props} />
        </Grid2>
        <Grid2
          item
          size={{ md: 4, lg: 3, sx: { display: { xs: "none", md: "block" } } }}
          height={"100%"}
          padding="2rem"
          bgcolor={"rgba(0,0,0,0.7)"}
        >
          Third
        </Grid2>
      </Grid2>
      {/* <Footer /> */}
    </>
  );
};

export default AppLayout;
