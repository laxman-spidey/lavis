import { Request, Response, NextFunction } from "express";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import config from "@app/config";
import { Krypto } from "@app/common";
import { User } from "@models/user/user.model";
import { sign } from "jsonwebtoken";
import { UserService } from "../user/user.service";
// import bcrypt from "bcrypt";

export const initialize = () => {
  localStrategy();
  jwtStrategy();
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // deserialize user object
  passport.deserializeUser(function (user, done) {
    done(null, user as any);
  });
  //   localStrategy();
  //   jwtStrategy();
  //   return passport.initialize();
};
export const protect = passport.authenticate("jwt", { session: false });

export const authServiceProvider = {
  initialize,
  authenticate: (...args: any) => {
    return passport.authenticate(args);
  },
  generateToken: sign,
  protect: protect,
};

const jwtStrategy = () =>
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWT_SECRET,
      },
      async (payload: { username: string }, done: (...args: any) => any) => {
        try {
          console.log("🚀 ~ payload:", payload);
          const user = await UserService.getUser({
            username: payload.username,
          });
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
const localStrategy = () =>
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email: string, password: string, done: (...args: any) => any) => {
        try {
          console.log("🚀 ~ user:", email);
          //   return done(null, true);
          const user = await User.findOne({ username: email });
          if (!user) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          const isMatch = await Krypto.comparePassword(
            password,
            user?.password
          );
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
