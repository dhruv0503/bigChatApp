import { styled } from "@mui/material";
import { Link, Link as LinkComponent } from "react-router-dom";

export const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const StyledLink = styled(LinkComponent)({
  textDecoration: "none",
  color: "black",
  // padding : "1rem",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});
