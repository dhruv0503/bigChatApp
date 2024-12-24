import React from "react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { orange } from "../../constants/color";

const Header = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgColor: { orange },
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              Big Chat App
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Header;
