import { FilterQuery } from "mongoose";
import liveUserModel from "../model/live-user.model";
import { ILiveUserData } from "../types";

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
