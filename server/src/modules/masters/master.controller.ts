import { Router, response } from 'express';
import { Request, Response, NextFunction } from "express";
import { RESPONSE, ErrorResponse, ERROR_MESSAGES } from '@app/common';
import { log } from '@app/common';
import { Location } from '@models/masters/location.model';
import { Buildings } from '@models/masters/buildings.model';
import { Customers } from '@models/masters/customers.model';
import { Vehicles } from '@models/masters/vehicles.model';
import { Workers } from 'src/models/masters/workers.model';
import { any } from 'bluebird';
import { Users } from 'src/models/masters/user.model';
import moment from 'moment';


// import { Employee } from '@models/employee/employee.model';
// import { Login } from 'src/models/auth/login.model';
// import { Departments } from 'src/models/masters/departments.model';
// import { Zones } from 'src/models/masters/zones.model';
// import { Circles } from 'src/models/masters/circle.model';
// import { Organization } from 'src/models/masters/organization.model';
// import { Role } from 'src/models/masters/role.model';
// import { Designation } from 'src/models/masters/designation.model';
// import { Group } from 'src/models/masters/group.model';
// import { DepartmentZoneCircle } from 'src/models/masters/dzc.model';
// import { User } from 'src/models/user/user.model';
// import { Wages } from 'src/models/masters/wages.model';
// import { PayRollRunLog } from 'src/models/masters/payroll_run.model';
// import { AddRunPayRoll } from 'src/models/masters/add_run_payroll.model';
// import { DocumentsProcess } from 'src/models/masters/documentsProcess.model';
// import { GenerateStatement } from 'src/models/masters/generate_statement.model';



export class MasterController {
    public router: Router = Router();

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

