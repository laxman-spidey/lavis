import { Schema } from "mongoose";

interface IAppointment {
  userId: string;
  doctorId: string;
  doctorInfo: string;
  userInfo: string;
  date: string;
  status: string;
  time: string;
}
//  appointment schema
const appointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorInfo: {
      type: String,
      required: true,
    },
    userInfo: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);
export type AppointmentSchema = typeof appointmentModel;

module.exports = appointmentModel;
