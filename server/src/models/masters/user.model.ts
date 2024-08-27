import mysql from '@app/config/db';
import { log } from '@app/common';
const jwt = require('jsonwebtoken');
import moment from 'moment';

export class Users {
    public static async getUsers() {
   
        const getUsersQuery = `select * from users where date_deleted is NULL`;
        const [rows, fields] = await mysql.query(getUsersQuery);
        const result = JSON.parse(JSON.stringify(rows));
        return result;
    }

    public static async deleteUser(data:any) {
   
        const deleteUserQuery = `update users set date_deleted=CURDATE(),deleted_by='${data.user_name}' where id=${data.id}`;
        const [rows, fields] = await mysql.query(deleteUserQuery);
        const result = JSON.parse(JSON.stringify(rows));
        let status;
        return status = {
            success: true,
            message: 'User deleted successfully.'
        };
    }

      public static async getScheduleListByUserId(id: number) {
        const getScheduleListQuery = `select DISTINCT b.name as building_name,b.id as building_id,l.address as location,sl.schedule_id as schedule_id,sl.status as status,sl.date,ws.*,v.registration_no,v.parking_no,u.* 
        from users u
                        inner join workers w on u.id=w.user_id
                        inner join worker_building wb on wb.worker_id=w.id
                        inner join work_schedule ws on ws.worker_building_id=wb.id and ws.end_date is null
                        inner join vehicles v on v.id=ws.vehicle_id
                        inner join customers c on v.customer_id=c.id and c.status=1
                        inner join schedule_logs sl on ws.id=sl.schedule_id 
                        inner join buildings b on wb.building_id=b.id
                        inner join location l on b.location_id=l.id
        where u.id=${id} and YEARWEEK(sl.date)=YEARWEEK(now())
        ORDER by building_name,sl.date DESC;`;
        const [rows, fields] = await mysql.query(getScheduleListQuery);
        const result = JSON.parse(JSON.stringify(rows));
        console.log(result);
        return result;
    }

}
