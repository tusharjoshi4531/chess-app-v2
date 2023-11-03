import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Formik } from "formik";

import * as yup from "yup";

export interface ISpectateUserFormValues {
    roomId: string;
}

const validationSchema = yup.object<ISpectateUserFormValues>({
    roomId: yup.string().required("Required"),
});

const initialValues: ISpectateUserFormValues = {
    roomId: "",
};

interface ISpectateUserFormProps {
    onSubmit: (values: ISpectateUserFormValues) => void;
}

const SpectateUserForm: React.FC<ISpectateUserFormProps> = ({ onSubmit }) => {
    const submitHandler = (values: ISpectateUserFormValues) => {
        onSubmit(values);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitHandler}
        >
            {(formik) => (
                <Paper>
                    <Stack
                        margin={3}
                        spacing={2}
                        component="form"
                        onSubmit={formik.handleSubmit}
                    >
                        <Typography variant="h6" marginBottom={3}>
                            Spectate Game
                        </Typography>
                        <TextField
                            label="Room Id"
                            size="small"
                            error={
                                formik.errors.roomId !== undefined &&
                                formik.touched.roomId !== undefined
                            }
                            helperText={
                                formik.errors.roomId && formik.touched.roomId
                                    ? formik.errors.roomId
                                    : ""
                            }
                            {...formik.getFieldProps("roomId")}
                        />
                        <Button variant="contained" type="submit">
                            Spectate
                        </Button>
                    </Stack>
                </Paper>
            )}
        </Formik>
    );
};

export default SpectateUserForm;
