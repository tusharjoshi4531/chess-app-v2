import { Document, Schema, model } from "mongoose";
import { ILiveUserData } from "../types";
import { LIVE_USER_LIFE } from "../config/config";

export interface ILiveUserDoc extends ILiveUserData, Document {
    updatedAt: Date;
}

const liveUserSchema = new Schema<ILiveUserDoc>({
    userid: { type: String, required: true, unique: true },
    socketId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now(),
        expires: LIVE_USER_LIFE,
    },
});

const liveUserModel = model<ILiveUserDoc>("live users", liveUserSchema);

export default liveUserModel;
