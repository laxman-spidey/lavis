import { ErrorResponse, log } from "@app/common";
import { Employee } from "@models/employee/employee.model";
import { Request, Response, Router } from "express";
import { Login } from "src/models/auth/login.model";
import { authServiceProvider } from "./auth.service";
import { logger } from "src/config/logger";
import config from "@app/config";
import { RESPONSE } from "@app/common/response";

type LoginRequestParams = {
  username: string;
  password: string;
};

const login = async (req: Request<LoginRequestParams>, res: Response) => {
  try {
    const { username, password } = req.body;
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
  } catch (error: any) {
    log.error(error.toString());
    res.status(500).json(ErrorResponse.GOOGLE_ERROR);
  }
};

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
    this.router.get("/employees", this.getEmployeeList);
    this.router.post("/login", this.login);
    // this.router.get('/google', this.generateGoogleURl);
    // this.router.get('/sample', this.sample)
    // this.router.post('/importexcel', this.saveExceldata);
    // this.router.post('/oneTimeResgistration', this.oneTimeRegistration);
  }

  public login = async (req: Request<LoginRequestParams>, res: Response) => {
    try {
      const { username, password } = req.body;
      logger.debug("AuthController -> publiclogin -> username", username);
      const status = await Login.login(username, password);
      console.log("AuthController -> publiclogin -> status:", status);
      this.Username = status?.name;
      res.status(200).json(status);
    } catch (error: any) {
      log.error(error.toString());
      res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    }
  };

  public getEmployeeList = async (req: Request, res: Response) => {
    try {
      log.info("Fetching employee data for name: ", { name: "spidey" });
      const employees = await Employee.getEmployeesByName("laxman");
      log.info("auth.controller -> getEmployeeList ", { employees });
      res.status(200).json(employees);
    } catch (error) {
      log.error(error);
      res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    }
  };

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
