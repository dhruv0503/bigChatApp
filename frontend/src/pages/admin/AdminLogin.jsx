import {
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { useAsyncMutation } from '../../components/hooks/hooks'
import { useAdminLoginMutation } from "../../redux/api/adminApi";
import { setIsAdmin } from "../../redux/reducers/authSlice";

const AdminLogin = () => {
    const [secretKey, setSecreyKey] = useState("");
    const { isAdmin } = useSelector(state => state.auth)
    const [adminLogin] = useAsyncMutation(useAdminLoginMutation)
    const dispatch = useDispatch();

    const submitForm = async (e) => {
        e.preventDefault();
        const data = await adminLogin()
        if (data) dispatch(setIsAdmin(true));

    };

    if (isAdmin) {
        return <Navigate to={"/admin/dashboard"} />
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

                    <Typography variant="h5">Admin Login</Typography>
                    <form style={{ width: "100%" }} onSubmit={(e) => submitForm(e)}>
                        <TextField
                            required
                            fullWidth
                            label="Secret Key"
                            type="password"
                            margin="normal"
                            variant="outlined"
                            name="password"
                            value={secretKey}
                            onChange={(evt) => setSecreyKey(evt.target.value)}
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
                    </form>
                </Paper>
            </Container>
        </div>
    );
}

export default AdminLogin