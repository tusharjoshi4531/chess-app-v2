import {
    Box,
    Button,
    TextField,
    Grid,
    Container,
    MenuItem,
    Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

enum ChoosePlayerColor {
    WHITE,
    BLACK,
    EITHER,
}

interface ITimeControl {
    minutes: number;
    seconds: number;
}

interface IChallengeUserValues {
    username: string;
    time: ITimeControl;
    color: ChoosePlayerColor;
}

const timeControlSchema = yup.object<ITimeControl>({
    minutes: yup.number().max(60).min(0).required("Required"),
    seconds: yup.number().max(60).min(0).required("Required"),
});

const validationSchema = yup.object<IChallengeUserValues>({
    username: yup.string().required("Required"),
    time: timeControlSchema,
    color: yup.number().required("Required"),
});

const initialValues: IChallengeUserValues = {
    username: "",
    time: {
        minutes: 5,
        seconds: 0,
    },
    color: ChoosePlayerColor.EITHER,
};

const ChallengeUserForm = () => {
    const submitHandler = (values: IChallengeUserValues) => {
        console.log(values);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitHandler}
        >
            {(formik) => (
                <Container component="main" maxWidth="xs">
                    <Typography component="h1" variant="h5">
                        Challenge User
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={
                                        formik.errors.time?.minutes !==
                                            undefined &&
                                        formik.touched.time?.minutes !==
                                            undefined
                                    }
                                    helperText={
                                        formik.touched.time?.minutes ===
                                        undefined
                                            ? ""
                                            : formik.errors.time?.minutes
                                    }
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="minutes"
                                    label="Minutes"
                                    type="number"
                                    {...formik.getFieldProps("time.minutes")}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={
                                        formik.errors.time?.seconds !==
                                            undefined &&
                                        formik.touched.time?.seconds !==
                                            undefined
                                    }
                                    helperText={
                                        formik.touched.time?.seconds ===
                                        undefined
                                            ? ""
                                            : formik.errors.time?.seconds
                                    }
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="seconds"
                                    label="Seconds"
                                    type="number"
                                    {...formik.getFieldProps("time.seconds")}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="color"
                                    fullWidth
                                    select
                                    {...formik.getFieldProps("color")}
                                    value={formik.values.color}
                                >
                                    <MenuItem value={ChoosePlayerColor.WHITE}>
                                        White
                                    </MenuItem>
                                    <MenuItem value={ChoosePlayerColor.BLACK}>
                                        Black
                                    </MenuItem>
                                    <MenuItem value={ChoosePlayerColor.EITHER}>
                                        Either
                                    </MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Challenge
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            )}
        </Formik>
    );
};

export default ChallengeUserForm;
