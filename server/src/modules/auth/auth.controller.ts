import { ERROR_RESPONSES, log, Krypto } from "@app/common";
import { RESPONSE } from "@app/common/response";
import config from "@app/config";
import { Request, Response } from "express";
import passport from "passport";

import { getNewRouter } from "src/common/router";
import User from "src/models/user/user.model";
import { ExtractJwt } from "passport-jwt";
import { authServiceProvider } from "./auth.service";
import { UserService } from "../user/user.service";

type LoginRequestParams = {
  username: string;
  password: string;
};

export const login = async (
  req: Request<LoginRequestParams>,
  res: Response,
  next: any
) => {
  try {
    const { email, password } = req.body;
    // console.log(passport);
    passport.authenticate(
      "local",
      { session: false },
      (error: any, user: any, info: any) => {
        if (error) {
          return res.status(200).json(ERROR_RESPONSES.SOMETHING_WENT_WRONG);
        } else if (!user) {
          return res.status(200).json(ERROR_RESPONSES.AUTH_INVALID_CREDS);
        }
        const date = new Date();
        const iat = Math.floor(date.getTime() / 1000);
        const exp = Math.floor(date.setDate(date.getDate() + 7) / 1000);

        const token = authServiceProvider.generateToken(
          { username: email, iat, exp },
          config.JWT_SECRET
        );
        //TODO: default userData has to be moved to the model
        // const userData = await UserService.getUser({ username: email });
        return res.json(new RESPONSE({ access_token: token, user }));
      }
    )(req, res, next);
  } catch (error) {
    log.error((error as any).toString());
    console.error(error);
    res.status(500).json(ERROR_RESPONSES.AUTH_ERROR);
  }
};

export const register = async (
  req: Request<LoginRequestParams>,
  res: Response,
  next: any
) => {
  try {
    const { displayName, email, password } = req.body;
    const hashedPassword = await Krypto.encrypt(password);

    const existingUser = await User.findOne({
      username: email,
    });
    //TODO: Split the code into service and controller
    if (existingUser) {
      return res.status(200).json(ERROR_RESPONSES.REGISTER_USER_ALREADY_EXISTS);
    }
    const user = new User({
      displayName: displayName,
      username: email,
      password: hashedPassword,
      role: "patient",
      data: {
        displayName: displayName,
        photoURL: "assets/images/avatars/brian-hughes.jpg",
        email: email,
        settings: {
          layout: {},
          theme: {},
        },
        shortcuts: ["apps.calendar", "apps.mailbox", "apps.contacts"],
      },
    });
    const savedData = await user.save();
    console.log(savedData);
    const token = authServiceProvider.generateToken(
      { username: email },
      config.JWT_SECRET
    );
    const { password: _, ...userWithoutPassword } = user;
    const userData = {
      uid: user._id,
      ...userWithoutPassword,
    };
    res.json(new RESPONSE({ access_token: token, user: userData }));
  } catch (err) {
    console.log(err);
    res.status(500).json(ERROR_RESPONSES.REGISTER_ERROR);
  }
};
// this.router.get("/employees", this.getEmployeeList);
// this.router.post("/login", this.login);

const getUser = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(200).json(ERROR_RESPONSES.AUTH_USER_NOT_FOUND);
    }
    res.status(200).json(new RESPONSE(user));
  } catch (error) {
    res.status(500).json(ERROR_RESPONSES.AUTH_ERROR);
    console.log(error);
  }
};

export const AuthController = {
  initialize: () => {
    const router = getNewRouter();
    router.post("/login", login);
    router.post("/register", register);
    router.get(
      "/user",
      passport.authenticate("jwt", { session: false }),
      getUser
    );
    return router;
  },
};
