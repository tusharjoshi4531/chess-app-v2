import { Document, Schema, model } from "mongoose";

export interface ITimeControl {
    minutes: number;
    seconds: number;
}

export interface IChallenge {
    status: string;
    time: ITimeControl;
    black: string;
    white: string;
}

export interface IChallengeDoc extends IChallenge, Document {
    timestamp: Date;
}

const timeSchema = new Schema<ITimeControl>({
    minutes: { type: Number, required: true },
    seconds: { type: Number, required: true },
});

const challengeSchema = new Schema<IChallengeDoc>({
    status: { type: String, required: true },
    time: { type: timeSchema, required: true },
    black: { type: String, required: true },
    white: { type: String, required: true },
    timestamp: { type: Date, required: true, expires: 0, default: Date.now() + 24 * 60 * 60 * 1000 },
});

const challengeModel = model<IChallengeDoc>("Challenge", challengeSchema);
export default challengeModel;