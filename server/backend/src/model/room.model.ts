import { Document, Schema, model } from "mongoose";

export interface IRoom {
    white: string;
    whiteConnected: boolean;
    black: string;
    blackConnected: boolean;
    boardHistory: string[];
    spectators: string[];
}

export interface IRoomDoc extends Document, IRoom {
    createdAt: Date;
}

const roomSchema = new Schema<IRoomDoc>({
    white: { type: String, required: true },
    whiteConnected: { type: Boolean, required: true, default: false },
    black: { type: String, required: true },
    blackConnected: { type: Boolean, required: true, default: false },
    boardHistory: { type: [String], required: true, default: [] },
    spectators: { type: [String], required: true, default: [] },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        expires: "1d",
    },
});

const roomModel = model<IRoomDoc>("Rooms", roomSchema);
export default roomModel;
