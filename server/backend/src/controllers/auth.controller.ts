import { RequestHandler } from "express";
import { makeRequest } from "../util/request";
import { AUTH_SERVER_URL } from "../config/config";
import axios from "axios";
import { Document } from "mongoose";
import _ from "lodash";
import { success200 } from "../error/app.error";

const transformUserData = (data: Document) => {
  const user = { ..._.omit(data, ["_id", "__v"]), userid: data._id };
  return user;
};

const authRequestWrapper = async (path: string, body: any) => {
  const { error, status, response } = await makeRequest(
    AUTH_SERVER_URL,
    path,
    "",
    (url) => axios.post(url, body)
  );

  if (!error) response.user = transformUserData(response.user);

  return { error, status, response };
};

export const signup: RequestHandler = async (req, res) => {
  const { error, status, response } = await authRequestWrapper(
    "/signup",
    req.body
  );

  return res.status(status).json(error ? error : response);
};

export const login: RequestHandler = async (req, res, next) => {
  const { error, status, response } = await authRequestWrapper(
    "/login",
    req.body
  );

  error ? next(error) : next(success200(response));
};

export const logout: RequestHandler = (req, res) => {
  makeRequest(AUTH_SERVER_URL, "/logout", "", (url) =>
    axios.post(url, req.body)
  );
  return res.status(200).json("Logged out");
};
