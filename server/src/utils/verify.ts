import { verify, decode } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import  config from '../config';

const getSecret = async (req: Request, res: Response) => {
  const token = req['headers'] && (req['headers']['X-ACCESS-TOKEN'] || req['headers']['authorization']) ? (req['headers']['X-ACCESS-TOKEN'] || req['headers']['authorization']) : null;
  if(token) {
    const decoded = decode(token.toString()) as {_id:String, iat:Number, exp: Number, time: any};
    if(decoded && decoded['_id'] && typeof decoded['_id'] === 'string') {
      try {
        // const studentDetails = await StudentModel.findOne({_id:decoded['_id'],lastLoggedIn: decoded['time']});
        // if(studentDetails) {
        //   return Promise.resolve(decoded['_id']);
        // }else {
        //   return Promise.reject(null);
        // }
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    }
  }
}
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const secret = await getSecret(req,res);
    // req['tokenId'] = secret;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(401);    
  }
}
