import { Request, Response, NextFunction } from "express";

const {google} = require('googleapis');
import { URL } from 'url';
import config from '@app/config';
import moment from 'moment';


export default class AuthService {
  // private googleOauth2 = new google.auth.OAuth2(config.GOOGLE.CLIENT_ID, config.GOOGLE.CLIENT_SECRET, config.GOOGLE.REDIRECT_URI);

  // public generateGoogleURl = async () => {
  //   try {
  //     const url = await this.googleOauth2.generateAuthUrl({
  //       access_type: 'offline',
  //       scope: config.GOOGLE.SCOPE
  //     });
  //     if (url) {
  //       return url;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

}