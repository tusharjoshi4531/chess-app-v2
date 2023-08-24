import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Formik, FormikErrors } from "formik";
import * as yup from "yup";
import { signup } from "../../services/auth.service";
import { ISignupData } from "../../services/types";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { setUser } from "../../app/features/user/user-slice";
import { useNotification } from "../../hooks/use-notification";
import { socket } from "../../socket";

interface ISignupFormValues extends ISignupData {
    confirmPassword: string;
}

const validationSchema = yup.object<ISignupFormValues>({
    firstname: yup
        .string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
    lastname: yup
        .string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    username: yup
        .string()
        .min(6, "Must be at least 6 characters")
        .required("Required"),
    password: yup
        .string()
        .min(7, "Must contain atleast 7 characters")
        .required("required"),
    confirmPassword: yup.string().required("Required"),
});

const initialValues: ISignupFormValues = {
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
};

const validate = (values: ISignupFormValues) => {
    const errors: FormikErrors<ISignupFormValues> = {};

    if (values.password !== values.confirmPassword)
        errors.confirmPassword = "Confirm password should match password";

    return errors;
};

export default function SignUpForm() {
    const dispatch = useDispatch();
    const notif = useNotification();

    const submitHandler = (values: ISignupFormValues) => {
        const signupData: ISignupData = _.omit(values, "confirmPassword");

        signup(signupData).then(({ error, response }) => {
            if (error) return notif.error("Couldn't sign up");

            const { user, refreshToken, accessToken } = response!;
            dispatch(setUser({ ...user, refreshToken, accessToken }));
            notif.success("Signed up in successfuly");
            socket.connect();
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validate={validate}
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
                            Sign up
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 3 }}
                            onSubmit={formik.handleSubmit}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        error={
                                            formik.errors.firstname !==
                                                undefined &&
                                            formik.touched.firstname !==
                                                undefined
                                        }
                                        helperText={
                                            formik.touched.firstname ===
                                            undefined
                                                ? ""
                                                : formik.errors.firstname
                                        }
                                        autoComplete="given-name"
                                        required
                                        fullWidth
                                        id="firstname"
                                        label="First Name"
                                        autoFocus
                                        {...formik.getFieldProps("firstname")}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        error={
                                            formik.errors.lastname !==
                                                undefined &&
                                            formik.touched.lastname !==
                                                undefined
                                        }
                                        helperText={
                                            formik.touched.lastname ===
                                            undefined
                                                ? ""
                                                : formik.errors.lastname
                                        }
                                        required
                                        fullWidth
                                        id="lastname"
                                        label="Last Name"
                                        autoComplete="family-name"
                                        {...formik.getFieldProps("lastname")}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={
                                            formik.errors.username !==
                                                undefined &&
                                            formik.touched.username !==
                                                undefined
                                        }
                                        helperText={
                                            formik.touched.username ===
                                            undefined
                                                ? ""
                                                : formik.errors.username
                                        }
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        {...formik.getFieldProps("username")}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={
                                            formik.errors.password !==
                                                undefined &&
                                            formik.touched.password !==
                                                undefined
                                        }
                                        helperText={
                                            formik.touched.password ===
                                            undefined
                                                ? ""
                                                : formik.errors.password
                                        }
                                        required
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        {...formik.getFieldProps("password")}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={
                                            formik.errors.confirmPassword !==
                                                undefined &&
                                            formik.touched.confirmPassword !==
                                                undefined
                                        }
                                        helperText={
                                            formik.touched.confirmPassword ===
                                            undefined
                                                ? ""
                                                : formik.errors.confirmPassword
                                        }
                                        required
                                        fullWidth
                                        label="Confirm Password"
                                        type="password"
                                        id="conf-password"
                                        autoComplete="new-password"
                                        {...formik.getFieldProps(
                                            "confirmPassword"
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    </Box>
                </Container>
            )}
        </Formik>
    );
}
