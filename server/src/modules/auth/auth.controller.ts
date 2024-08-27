import { ERROR_RESPONSES, ErrorResponse, log } from "@app/common";
import { Employee } from "@models/employee/employee.model";
import { Request, Response, Router } from "express";
import { Login } from "src/models/auth/login.model";
import { authServiceProvider } from "./auth.service";
import { logger } from "src/config/logger";
import config from "@app/config";
import { RESPONSE } from "@app/common/response";
import { router, getNewRouter } from "src/common/router";
import passport from "passport";

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
    console.log("/login", req.body);
    const { email, password } = req.body;
    // console.log(passport);
    passport.authenticate(
      "local",
      { session: false },
      (error: any, user: any, info: any) => {
        console.log("🚀 ~ user:", error, user, info);
        if (error) {
          res.status(401).send(error);
        } else if (!user) {
          res.status(401).send(info);
        } else {
          next();
        }

        const token = authServiceProvider.generateToken(
          { username: email },
          config.JWT_SECRET
        );
        const userData = {
          uid: user._id,
          role: "patient",
          data: {
            displayName: "patient",
            photoURL: "assets/images/avatars/brian-hughes.jpg",
            email: user.username,
            settings: {
              layout: {},
              theme: {},
            },
            shortcuts: ["apps.calendar", "apps.mailbox", "apps.contacts"],
          },
        };
        res.json(new RESPONSE({ access_token: token, user: userData }));
      }
    )(req, res, next);
  } catch (error) {
    log.error(error.toString());
    console.log(error);
    res.status(500).json(ERROR_RESPONSES.AUTH_ERROR);
  }
};
// this.router.get("/employees", this.getEmployeeList);
// this.router.post("/login", this.login);

export const AuthController = {
  initialize: () => {
    const router = getNewRouter();
    router.post("/login", login);
    console.log("registered /login");
    return router;
  },
};
