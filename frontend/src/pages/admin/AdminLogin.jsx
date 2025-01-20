import {
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const AdminLogin = () => {
    const [secretKey, setSecreyKey] = useState("");
    const [isAdmin, setIsAdmin] = useState(false)

    const submitForm = (e) => {
        e.preventDefault();
        console.log(secretKey)
    };

    if(isAdmin){
        Navigate("/admin/dashboard")
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
                    <form style={{ width: "100%" }} onSubmit={(e) => submitForm(e)}>                            <TextField
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