import { ERROR_RESPONSES, ErrorResponse, log } from "@app/common";
import { Employee } from "@models/employee/employee.model";
import { Request, Response, Router } from "express";
import { Login } from "src/models/auth/login.model";
import { authServiceProvider } from "./auth.service";
import { logger } from "src/config/logger";
import config from "@app/config";
import { RESPONSE } from "@app/common/response";
import { router, getNewRouter } from "src/common/router";

type LoginRequestParams = {
    username: string;
    password: string;
};

export const login = async (
    req: Request<LoginRequestParams>,
    res: Response
) => {
    try {
        console.log("/login", req.body);
        const { username, password } = {
            username: "username",
            password: "password",
        };
        authServiceProvider.authenticate(
            "local",
            { session: false },
            (req: Request<LoginRequestParams>, res: Response) => {
                const token = authServiceProvider.generateToken(
                    { username: username },
                    config.JWT_SECRET
                );
                res.json(new RESPONSE({ token }));
            }
        );
    } catch (error) {
        log.error(error.toString());
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
