import React from "react";
import { Grid2, Skeleton, Stack } from "@mui/material";
import { BouncingSkeleton } from "../styles/StyledComponent";

const LayoutLoader = () => {
  return (
    <Grid2
      container={true}
      spacing="1rem"
      sx={{
        height: "calc(100vh - 4rem)",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Grid2
        sm={4}
        md={3}
        sx={{ display: { xs: "none", sm: "block" }, flexGrow: "1" }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid2>
      <Grid2
        xs={12}
        sm={8}
        md={5}
        lg={6}
        height={"100%"}
        sx={{ flexGrow: "2" }}
      >
        {Array.from({ length: 10 }).map((_, idx) => {
          return (
            <Skeleton key={idx} variant="rounded" height={"5rem"} sx={{ marginBottom: "1rem" }} />
          )
        })}
      </Grid2>
      <Grid2
        md={4}
        lg={3}
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%",
          flexGrow: "1",
        }}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid2>
    </Grid2>
  );
};


const TypingLoader = () => {
  return <Stack
    spacing={"0.5rem"}
    direction={"row"}
    padding={"0.5rem"}
    justifyContent={"center"}
  >

    {[...Array(4)].map((_, i) => (
      <BouncingSkeleton
        key={i}
        variant="circular"
        width={15}
        height={15}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}


  </Stack>
}

export { TypingLoader, LayoutLoader }