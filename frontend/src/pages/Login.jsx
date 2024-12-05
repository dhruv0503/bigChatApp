import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { CameraAlt } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/styledComponent";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => setIsLogin(!isLogin);

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    password : "",
    bio : ""
  });

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors = { username: "", password: "" };
    if (!formData.username) {
      errors.username = "Username is required.";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters long.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    setFormErrors(errors);
    return errors;
  };

  const submitForm = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.values(errors).some((error) => error)) {
      return;
    }
    console.log(formData);
  };

  return (
    <Container
      component={"main"}
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLogin ? (
          <>
            <Typography variant="h5">Login</Typography>
            <form style={{ width: "100%" }}>
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                name="username"
                value={formData.username}
                onChange={(evt) => handleChange(evt)}
                error={!!formErrors.username}
                helperText={formErrors.username}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                name="password"
                value={formData.password}
                onChange={(evt) => handleChange(evt)}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              <Button
                sx={{ marginTop: "1rem" }}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onSubmit={(e) => submitForm(e)}
              >
                Login
              </Button>
              <Typography sx={{ textAlign: "center", margin: "1rem" }}>
                OR
              </Typography>
              <Button variant="text" fullWidth onClick={() => toggleLogin()}>
                Sign Up Instead
              </Button>
            </form>
          </>
        ) : (
          <>
            <Typography variant="h5" margin={"1rem"}>
              Sign up
            </Typography>
            <form style={{ width: "100%" }}>
              <Stack
                sx={{ position: "relative", width: "10rem", margin: "auto" }}
              >
                <Avatar
                  sx={{
                    width: "10rem",
                    height: "10rem",
                    objectFit: "contain",
                  }}
                ></Avatar>
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    ":hover": {
                      backgroundColor: "rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <CameraAlt />
                  <VisuallyHiddenInput type="file" />
                </IconButton>
              </Stack>

              <TextField
                required
                fullWidth
                label="Name"
                margin="dense"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={(evt) => handleChange(evt)}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
              <TextField
                required
                fullWidth
                label="Username"
                margin="dense"
                variant="outlined"
                name="username"
                value={formData.username}
                onChange={(evt) => handleChange(evt)}
                error={!!formErrors.username}
                helperText={formErrors.username}
              />
              <TextField
                required
                fullWidth
                label="Bio"
                margin="dense"
                variant="outlined"
                name="bio"
                value={formData.bio}
                onChange={(evt) => handleChange(evt)}
                error={!!formErrors.bio}
                helperText={formErrors.bio}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="dense"
                variant="outlined"
                name="password"
                value={formData.password}
                onChange={(evt) => handleChange(evt)}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              <Button
                sx={{ marginTop: "1rem" }}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onSubmit={(e) => submitForm(e)}
              >
                Sign Up
              </Button>
              <Typography sx={{ textAlign: "center", marginTop: "1rem" }}>
                OR
              </Typography>
              <Button
                margin={0}
                variant="text"
                fullWidth
                onSubmit={() => toggleLogin()}
              >
                Login Instead
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
