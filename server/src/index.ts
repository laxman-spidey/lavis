import env from './config';
import App from './app'

const app: App = new App(env.PORT);
/**
   * @swagger
   * /auth/employees
   *  get:
   *   description:'apijjj'
   *    responses:
   *     '200':
   *      'description':'success'
  */
app.listen();
