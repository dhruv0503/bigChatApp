import { styled } from "@mui/material";
import { Link, Link as LinkComponent } from "react-router-dom";
import { grayColor } from "../../constants/color";

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
  padding: "unset",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});

export const InputBox = styled("input")({
  boxSizing : "border-box",
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  paddingLeft: "2.5rem",
  margin : "0.5rem",
  borderRadius: "1rem",
  backgroundColor: `${grayColor}`
})