import { Request, Response, NextFunction } from "express";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import config from "@app/config";
import { User } from "@models/user/user.model";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

const initialize = () => {
    localStrategy();
    jwtStrategy();
};

const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const authServiceProvider = {
    initialize,
    authenticate: passport.authenticate,
    generateToken: sign,
};

const jwtStrategy = () =>
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: config.JWT_SECRET,
            },
            async (payload: { userId: any }, done: (...args: any) => any) => {
                try {
                    const user = await User.findOne({
                        username: payload.userId,
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
            { usernameField: "username" },
            async (
                username: string,
                password: string,
                done: (...args: any) => any
            ) => {
                try {
                    const user = await User.findOne({ username });
                    if (!user) {
                        return done(null, false, {
                            message: "Incorrect username or password.",
                        });
                    }
                    const isMatch = await comparePassword(
                        user.password,
                        password
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
