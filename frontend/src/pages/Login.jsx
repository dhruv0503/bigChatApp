import { CameraAlt } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAsyncMutation } from "../components/hooks/hooks";
import { VisuallyHiddenInput } from "../components/styles/StyledComponent";
import { useLoginMutation } from "../redux/api/api";
import { useRegisterMutation } from "../redux/api/api";
import { setIsLogin } from "../redux/reducers/authSlice";
import { validateFormInput } from "../utils/validation";

const Login = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const toggleRegistered = () => setIsRegistered(prev => !prev)
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [userLogin] = useAsyncMutation(useLoginMutation)
  const [userRegister] = useAsyncMutation(useRegisterMutation)

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    name: "",
    bio: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleFileChange = (evt) => {
    const file = evt.target.files[0];
    if (file) setProfileImage(file);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormErrors({
      ...formErrors,
      [e.target.name]: validateFormInput(e.target.name, e.target.value),
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (Object.values(formErrors).some((error) => error)) {
      return;
    }
    setIsLoading(true)
    if (isRegistered) {
      await userLogin("Logging In", {
        username: formData.username,
        password: formData.password
      })
      dispatch(setIsLogin(true))
    } else {
      const multiForm = new FormData();
      multiForm.append("name", formData.name)
      multiForm.append("username", formData.username)
      multiForm.append("password", formData.password)
      multiForm.append("bio", formData.bio)
      multiForm.append("avatar", profileImage)

      await userRegister("Registering User", multiForm)
      dispatch(setIsLogin(true))
    }
    setIsLoading(false)
    setFormData({
      name: "",
      username: "",
      password: "",
      bio: "",
    })
    setProfileImage(null)
  }

  return (
    <div style={{
      backgroundImage: "linear-gradient(to right, #fbc2eb, #a6c1ee)"
    }}>
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
          {isRegistered ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form style={{ width: "100%" }} onSubmit={(e) => submitForm(e)}>
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

                {formErrors.username && (
                  <Typography variant="caption" color="error"></Typography>
                )}

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
                  disabled={isLoading}
                >
                  Login
                </Button>
                <Typography sx={{ textAlign: "center", margin: "1rem" }}>
                  OR
                </Typography>
                <Button variant="text" fullWidth onClick={() => toggleRegistered()} disabled={isLoading}>
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5" margin={"1rem"}>
                Sign up
              </Typography>
              <form style={{ width: "100%" }} onSubmit={(e) => submitForm(e)}>
                <Stack
                  sx={{ position: "relative", width: "10rem", margin: "auto" }}
                >
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                      mb: 2,
                    }}
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : undefined
                    }
                  ></Avatar>
                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 15,
                      right: 0,
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        backgroundColor: "rgba(0,0,0,0.7)",
                      },
                    }}
                  >
                    <CameraAlt />
                    <VisuallyHiddenInput
                      type="file"
                      accepts="image/*"
                      onChange={(evt) => handleFileChange(evt)}
                    />
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
                  disabled={isLoading}
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
                  onClick={() => toggleRegistered()}
                  disabled={isLoading}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
}
export default Login;
