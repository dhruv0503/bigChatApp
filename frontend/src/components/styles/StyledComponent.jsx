import { keyframes, Skeleton, styled } from "@mui/material";
import { Link, Link as LinkComponent } from "react-router-dom";
import { grayColor } from "../../constants/color";

const VisuallyHiddenInput = styled("input")({
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

const StyledLink = styled(LinkComponent)({
  textDecoration: "none",
  color: "black",
  // padding: "0.5rem",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});

const InputBox = styled("input")({
  boxSizing: "border-box",
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  paddingLeft: "2.5rem",
  margin: "unset",
  borderRadius: "1rem",
  backgroundColor: `${grayColor}`
})

const SearchField = styled("input")({
  padding: "1rem 2rem",
  width: "20vmax",
  border: "none",
  outline: "none",
  borderRadius: "1.5rem",
  backgroundColor: grayColor,
  fontSize: "1rem",
  color: "white",
  "&:focus": {
    outline: "none"
  }
})

const CurvedButton = styled("button")({
  borderRadius: "1.5rem",
  padding: "1rem 2rem",
  border: "none",
  outline: "none",
  cursor: "pointer",
  backgroundColor: "black",
  color: "white",
  fontSize: "1rem",
  "&:focus": {
    outline: "none",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  }
})

const bounceAnimation = keyframes`
  0% {transform : scale(1);}
  50% {transform : scale(1.3);}
  100% {transform : scale(1);}
`

const BouncingSkeleton = styled(Skeleton)({
  animation: `${bounceAnimation} 1s infinite`
})

export {
  VisuallyHiddenInput,
  StyledLink,
  InputBox,
  SearchField,
  CurvedButton,
  BouncingSkeleton
}