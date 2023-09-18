import { Document, Schema, model } from "mongoose";

export interface IChatMessage {
    id: string;
    username: string;
    message: string;
}

export interface IChatDoc extends Document, Omit<IChatMessage, "id"> {}

export interface IRoom {
    white: string;
    whiteConnected: boolean;
    whiteRemainigTime: number;
    turn: "w" | "b";
    black: string;
    blackConnected: boolean;
    blackRemainigTime: number;
    lastMoveTime: number;
    boardHistory: string[];
    spectators: string[];
    chats: IChatMessage[];
    finished: boolean;
    timerStarted: boolean;
}

export interface IRoomDoc extends Document, Omit<IRoom, "chats"> {
    createdAt: Date;
    lastMove: number;
    chats: IChatDoc[];
}

const chatSchema = new Schema<IChatMessage>({
    username: { type: String, required: true },
    message: { type: String, required: true },
});

const roomSchema = new Schema<IRoomDoc>({
    white: { type: String, required: true },
    whiteConnected: { type: Boolean, required: true, default: false },
    whiteRemainigTime: { type: Number, required: true, default: 0 },
    turn: { type: String, required: true, default: "w" },
    black: { type: String, required: true },
    blackConnected: { type: Boolean, required: true, default: false },
    blackRemainigTime: { type: Number, required: true, default: 0 },
    boardHistory: {
        type: [String],
        required: true,
        default: ["rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"],
    },
    spectators: { type: [String], required: true, default: [] },
    chats: { type: [chatSchema], required: true, default: [] },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        expires: "1d",
    },
    lastMove: { type: Number, required: true, default: Date.now() },
    timerStarted: { type: Boolean, required: true, default: false },
    finished: { type: Boolean, required: true, default: false },
});

const roomModel = model<IRoomDoc>("Rooms", roomSchema);

export default roomModel;
