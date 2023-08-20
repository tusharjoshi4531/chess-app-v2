import { config } from "dotenv";
config();

import app from "./src/app";
import { MONGO_CONNECTION_STRING, PORT } from "./src/config/config";
import mongoose from "mongoose";

const connect = () =>
    mongoose
        .connect(MONGO_CONNECTION_STRING)
        .then(() => console.log(`connected to ${MONGO_CONNECTION_STRING}`))
        .catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
    connect();
});
