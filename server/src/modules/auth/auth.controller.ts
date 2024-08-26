import { Router } from 'express';
import AuthService from './auth.service';
import { Request, Response, NextFunction } from "express";
import { RESPONSE, ErrorResponse, ERROR_MESSAGES } from '@app/common';
import { log } from '@app/common';
import { Employee } from '@models/employee/employee.model';
import { Login } from 'src/models/auth/login.model';
import { any } from 'bluebird';


export class AuthController {
  public router: Router = Router();
  private authService: AuthService = new AuthService();
  public Username = "";
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
    this.router.get('/employees', this.getEmployeeList);
    this.router.post('/login', this.login);
    // this.router.get('/google', this.generateGoogleURl);
    // this.router.get('/sample', this.sample)
    // this.router.post('/importexcel', this.saveExceldata);
    // this.router.post('/oneTimeResgistration', this.oneTimeRegistration);
  }

  public login = async (req: Request, res: Response) => {

    try {
      console.log("AuthController -> publiclogin -> req", req)
      let phone: string = req.body.mobileno;
      let pass: string = req.body.password;
      const status = await Login.login(phone, pass);
      console.log("AuthController -> publiclogin -> status:", status)
      this.Username = status?.name;
      res.status(200).json(status);
    }
    catch (error: any) {
      log.error(error.toString());
      res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    }
  }


  public getEmployeeList = async (req: Request, res: Response) => {
    try {
      log.info("Fetching employee data for name: ", { "name": "spidey" })
      const employees = await Employee.getEmployeesByName('laxman');
      log.info("auth.controller -> getEmployeeList ", { employees })
      res.status(200).json(employees);
    }
    catch (error) {
      log.error(error);
      res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    }
  }

  // public generateGoogleURl = async (req: Request, res: Response) => {
  //   try{
  //     const url = await this.authService.generateGoogleURl();
  //     CourseModel
  //     res.status(200).json({ url });  
  //   }
  //   catch (error) {
  //     res.status(500).json(ErrorResponse.GOOGLE_ERROR);
  //   }
  // }
  // public sample = async (req: Request, res: Response) => {
  //   log.error("reporting error");
  //   res.status(200).json(new RESPONSE());  
  // }
}




