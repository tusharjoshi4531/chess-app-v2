import mongoose, { Document, Schema, model } from "mongoose";
import { REFRESH_TOKEN_LIFE } from "../config/config";

export interface IValidTokenDoc extends Document {
    userid: mongoose.Types.ObjectId;
    refreshToken: string;
    refreshedAt: Date;
}

const validTokenSchema = new Schema<IValidTokenDoc>({
    userid: { type: Schema.ObjectId, unique: true, required: true },
    refreshToken: { type: String, unique: true, required: true },
    refreshedAt: {
        type: Date,
        expires: REFRESH_TOKEN_LIFE,
        default: Date.now(),
    },
});

const validTokenModel = model<IValidTokenDoc>(
    "Valid Refresh Tokens",
    validTokenSchema
);

export default validTokenModel;
