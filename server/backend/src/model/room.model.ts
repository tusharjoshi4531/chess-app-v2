import { Document, Schema, model } from "mongoose";

export interface IChatMessage {
    id: string;
    username: string;
    message: string;
}

export interface IRoom {
    white: string;
    whiteConnected: boolean;
    whiteRemainigTime: number;
    black: string;
    blackConnected: boolean;
    blackRemainigTime: number;
    lastMoveTime: number;
    boardHistory: string[];
    spectators: string[];
    chats: IChatMessage[];
}

export interface IRoomDoc extends Document, IRoom {
    createdAt: Date;
}

const chatSchema = new Schema<IChatMessage>({
    id: { type: String, required: true },
    username: { type: String, required: true },
    message: { type: String, required: true },
});

const roomSchema = new Schema<IRoomDoc>({
    white: { type: String, required: true },
    whiteConnected: { type: Boolean, required: true, default: false },
    whiteRemainigTime: { type: Number, required: true, default: 0 },
    black: { type: String, required: true },
    blackConnected: { type: Boolean, required: true, default: false },
    blackRemainigTime: { type: Number, required: true, default: 0 },
    boardHistory: { type: [String], required: true, default: [] },
    spectators: { type: [String], required: true, default: [] },
    chats: { type: [chatSchema], required: true, default: [] },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        expires: "1d",
    },
});

const roomModel = model<IRoomDoc>("Rooms", roomSchema);

roomModel.watch().on("change", (change) => {
    console.log(change);
});

export default roomModel;
