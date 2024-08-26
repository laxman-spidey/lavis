import { Schema, model } from "mongoose";
import studentModel from "./student/student.model";

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: {
    type: Schema.Types.String,
    required: 'Email is required',
    index: true
  },
  phone: {
    type: Schema.Types.Number,
    index: true
    // required: 'Phone number is required'
  },
  password: {
    type: Schema.Types.String,
    // required:'Password is required'
  },
  role: {
      type: String,
      enum: ['student', 'admin', 'instructor', 'superadmin']
  },
  lastLoggedIn: {
    type: Schema.Types.String
  },
  session: {
      type: {
          token: String,
      }
  },
  google: {
    type: {
        id: String,
        token: String
    }
  },
  linkedIn: {
    type: {
        id: String,
        token: String
    }
  },
  socket: {
    type: Schema.Types.String
  }
});

export default model('user',userSchema);