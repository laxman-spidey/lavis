import { Router } from 'express';
import { Request, Response, NextFunction } from "express";
import { RESPONSE, ErrorResponse } from '@app/common';
import { log } from '@app/common';
import { Employee } from '@models/employee/employee.model';
import { Login } from 'src/models/auth/login.model';



export class UserController {
    public router: Router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        //routes
        /**
          * @swagger
          * /employees:
          *  get:
          *   description:'apijjj'
          *    responses:
          *     '200':
          *      'description':'success'
         */

        // this.router.post('/insertUser', this.insertUser);

    }
    // //insert User
    // public insertUser = async (req: Request, res: Response) => {
    //     console.log("CAME ISNDE")
    //     try {
    //             const insertUser = await User.insertUser(req.body.name, req.body.email, req.body.phone, req.body.password, req.body.role_id, req.body.organization_id);
    //             console.log("UserController -> publicinsertUser -> insertUser", insertUser);
    //             res.status(200).json(insertUser);

    //     }
    //     catch (error) {
    //         log.error(error);
    //         res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //     }
    // }
}




