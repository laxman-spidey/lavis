import mysql from '@app/config/db';
import { log } from '@app/common';
const jwt = require('jsonwebtoken');
import moment from 'moment';


export class Login {


    public mobileno: any;
    public password: any;
    constructor() {
        this.mobileno = '';
        this.password = '';
    }

    // public static async getEmployeesByName(name: string): Promise<Login[]> {
    //     log.info("employee.model -> getEmployeeByName: before query");
    //     const query = `select * from employee where name = "${name}"`;
    //     log.info("employee.model -> getEmployeeByName: ", { query });
    //     const [rows, fields] = await mysql.query(query);
    //     log.info("employee.model -> getEmployeeByName: ", { rows });
    //     const employees: Login[] = [];
    //     const result = JSON.parse(JSON.stringify(rows));
    //     result.forEach((row: any) => {
    //         const e = new Login();
    //         log.info("employee.model -> getEmployeeByName: ", { row });
    //         e.name = row['name'];
    //         employees.push(e);
    //     });
    //     return employees;
    // }

    public static async login(mobileno: string, password: string) {

        let mobile: string = mobileno;
        console.log("Login -> login -> phone", mobile)
        let pass: string = password;
        console.log("Login -> login -> pass", pass)
        const query = `select * from users where mobile = '${mobile}' and password = '${pass}'`;
        console.log("Login -> login -> query", query)
        const [rows, fields] = await mysql.query(query);
        const result = JSON.parse(JSON.stringify(rows));
        let status;
        if (result.length != 0) {
            const userName = result[0].name;
            const user_id=result[0].id;
            const role=result[0].role
            // const organization_id: number = result[0].org_id;
            console.log("Login -> login -> result", result);

            // JSON.stringify(result.phone) 
            console.log("Login -> login -> JSON.stringify(result.phone)", result[0].mobile)
            let resultPhone = result[0].mobile;
            if (resultPhone === mobile) {
                let token = jwt.sign({
                    resultPhone: mobile
                }, 'carwash', {
                    // expiresIn: 144000 // expires in 24 hours
                });
                let currentDateTime: Date = new Date();
                let isExpired = 1//false;

                //insert into user_token
                const insertQueryUserToken = `insert into user_token(token,user_id,is_expired) values('${token}', ${result[0].id},${isExpired})`;
                const [rows1, fields1] = await mysql.query(insertQueryUserToken);

                //getting role name
                // let role_id = result[0].role_id;
                // const roleQuery = `select * from role where id=${role_id}`;
                // const [rows2, fields2] = await mysql.query(roleQuery);
                // const roleNameResult = JSON.parse(JSON.stringify(rows2));
                // let roleName = roleNameResult[0].name;
                // console.log("Login -> login -> roleName", roleName)

                //sending status
                status = {
                    success: true,
                    name: userName,
                    user_id:user_id,
                    token: token,
                    currentDateTime: currentDateTime,
                    isExpired: isExpired,
                    role: role,
                    message: 'Login Successful'
                };
            }
        }
        else {
            status = {
                success: false,
                message: 'Invalid Credentials'
            };
        }
        return status;
    }
}