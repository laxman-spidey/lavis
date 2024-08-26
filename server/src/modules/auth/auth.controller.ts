import { Router } from 'express';
import AuthService from './auth.service';
import { Request, Response, NextFunction } from "express";
import { RESPONSE, ErrorResponse, ERROR_MESSAGES } from '@app/common';
import { log } from '@app/common';
import { Employee } from '@models/employee/employee.model';
import { Login } from 'src/models/auth/login.model';
import { importexcel } from 'src/models/import/importexcel';
import { any } from 'bluebird';
import { Customers } from 'src/models/masters/customers.model';


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
    this.router.post('/importexcel', this.saveExceldata);
    this.router.post('/oneTimeResgistration', this.oneTimeRegistration);
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
    catch (error) {
      log.error(error);
      res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    }
  }
  public oneTimeRegistration = async (req: Request, res: Response) => {

    try {
      const data={
          // first_name:req.body.registerData.first_name,
          // last_name:req.body.registerData.last_name,
          // mobile:req.body.registerData.mobile,
          parking_no:req.body.registerData.parking_no,
          vehicle_no:req.body.registerData.vehicle_no,
          amount:req.body.registerData.amount,
          // dateWash:req.body.registerData.date_of_carwash,
          token:req.body.token,
          user_name:req.body.user_name,
      }
      const status = await Customers.oneTimeWash(data);
      console.log("AuthController -> publiclogin -> status:", status)
      res.status(200).json(status);
    }
    catch (error) {
      log.error(error);
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

  public saveExceldata = async (req: Request, res: Response) => {
    try {
      let recordsExist = req.body.replace;
      let dzc_id = req.body.dzc_id;
      let month = req.body.month;
      let year = req.body.year;
      let data = JSON.parse(req.body.data);
      let exceldata = JSON.parse(data.data)
      console.log("export excel data", exceldata);
      if (exceldata.sheet.length != 0) {
        let sheet: [] = [];
        sheet = exceldata.sheet.filter((sheet: any) => (sheet.esi_no != ''))
        let filename = data.name;
        let numOfRecords = sheet.length;
        let filepath = 'uploads/' + filename;
        let uploadedBy = this.Username;
        let At = new Date;
        const uploadexcelfunctioncall = await importexcel.insertUpdateTable(filename, numOfRecords, filepath, uploadedBy, At, dzc_id, month, year);
        console.log("uploadexcelfunctioncall status", uploadexcelfunctioncall);
        if (uploadexcelfunctioncall.success == true) {
          // sheet.forEach(async (element:any) => {
          //   console.log(element.pf_no);
          if (recordsExist) {
            const deleteRecords = await importexcel.deleteAndInsertWages(sheet, month, year)
            console.log(deleteRecords);
            if (deleteRecords.status) {
              const wages = await importexcel.setWagesTable(sheet, month, year, uploadexcelfunctioncall.id,dzc_id)
              console.log(wages);
              if (wages.status) {
                const docCountUpdate = await importexcel.insertUpdateTable(filename, wages.numOfRecords, filepath, uploadedBy, At, dzc_id, month, year);
                if (docCountUpdate.success) {
                  res.status(200).json(wages);
                } else {
                  res.status(500).json(docCountUpdate);
                }
              } else if (!wages.status) {
                res.status(500).json(wages);
              }
            } else if (!recordsExist.status) {
              res.status(500).json(deleteRecords);
            }

          } else if (!recordsExist) {
            const verify = await importexcel.verifyworker(sheet, month, year)
            if (verify.status && verify.existWorker.length > 0) {
              console.log('records already exist for this month', verify.existWorker.length);
              res.status(200).json(verify);

            }
            else if (verify.status && verify.existWorker.length == 0) {
              const wages = await importexcel.setWagesTable(sheet, month, year, uploadexcelfunctioncall.id,dzc_id)
              console.log(wages);
              // if (wages != null || wages != undefined) {
              // const workersTableEntry = await importexcel.workersWagesEntry(element.designation_id, element.absent_days, wages);
              //   if (wages.success == true) {
              //     res.status(200).json(uploadexcelfunctioncall);
              //   }
              //   else {
              //     res.status(400).json(uploadexcelfunctioncall);
              //   }
              // }
              // });
              if (wages.status) {
                const docCountUpdate = await importexcel.insertUpdateTable(filename, wages.numOfRecords, filepath, uploadedBy, At, dzc_id, month, year);
                if (docCountUpdate.success) {
                  res.status(200).json(wages);
                } else {
                  res.status(500).json(docCountUpdate);
                }
              } else if (!wages.status) {
                res.status(500).json(wages);
              }
            }else{
              res.status(500).json(verify);
            }
          }


        }
      }
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




