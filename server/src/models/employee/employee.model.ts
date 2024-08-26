import mysql from '@app/config/db';
import { log } from '@app/common';

export class Employee {


    public name: string;
    constructor() {
        this.name = '';
    }

    public static async  getEmployeesByName(name: string): Promise<Employee[]>  {        
        log.info("employee.model -> getEmployeeByName: before query");
        const query = `select * from workers where name = "${name}"`;
        log.info("employee.model -> getEmployeeByName: ",{query});
        const [rows, fields] = await mysql.query(query);
        log.info("employee.model -> getEmployeeByName: ",{rows});
        const employees : Employee[]= [];
        const result = JSON.parse(JSON.stringify(rows));
        result.forEach((row: any) => {
            const e = new Employee();
            log.info("employee.model -> getEmployeeByName: ",{row});
            e.name = row['name'];
            employees.push(e);
        });
        return employees;
    }
}