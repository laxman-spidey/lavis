import express, { RequestHandler } from "express";
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import config from './config';
import { AuthController } from "./modules/auth";
import { UserController } from "./modules/user/user.controller";

import {logger} from './common';
import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { Options } from "swagger-jsdoc";
import * as swaggerdocument from "./swagger.json"
// import * as swaggerJsdoc from "swagger-jsdoc";
import { IncomingForm } from 'formidable';
import * as path from 'path';
import multer from 'multer';
import { MasterController } from "./modules/masters/master.controller";
var fileUpload = require('express-fileupload');


export default class App {

  public app: express.Application = express();
  public port: number;
  private authController = new AuthController();
  private masterController = new MasterController();
  // private workerController = new WorkerController();
  private userController = new UserController();

  // private swaggerJsdoc = swaggerJsdoc;
  private swaggerUi = swaggerUi;
  client: any;
  swaggerOptions?: Options;
  constructor(port: number) {
    this.port = port;
    this.config();

  }


  private config = () => {
    this.app.use(cors());
    this.bodyParserConfig();
    // this.initializeRoutes();
    //var publicDir = path.join(__dirname, 'public')
    const staticfiles = express.static('public');
    this.app.use(staticfiles as RequestHandler);
    this.app.get('/*', (req, res) => res.sendFile(__dirname + "/public/index.html"));

    // this.app.use('/*', (req, res, next) => { // This Method should always be last. All other routes must define above this.
    //   res.sendFile("/public/index.html");
    // });
    // this.app.get('/', function (req, res) {
    //   res.sendFile(path.join(publicDir, 'index.html'))
    // })

    // this.app.use('/*', express.static('public',undefined, () => {

    // }))
    // this.app.use('/*', (req, res, next) => { // This Method should always be last. All other routes must define above this.
    //   res.sendFile("/root/carwash/public/index.html");
    // });
    // this.swaggerOptions = {
    //   swaggerDefinition:{
    //     info:{
    //       title:"API",
    //       description:"ghms api information",
    //       version:'1.0'
    //     }
    //   },
    //   apis:["./modules/auth/*.ts","app.ts","app.js","index.ts","index.js","./modules/auth/*.js"]
    // };
    // const swaggerdocs = swaggerJsdoc(this.swaggerOptions);
    this.app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerdocument))
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      next();
    });
    this.app.use(fileUpload());
  }

  store = multer.diskStorage({
    destination: (req, file) => { './uploads' },
    filename: (req, file) => { Date.now() + '.' + file.originalname }
  });

  upload = multer({ storage: this.store })

  private bodyParserConfig = () => {
    this.app.use(json({ limit: '50mb' }));
    this.app.use(urlencoded({ limit: '50mb', extended: true }));
  }


  private initializeRoutes = () => {

    this.app.use('/auth', this.authController.router);
    this.app.use('/master', this.masterController.router);
    this.app.use('/user', this.userController.router);
    this.app.use('/designation', this.userController.router);
    this.app.use('/upload', (req, res) => {
      if (req.files.length == 0) {
        res.send('No files were uploaded.');
        return;
      }
      // var sampleFile;
      // var exceltojson;
      // var file = req.file.originalname;
      // console.log('inside the function', file)
      // this.upload(req, res, (err) => {
      //   if (err) {

      //   } else {
      //     return res.json({ originalname: req.file.originalname, uploadname: req.file.filename })
      //   }

      // })
      const form = new IncomingForm()
      form.parse(req);
      form.on('fileBegin', function (name: string, file: any) {
        file.path = path.join(__dirname, '/uploads' + "/" + file.name);
      });
      form.on('file', function (name: string, file: any) {
        console.log('Uploaded ' + file.name, file.path);
      });
      form.on('end', () => {
        res.json("Sucess");
      });
    });
  }

  public listen = () => {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }


}