import { FilterQuery } from "mongoose";
import liveUserModel from "../model/live-user.model";
import { ILiveUserData } from "../types";
import { error500 } from "../error/app.error";
import { deleteCache, getCache, setCache } from "./rediscache.service";
import { TEN_MINUTES_IN_MS } from "../config/config";

export const addLiveUser = async (user: ILiveUserData) => {
  const res = await liveUserModel.findOneAndUpdate(
    { userid: user.userid },
    { ...user, updatedAt: Date.now() },
    { upsert: true, new: true }
  );

  setCache(`liveUsers::socktetId:${user.socketId}`, res, TEN_MINUTES_IN_MS);
  setCache(`liveUsers::username:${user.username}`, res, TEN_MINUTES_IN_MS);
  return res;
};

export const removeLiveUserWithSocketId = async (socketId: string) => {
  deleteCache(`liveUsers::socktetId:${socketId}`);
  const deletedUser = await liveUserModel.findOneAndDelete({
    socketId,
  });
  deletedUser && deleteCache(`liveUsers::username:${deletedUser?.username}`);
};

export const getSocketIdFromUsername = async (username: string) => {
  try {
    const cachedUser = await getCache<ILiveUserData>(
      `liveUsers::username:${username}`
    );
    if (cachedUser) return cachedUser.socketId;

    const user = await liveUserModel.findOne({ username });
    if (!user) return "";

    setCache(`liveUsers::socktetId:${user.socketId}`, user, TEN_MINUTES_IN_MS);
    return user.socketId;
  } catch (error) {
    throw error500("Couldn't get socket id");
  }
};

export const getUsernameFromSocketId = async (socketId: string) => {
  try {
    const cachedUser = await getCache<ILiveUserData>(
      `liveUsers::socktetId:${socketId}`
    );
    if (cachedUser) return cachedUser.username;

    const user = await liveUserModel.findOne({ socketId });
    if (!user) return "";

    setCache(`liveUsers::username:${user.username}`, user, TEN_MINUTES_IN_MS);
    return user.username;
  } catch (error) {
    throw error500("Couldn't get username");
  }
};
