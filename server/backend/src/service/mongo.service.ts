import mongoose from "mongoose";
import { MONGO_CONNECTION_STRING } from "../config/config";

export default function connect() {
  mongoose
    .connect(MONGO_CONNECTION_STRING)
    .then(() => console.log(`connected to ${MONGO_CONNECTION_STRING}`))
    .catch((err) => console.log(err));
}
