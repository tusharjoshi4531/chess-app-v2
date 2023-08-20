import { Document, Schema, model } from "mongoose";

export interface IUserDoc extends Document {
    username: string;
    firstname: string;
    lastname: string;
    password: string;
}

const userSchema = new Schema<IUserDoc>({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
});

const userModel = model<IUserDoc>("user", userSchema);
export default userModel;
