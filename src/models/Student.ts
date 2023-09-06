import mongoose, { Document, Schema, Model } from "mongoose";

interface StudentDoc extends Document {
  name: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  status: string;
  narration: string;
  salt: string;
  profileImage: string;
  program: any;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  verified: boolean;
  points: number;
  NumOfFails: number;
  NumOfSuccess: number;
}

const studentSchema = new Schema(
  {
    name: { type: String },
    status: { type: String },
    email: { type: String, required: true },
    narration: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    NumOfFails: { type: Number, required: true },
    NumOfSuccess: { type: Number, required: true },
    points: { type: Number },
    password: { type: String, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number },
    verified: { type: Boolean, required: true },
    lng: { type: Number },
    salt: { type: String, required: true },
    profileImage: { type: String },

    program: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "program",
      },
    ],
  },
  {
    // to delete rows from res
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.otp;
        delete ret.otp_expiry;
      },
    },
    timestamps: true,
  }
);

const Student = mongoose.model<StudentDoc>("student", studentSchema);

export { Student };
