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
// import {authInstance, formInstance} from '../lib/axiosInstances'
import axios from 'axios'
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/styledComponent";
import { userExists } from "../redux/reducers/authSlice";
import { validateFormInput } from "../utils/validation";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => setIsLogin(!isLogin);
  const dispatch = useDispatch();

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

  const hanldeFileChange = (evt) => {
    const file = evt.target.files[0];
    if (file) setProfileImage(file);
    console.log(file);
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
    setFormData({
      name: "",
      username: "",
      password: "",
      bio: "",
    })
    try {
      if (isLogin) {
        const { data } = await axios.post(`${import.meta.env.VITE_SERVER}/api/login`, {
          username: formData.username,
          password: formData.password
        }, { withCredentials: true })

        dispatch(userExists(true))
        toast.success(data.message)
      } else {
        const multiForm = new FormData();
        multiForm.append("name", formData.name)
        multiForm.append("username", formData.username)
        multiForm.append("password", formData.password)
        multiForm.append("bio", formData.bio)
        multiForm.append("avatar", profileImage)

        const { data } = await axios.post(`${import.meta.env.VITE_SERVER}/api/signup`, multiForm)

        dispatch(userExists(true))
        toast.success(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.error?.message || "Something Went Wrong")
    }
  };

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
          {isLogin ? (
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
                      onChange={(evt) => hanldeFileChange(evt)}
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
                  onClick={() => toggleLogin()}
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
};

export default Login;
