import { Box, Stack, AvatarGroup, Avatar } from "@mui/material";
import React from "react";
import { transformImage } from "../../lib/features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup max={max} sx={{ position: "relative" }}>
        <Box width={"5rem"} height={"3rem"}>
          {avatar.map((src, idx) => {
            return <Avatar
              key={Math.random() * 1000}
              src={transformImage(src)}
              alt={`Avatar ${idx}`}
              sx={{
                height: "3rem",
                width: "3rem",
                position: "absolute",
                left: {
                  xs: `${1 + idx}rem`,
                  sm: `${idx}rem`,
                },
                // border: "2px solid white",
              }}
            />
          })}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
