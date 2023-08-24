import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import * as yup from "yup";
import { ILoginData } from "../../services/types";
import { Formik } from "formik";
import { login } from "../../services/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../app/features/user/user-slice";
import { useNotification } from "../../hooks/use-notification";
import { IStore } from "../../app/store";
import { IUserState } from "../../app/features/user/types";
import { SOCKETIO_URL } from "../../config/config";
import { useSocket } from "../../hooks/use-socket";

// TODO remove, this demo shouldn't need to reset the theme.

interface ILoginFormValues extends ILoginData {}

const validationSchema = yup.object<ILoginFormValues>({
    username: yup.string().required("Required"),
    password: yup.string().required("required"),
});

const initialValues: ILoginFormValues = {
    username: "",
    password: "",
};

export default function LoginForm() {
    const dispatch = useDispatch();
    const user = useSelector<IStore, IUserState>((state) => state.user);
    const { connect } = useSocket();
    const notif = useNotification();

    const submitHandler = (values: ILoginFormValues) => {
        console.log(values);

        login(values).then(({ error, response }) => {
            if (error) return notif.error("Couldn't login");

            const { user, refreshToken, accessToken } = response!;
            console.log(user);
            dispatch(setUser({ ...user, refreshToken, accessToken }));
            notif.success("Logged in successfuly");
            connect();
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitHandler}
        >
            {(formik) => (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={formik.handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                error={
                                    formik.errors.username !== undefined &&
                                    formik.touched.username !== undefined
                                }
                                helperText={
                                    formik.touched.username === undefined
                                        ? ""
                                        : formik.errors.username
                                }
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                                {...formik.getFieldProps("username")}
                            />
                            <TextField
                                error={
                                    formik.errors.password !== undefined &&
                                    formik.touched.password !== undefined
                                }
                                helperText={
                                    formik.touched.password === undefined
                                        ? ""
                                        : formik.errors.password
                                }
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                {...formik.getFieldProps("password")}
                            />
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            /> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Container>
            )}
        </Formik>
    );
}