        this.router.get('/getAllLocations', this.getLocations);
        this.router.get('/getAllBuildings', this.getBuildings);
        this.router.post('/addBuilding', this.addBuilding);
        this.router.post('/editBuilding', this.editBuilding);
        this.router.post('/addCustomer', this.addCustomer);
        this.router.post('/editCustomer', this.editCustomer);
        this.router.get('/getAllWorkers', this.getWorkers);
        // this.router.get('/getEditBuildings', this.getEditBuildings);
        this.router.post('/addNewWorker', this.addWoker);
        this.router.post('/editWorker', this.editWorker);
        this.router.post('/deleteBuilding', this.deleteBuilding);
        this.router.post('/deleteWorker', this.deleteWorker);
        this.router.get('/getAllCustomers', this.getCustomers);
        this.router.post('/getWorkDetails', this.getWorkDetails);
        this.router.get('/getAllworkerBuildings', this.getAllworkerBuildings);
        this.router.post('/updateWorkStatus', this.updateWorkStatus);
        this.router.post('/getCarwashRecords', this.getCarwashRecords);
        this.router.post('/getCarDetailsOfScheduleDate', this.getCarDetailsOfScheduleDate);
        this.router.post('/deleteCustomer', this.deleteCustomer);
        this.router.post('/activateCustomer', this.activateCustomer);
        this.router.post('/activateWorker', this.activateWorker);
        this.router.get('/getUsers', this.getUsers);
        this.router.post('/deleteUser', this.deleteUser);
        this.router.post('/getScheduleListByUserId', this.getScheduleListByUserId);








    }
    public getCarwashRecords = async (req: Request, res: Response) => {
        const data=req.body;
        try {
            const washRecords = await Vehicles.getCarwashRecords(data);
            res.status(200).json(washRecords);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    public getCarDetailsOfScheduleDate = async (req: Request, res: Response) => {
        try {
            const carsDetails = await Vehicles.getCarDetailsOfScheduleDate(req.body);
            res.status(200).json(carsDetails)
        } catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    //get Locations
    public getLocations = async (req: Request, res: Response) => {
        try {
            const locationsList = await Location.getAllLocations();
            res.status(200).json(locationsList);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    public getAllworkerBuildings = async (req: Request, res: Response) => {
        try {
            const locationsList = await Buildings.getAllworkerBuildings();
            res.status(200).json(locationsList);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }

    public updateWorkStatus = async (req: Request, res: Response) => {
        try {
            // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            // var lastDateOfTheMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            // var lastDateOfTheMonth = new Date(moment(req.body.date).year(), moment(req.body.date).month(), 0);
            var lastDateOfTheMonth = moment(req.body.date).endOf('month');
            let startDay = moment([moment(lastDateOfTheMonth).get('year'), moment(lastDateOfTheMonth).get('month'), moment(lastDateOfTheMonth).get('date')]).add(1, 'day');
            // let lastDay = moment(lastDateOfTheMonth.toISOString()).format("YYYY-MM-DD");
            let dateFrom = moment(lastDateOfTheMonth).subtract(8, 'd').format('YYYY-MM-DD');
            let scheduleDate = moment(req.body.date).format('YYYY-MM-DD')
            const locationsList = await Workers.updateWorkStatus(req.body);
            if (moment(scheduleDate).isSameOrAfter(dateFrom) || moment(scheduleDate).isSame(lastDateOfTheMonth)) {
                const scheduleExtend = await Workers.ExtendScheduleDates(req.body, startDay);
                if (!scheduleExtend) {
                    console.log('schedule logs are not extended')
                }
            }
            res.status(200).json(locationsList);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }

    // get buildings
    public getBuildings = async (req: Request, res: Response) => {
        try {
            const buildingsList = await Buildings.getAllBuildings();
            res.status(200).json(buildingsList);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    public addCustomer = async (req: Request, res: Response) => {
        try {

            const vehicleSchedule = req.body.vehicles
            const isExistCust = await Customers.checkCustomer(req.body);
            const isExistVehicle = await Vehicles.checkVehicle(vehicleSchedule);
            if (isExistCust.length == 0 && isExistVehicle.length == 0) {
                const newCustomerId = await Customers.addCustomer(req.body);
                console.log('inserted customer_id', newCustomerId.insertId)
                if (newCustomerId.insertId != undefined) {
                    const vehicleAddRes = await Vehicles.addVehicle(req.body.custDetails, vehicleSchedule, newCustomerId.insertId, req.body);
                    // if(vehicleAddRes.status.success==true){
                    //     const addSchedule = await Customers.addSchedule(req.body);  
                    // }
                    res.status(200).json(vehicleAddRes);
                }
            } else {
                console.log('customer or vehcile already exist', isExistCust, isExistVehicle)
                let result = { customers: [], vehicles: [] };
                result.customers = isExistCust;
                result.vehicles = isExistVehicle;
                res.status(200).json({ status: false, result: result });
            }
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }

    public editCustomer = async (req: Request, res: Response) => {
        try {
            // const isExistCust = await Customers.checkCustomer(req.body);
            // if (isExistCust.length == 0) {

            const Customer = await Customers.editCustomer(req.body.cust_id, req.body.custDetails);
            // console.log('inserted customer_id', newCustomerId.insertId)
            if (Customer) {
                if (req.body.addedVehicles.length > 0) {
                    const vehicleSchedule = req.body.addedVehicles
                    // const isExistCust = await Customers.checkCustomer(req.body);
                    const isExistVehicle = await Vehicles.checkVehicle(vehicleSchedule);
                    if (isExistVehicle.length == 0) {

                        // if (newCustomerId.insertId != undefined) {
                        var vehicleAddRes = await Vehicles.addVehicle(req.body.custDetails, vehicleSchedule, req.body.cust_id, req.body);
                        // if(vehicleAddRes.status.success==true){
                        // const addSchedule = await Customers.addSchedule(req.body); 
                        // }
                        // res.status(200).json(vehicleAddRes);
                        // }
                    } else {
                        console.log('vehcile already exist', isExistVehicle)
                        let result = { vehicles: [] };
                        result.vehicles = isExistVehicle;
                        res.status(200).json({ status: false, result: result });
                    }
                }
                let isEditVehicle = {};
                if (req.body.editedVehicles.length > 0) {
                    try {
                        isEditVehicle = await Vehicles.editVehicle(req.body.editedVehicles, req.body.cust_id, req.body.custDetails);
                    } catch (err) {
                        res.status(200).json({ status: false, result: { isEditVehicle: false, isRemoveVehicle: false } });
                        return;
                    }

                    // if(isExistVehicle.status){
                    // await Vehicles.editVehicle(req.body.editedVehicles,req.body.cust_id);
                    // }
                }
                if (req.body.removedvehicles.length > 0) {
                    var isRemoveVehicle = await Vehicles.removeVehicle(req.body.removedvehicles, req.body.cust_id, req.body.custDetails);
                }
                // if (isEditVehicle||isRemoveVehicle) {
                res.status(200).json({ status: true, result: { isEditVehicle, isRemoveVehicle } });
                // }
            }

            // } else {
            // console.log('Customer mobile number or already exist', isExistCust)
            // let result = { customer: [] };
            // result.customer = isExistCust;
            // res.status(200).json({ status: false, result: result });
            // }

        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }

    public getCustomers = async (req: Request, res: Response) => {
        try {
            const customerList = await Customers.getCustomers();
            res.status(200).json(customerList);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }

    public getWorkDetails = async (req: Request, res: Response) => {
        try {
            const customerList = await Customers.getWorkDetails(req.body);
            res.status(200).json(customerList);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    //add new building
    public addBuilding = async (req: Request, res: Response) => {
        let data = {
            'name': req.body.name,
            'location_id': req.body.location_id,
        }
        try {
            const addBuilding = await Buildings.addNewBuilding(data);
            res.status(200).json(addBuilding);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    //edit building
    public editBuilding = async (req: Request, res: Response) => {
        let data = {
            'name': req.body.name,
            'location_id': req.body.location_id,

        }
        try {
            const editBuilding = await Buildings.editBuilding(data, req.body.id);
            res.status(200).json(editBuilding);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }

    }
    // get workers
    public getWorkers = async (req: Request, res: Response) => {
        try {
            const buildingsList = await Workers.getAllWorkers();
            res.status(200).json(buildingsList);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    // get Edit Buildings
    //  public getEditBuildings = async (req: Request, res: Response) => {
    //     try {
    //         const editBuildingsList = await Workers.getEditBuildings();
    //         res.status(200).json(editBuildingsList);
    //     }
    //     catch (error) {
    //         log.error(error);
    //         res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //     }
    // }
    //add new worker
    public addWoker = async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const addNewWorker = await Workers.addNewWorker(data);
            res.status(200).json(addNewWorker);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    //edit worker
    public editWorker = async (req: Request, res: Response) => {
        // let data = {
        //     'name': req.body.name,
        //     'mobile': req.body.mobile,
        //     'building_ids':req.body.building_ids,
        //     'end_date':req.body.end_date,
        //     'user_name':req.body.user_name,
        //     'worker_building_ids':req.body.worker_building_ids,
        // }
        try {
            let editWorkerStatus = [];
            for (let Data of req.body) {
                const editWorker = await Workers.editWorker(Data, Data.id);
                editWorkerStatus.push(editWorker);
            }
            res.status(200).json(editWorkerStatus);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    // delete building
    public deleteBuilding = async (req: Request, res: Response) => {
        let id = req.body.id
        let user_name = req.body.user_name
        try {
            const deleteBuilding = await Buildings.deleteBuilding(id, user_name);
            res.status(200).json(deleteBuilding);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    //delete worker
    public deleteWorker = async (req: Request, res: Response) => {
        let id = req.body.id
        let user_name = req.body.user_name
        try {
            const deleteWorker = await Workers.deleteWorker(id, user_name);
            res.status(200).json(deleteWorker);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    //delete customer
    public deleteCustomer = async (req: Request, res: Response) => {
        let id = req.body.id
        let user_name = req.body.user_name
        try {
            const deleteCustomer = await Customers.deleteCustomer(id, user_name);
            res.status(200).json(deleteCustomer);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    //activate customer
    public activateCustomer = async (req: Request, res: Response) => {
        let id = req.body.id
        let user_name = req.body.user_name
        let activateDate = req.body.activateDate
        try {
            const activateCustomer = await Customers.activateCustomer(id, user_name, activateDate);
            res.status(200).json(activateCustomer);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    //activate worker
    public activateWorker = async (req: Request, res: Response) => {
        let id = req.body.id
        let user_name = req.body.user_name

        try {
            const activateWorker = await Workers.activateWorker(id);
            res.status(200).json(activateWorker);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }

    //getUsers
    public getUsers = async (req: Request, res: Response) => {
        try {
            const usersList = await Users.getUsers();
            res.status(200).json(usersList);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }

    //deleteUser
    public deleteUser = async (req: Request, res: Response) => {

        let data = {
            'id': req.body.id,
            'user_name': req.body.user_name
        }

        try {
            const deleteUser = await Users.deleteUser(data);
            res.status(200).json(deleteUser);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
    // getScheduleListByUserId
    public getScheduleListByUserId = async (req: Request, res: Response) => {
        let id = req.body.user_id;

        try {
            const getScheduleListByUserId = await Users.getScheduleListByUserId(id);
            res.status(200).json(getScheduleListByUserId);
        }
        catch (error) {
            log.error(error);
            res.status(500).json(ErrorResponse.GOOGLE_ERROR);
        }
    }
}
    //         this.router.post('/getAllDepartments', this.getDepartment);
    //         this.router.get('/getAllZones', this.getZones);
    //         this.router.get('/getAllCircles', this.getCircles);
    //         this.router.post('/editZone', this.editZone);
    //         this.router.post('/addZone', this.addZone);
    //         this.router.post('/editCircle', this.editCircle);
    //         this.router.get('/getAllOrganizations', this.getOrganization);
    //         this.router.post('/getUsersList', this.getUsersList);
    //         this.router.get('/getAllRoles', this.getRole);
    //         this.router.post('/getCirclebyId', this.getCircleById);
    //         this.router.post('/getDesignationByDepartmentID', this.getDesignationByDepartmentID);
    //         this.router.post('/getDesignationNameByDepartmentID', this.getDesignationNameByDepartmentID);
    //         this.router.post('/getGroupByDepId', this.getGroupByDepId);

    //         this.router.post('/addUser', this.addUser);
    //         this.router.post('/validateAddPayroll', this.validateAddPayroll);
    //         this.router.post('/editUser', this.editUser);
    //         this.router.post('/editDesignation', this.editDesignation);

    //         // this.router.get('/getAllwages', this.getWages);
    //         this.router.get('/getAllPayRollRunLog', this.getPayRollRunLog);
    //         // this.router.get('/getAllPayRollRunMaxYear', this.getPayRollRunMaxYear);

    //         this.router.get('/getAllGeneratedStatements', this.getGeneratedStatements);

    //         this.router.post('/addCircle', this.addCircle);
    //         this.router.post('/deleteCircle', this.deleteCircle);
    //         this.router.post('/deleteZone', this.deleteZone);
    //         this.router.post('/deleteDepartment', this.deleteDepartment);
    //         this.router.post('/deleteOrganization', this.deleteOrganization);

    //         this.router.post('/deleteUser', this.deleteUser);
    //         this.router.post('/deleteDesignation', this.deleteDesignation);
    //         this.router.get('/getAllDesignations', this.getDesignations);

    //         this.router.post('/addDesignation', this.addDesignation);
    //         this.router.post('/editDepartment', this.editDepartment);
    //         this.router.post('/addDepartment', this.addDepartment);

    //         this.router.post('/addOrganization', this.addOrganization);
    //         this.router.post('/updateOrganization', this.updateOrganization);


    //         this.router.post('/addDZC', this.addDZC);
    //         this.router.post('/updateDZC', this.updateDZC);
    //         this.router.post('/getDZC', this.getDZC);
    //         this.router.post('/downloadPFandESI', this.downloadPFandESI);

    //         this.router.post('/payRollRun', this.payRollRun);
    //         this.router.post('/cancelPayRoll', this.cancelPayRoll);
    //         this.router.get('/getDocumentsProcessList', this.getDocumentsProcessList);
    //         this.router.post('/deleteDocument', this.deleteDocument);


    //     }

    //     //UPDATE DZC
    //     public updateDZC = async (req: Request, res: Response) => {
    //         try {
    //             const DepartmentName = await DepartmentZoneCircle.getDepartmentNameById(req.body.department_id);
    //             const ZoneName = await DepartmentZoneCircle.getZoneNameById(req.body.zone_id);
    //             const CircleName = await DepartmentZoneCircle.getCircleNameById(req.body.circle_id);
    //             const dzcDescription = DepartmentName + "," + ZoneName + "," + CircleName;
    //             const addDZCResponse = await DepartmentZoneCircle.updateDZC(req.body.dzc_id, req.body.department_id, req.body.zone_id, req.body.circle_id, dzcDescription);
    //             res.status(200).json(addDZCResponse);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     //UPDATE Organization
    //     public updateOrganization = async (req: Request, res: Response) => {
    //         let data = {
    //             'org_id': req.body.org_id,
    //             'org_name': req.body.org_name
    //         }
    //         try {

    //             const updateOrganizationResponse = await Organization.updateOrganization(data);
    //             res.status(200).json(updateOrganizationResponse);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }

    //     //ADD DZC
    //     public addDZC = async (req: Request, res: Response) => {
    //         try {
    //             const DepartmentName = await DepartmentZoneCircle.getDepartmentNameById(req.body.department_id);
    //             if (req.body.zone_id != null) {
    //                 var ZoneName = await DepartmentZoneCircle.getZoneNameById(req.body.zone_id);
    //             } else {
    //                 ZoneName = '';
    //             }
    //             if (req.body.circle_id != null) {
    //                 var CircleName = await DepartmentZoneCircle.getCircleNameById(req.body.circle_id);
    //             } else {
    //                 CircleName = '';
    //             }
    //             const dzcDescription = DepartmentName + "," + ZoneName + "," + CircleName;
    //             const addDZCResponse = await DepartmentZoneCircle.insertIntoDZC(req.body.department_id, req.body.zone_id, req.body.circle_id, dzcDescription);
    //             res.status(200).json(addDZCResponse);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     //Validate Add Payroll
    //     public validateAddPayroll = async (req: Request, res: Response) => {
    //         try {

    //             const validateAddpayrollResponse = await AddRunPayRoll.validateAddPayroll(req.body.month, req.body.year, req.body.department_id);
    //             // let NotUploaded = validateAddpayrollResponse.filter((data: any) => data.Upload_Status == 'Not Uploaded')
    //             // if (NotUploaded.length == 0) {



    //             // } else if (NotUploaded.length > 0) {
    //             res.status(200).json(validateAddpayrollResponse);
    //             // }

    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     //Add User
    //     public addUser = async (req: Request, res: Response) => {
    //         try {
    //             const addUserResponse = await User.insertUser(req.body.name, req.body.email, req.body.phone, req.body.password, req.body.role_id, req.body.org_id);
    //             res.status(200).json(addUserResponse);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     //ADD ORGANIZATION
    //     public addOrganization = async (req: Request, res: Response) => {
    //         let data = {

    //             'name': req.body.org_name
    //         }
    //         try {
    //             const addZone = await Organization.insertIntoOrganization(data);
    //             res.status(200).json(addZone);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }

    //     public payRollRun = async (req: Request, res: Response) => {
    //         try {
    //             // const checkPayRollLog = await AddRunPayRoll.checkLogs(req.body)
    //             // if (checkPayRollLog.status && checkPayRollLog.result.length > 0) {
    //             //     res.status(200).json(checkPayRollLog);
    //             // } else {
    //                 for (let i in req.body.dzc_Ids) {
    //                     let dzc_id=req.body.dzc_Ids[i];
    //                     const writePayRollLog = await AddRunPayRoll.writeLogs(req.body,dzc_id)
    //                     if (writePayRollLog.status) {
    //                         const payRollRun = await AddRunPayRoll.runPayRoll(req.body, writePayRollLog.result.insertId,dzc_id);
    //                         var payRollResult=[];
    //                         payRollResult.push(payRollRun);
    //                     }
    //                 }
    //                 res.status(200).json(payRollResult);
    //             // }
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     //Get DZC
    //     public getDZC = async (req: Request, res: Response) => {
    //         try {
    //             const DZCList = await DepartmentZoneCircle.getAllDZCList(req.body.org_id, req.body.role);
    //             res.status(200).json(DZCList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }

    //     //Get Departments
    //     public getDepartment = async (req: Request, res: Response) => {
    //         try {
    //             const departmentsList = await Departments.getDepartment(req.body.role, req.body.org_id);
    //             res.status(200).json(departmentsList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     //get RunWages
    //     // public getWages= async (req: Request, res: Response) => {
    //     //     try {
    //     //         const getWagesList = await Wages.getWages();
    //     //         res.status(200).json(getWagesList);
    //     //     }
    //     //     catch (error) {
    //     //         log.error(error);
    //     //         res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //     //     }
    //     // }
    //     // get PayRoll_run_log
    //     public getPayRollRunLog = async (req: Request, res: Response) => {
    //         try {
    //             const getPayRollList = await PayRollRunLog.getPayRollRunLog();
    //             res.status(200).json(getPayRollList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public getGeneratedStatements = async (req: Request, res: Response) => {
    //         try {
    //             const getGeneratedStatements = await GenerateStatement.getGenerateStatements();
    //             res.status(200).json(getGeneratedStatements);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     //cancel payroll 
    //     public cancelPayRoll = async (req: Request, res: Response) => {
    //         try {
    //             const cancelPayRoll = await PayRollRunLog.CancelPayRoll(req.body.id);
    //             res.status(200).json(cancelPayRoll);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     // get PayRoll_run_Distinct_year
    //     // public getPayRollRunMaxYear= async (req: Request, res: Response) => {
    //     //     try {
    //     //         const getPayRollRunMaxYear = await PayRollRunLog.getPayRollRunMaxYear();
    //     //         res.status(200).json(getPayRollRunMaxYear);
    //     //     }
    //     //     catch (error) {
    //     //         log.error(error);
    //     //         res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //     //     }
    //     // }

    //     //Get Zones
    //     public getZones = async (req: Request, res: Response) => {
    //         // console.log(req.body)
    //         // let data = {
    //         //     'role': req.body.role,
    //         //     'org_id': req.body.org_id
    //         // }
    //         try {
    //             const zonesList = await Zones.getZones();
    //             res.status(200).json(zonesList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     //Get Designations
    //     public getDesignations = async (req: Request, res: Response) => {

    //         try {
    //             const designationsList = await Designation.getDesignationsList(req.body.role, req.body.org_id);
    //             res.status(200).json(designationsList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }

    //     //Get Organization
    //     public getOrganization = async (req: Request, res: Response) => {
    //         try {
    //             const organizationList = await Organization.getOrganization();
    //             res.status(200).json(organizationList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     //Get Users List
    //     public getUsersList = async (req: Request, res: Response) => {
    //         try {
    //             const UsersList = await User.getUsersList(req.body.role, req.body.org_id);
    //             res.status(200).json(UsersList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }

    //     //Get Role 
    //     public getRole = async (req: Request, res: Response) => {
    //         try {
    //             const roleList = await Role.getRole();
    //             res.status(200).json(roleList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }



    //     //Get circles
    //     public getCircles = async (req: Request, res: Response) => {
    //         // let data = {
    //         //     'role': req.body.role,
    //         //     'org_id': req.body.org_id
    //         // }
    //         try {
    //             const circlesList = await Circles.getCircles();
    //             res.status(200).json(circlesList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }

    //     //Get Designation
    //     public getDesignationByDepartmentID = async (req: Request, res: Response) => {
    //         try {
    //             const designationList = await Designation.getDesignationByDepartmentID(req.body.department_id);
    //             res.status(200).json(designationList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public getGroupByDepId = async (req: Request, res: Response) => {
    //         try {
    //             const List = await Group.getGroupByDepId(req.body.department_id);
    //             res.status(200).json(List);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(error);
    //         }
    //     }
    //     //Get Designation Name
    //     public getDesignationNameByDepartmentID = async (req: Request, res: Response) => {
    //         try {
    //             const designationName = await Designation.getDesignationNameByDepartmentID(req.body.designation_id);
    //             res.status(200).json(designationName);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }

    //     public editZone = async (req: Request, res: Response) => {
    //         let data = {
    //             'name': req.body.name,
    //             'id': req.body.id
    //         }
    //         try {
    //             const editZone = await Zones.editZone(data);
    //             res.status(200).json(editZone);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }

    //     public addZone = async (req: Request, res: Response) => {
    //         let data = {
    //             'name': req.body.name,
    //             // 'org_id': req.body.org_id
    //         }
    //         try {
    //             const addZone = await Zones.addZone(data);
    //             res.status(200).json(addZone);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public getCircleById = async (req: Request, res: Response) => {
    //         let id: number = req.body.id;

    //         try {
    //             const circle = await Circles.getCirclebyId(id);
    //             res.status(200).json(circle);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public editCircle = async (req: Request, res: Response) => {
    //         let data = {
    //             'name': req.body.name,
    //             'description': req.body.description,
    //             'id': req.body.id
    //         }
    //         try {
    //             const editCircle = await Circles.editCircle(data);
    //             res.status(200).json(editCircle);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public addCircle = async (req: Request, res: Response) => {
    //         let data = {
    //             'name': req.body.name,
    //             'description': req.body.description,
    //             // 'org_id': req.body.organization
    //         }
    //         try {
    //             const addCircle = await Circles.addCircle(data);
    //             res.status(200).json(addCircle);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public deleteCircle = async (req: Request, res: Response) => {
    //         let id = req.body.id
    //         try {
    //             const deleteCircle = await Circles.deleteCircle(id);
    //             res.status(200).json(deleteCircle);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public deleteOrganization = async (req: Request, res: Response) => {
    //         let id = req.body.id

    //         try {
    //             const deleteOrganization = await Organization.deleteOrganization(id);
    //             res.status(200).json(deleteOrganization);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public deleteUser = async (req: Request, res: Response) => {
    //         let id = req.body.id

    //         try {
    //             const deleteUser = await User.deleteUser(id);
    //             res.status(200).json(deleteUser);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public deleteDesignation = async (req: Request, res: Response) => {
    //         let id = req.body.id.id

    //         try {
    //             const deleteDesignation = await Designation.deleteDesignation(id);
    //             res.status(200).json(deleteDesignation);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public deleteZone = async (req: Request, res: Response) => {
    //         let id = req.body.id
    //         try {
    //             const deleteZone = await Zones.deleteZone(id);
    //             res.status(200).json(deleteZone);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public deleteDepartment = async (req: Request, res: Response) => {
    //         let id = req.body.id
    //         try {
    //             const deleteDepartment = await Departments.deleteDepartment(id);
    //             res.status(200).json(deleteDepartment);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public addDesignation = async (req: Request, res: Response) => {
    //         let data = {
    //             'name': req.body.name,
    //             'department_id': req.body.department_id,
    //             'salary': req.body.salary
    //         }
    //         try {
    //             const addDesignation = await Designation.addDesignation(data);
    //             res.status(200).json(addDesignation);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public editDepartment = async (req: Request, res: Response) => {
    //         let data = {
    //             'name': req.body.name,
    //             'id': req.body.id
    //         }
    //         try {
    //             const editDepartment = await Departments.editDepartment(data);
    //             res.status(200).json(editDepartment);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public editUser = async (req: Request, res: Response) => {
    //         // const data = {
    //         //     'id': req.body.id,
    //         //     'user_name': req.body.user_name,
    //         //     "email":req.body.email,
    //         //     "phone":req.body.phone,
    //         //     "password":req.body.password,
    //         //     "role_id":req.body.role_id,
    //         //     "org_id":req.body.organization_id

    //         // }
    //         try {
    //             const editUser = await User.editUser(req.body.id, req.body.user_name, req.body.email, req.body.phone, req.body.password, req.body.role_id, req.body.org_id);
    //             res.status(200).json(editUser);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public editDesignation = async (req: Request, res: Response) => {
    //         let data = {
    //             id: req.body.id,
    //             name: req.body.name,
    //             department_id: req.body.department_id,
    //             salary:req.body.salary
    //         }

    //         try {
    //             const editDesignation = await Designation.editDesignation(data);
    //             res.status(200).json(editDesignation);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }


    //     public addDepartment = async (req: Request, res: Response) => {
    //         let data = {
    //             'name': req.body.name,
    //             'org_id': req.body.organization_id
    //         }
    //         try {
    //             const addDepartment = await Departments.addDepartment(data);
    //             res.status(200).json(addDepartment);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }

    //     public downloadPFandESI = async (req: Request, res: Response) => {

    //         let id = req.body.pay_roll_run_id;
    //         try {
    //             const downloadPFandESIstatus = await Wages.downloadPFandESI(id);
    //             res.status(200).json(downloadPFandESIstatus);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public getDocumentsProcessList = async (req: Request, res: Response) => {

    //         try {
    //             const documentsProcessList = await DocumentsProcess.getAllDocumentProcess();
    //             res.status(200).json(documentsProcessList);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }
    //     public deleteDocument = async (req: Request, res: Response) => {
    //         let id = req.body.id
    //         try {
    //             const deleteDocument = await DocumentsProcess.deleteDocument(id);
    //             res.status(200).json(deleteDocument);
    //         }
    //         catch (error) {
    //             log.error(error);
    //             res.status(500).json(ErrorResponse.GOOGLE_ERROR);
    //         }
    //     }



    // }





