import { initialize } from "passport";
import { UserService } from "../user/user.service";
import { Request, Response } from "express";
import { getNewRouter } from "src/common/router";

const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await UserService.getAllDoctors();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const AppointmentsController = {
  initialize: () => {
    const router = getNewRouter();
    router.get("/doctors", getAllDoctors);
    return router;
  },
};
