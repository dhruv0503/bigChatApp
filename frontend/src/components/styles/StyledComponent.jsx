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
  padding: "0.5rem",
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
  margin : "unset",
  borderRadius: "1rem",
  backgroundColor: `${grayColor}`
})

export const SearchField = styled("input")({
  padding : "1rem 2rem",
  width : "20vmax",
  border : "none",
  outline : "none",
  borderRadius : "1.5rem",
  backgroundColor : grayColor,
  fontSize : "1rem",
  color : "white",
  "&:focus" : {
    outline : "none"
  }
})

export const CurvedButton = styled("button")({
  borderRadius : "1.5rem",
  padding : "1rem 2rem",
  border : "none",
  outline : "none",
  cursor : "pointer",
  backgroundColor : "black",
  color : "white",
  fontSize : "1rem",
  "&:focus" : {
    outline : "none",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  }
})