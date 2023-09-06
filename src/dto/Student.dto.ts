import { IsEmail, Length, IsEmpty } from "class-validator";

export interface CreateStudentInput {
  name: string;
  email: string;
  status: string;
  address: string;
  phone: string;
  narration: string;
  profileImage: string;
  password: string;
  program: [string];
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  verified: boolean;
}

export interface StudentLoginInput {
  email: string;
  password: string;
}

export interface StudentPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export interface EditStudentInput {
  name: string;
  address: string;
  phone: string;
}

export class CreateStudentRegister {
  @IsEmail()
  email: string;

  @Length(11)
  phone: string;

  @Length(7)
  password: string;
}

export class StudentLoginInput {
  @IsEmail()
  email: string;

  @Length(7)
  password: string;
}

export class StudentUpateInput {
  @Length(3)
  name: string;

  @IsEmpty()
  address: string;

  @IsEmpty()
  narration: string;

  @Length(11)
  phone: string;

  @Length(10)
  program: string;
}
