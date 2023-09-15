import { FilterQuery } from "mongoose";
import liveUserModel from "../model/live-user.model";
import { ILiveUserData } from "../types";
import { error500 } from "../error/app.error";

export const addLiveUser = async (user: ILiveUserData) => {
    console.log({ adduser: user });
    const res = await liveUserModel.findOneAndUpdate(
        { userid: user.userid },
        { ...user, updatedAt: Date.now() },
        { upsert: true, new: true }
    );

    console.log(res);

    return res;
};

export const removeLiveUser = async (query: FilterQuery<ILiveUserData>) => {
    await liveUserModel.findOneAndDelete(query);
};

export const getSocketIdFromUsername = async (username: string) => {
    try {
        const user = await liveUserModel.findOne({ username });
        if (!user) return "";
        return user.socketId;
    } catch (error) {
        throw error500("Couldn't get socket id");
    }
};

export const getUsernameFromSocketId = async (socketId: string) => {
    try {
        const user = await liveUserModel.findOne({ socketId });
        if (!user) return "";
        return user.username;
    } catch (error) {
        throw error500("Couldn't get username");
    }
};
