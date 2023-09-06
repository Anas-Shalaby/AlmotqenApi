import { Stripe } from "stripe";
import { STRIPE_KEY } from "../config";
import { Request, Response, NextFunction } from "express";
import { FindStudent } from "./AdminController";

import { validate } from "class-validator";
import { v4 as uuidv4 } from "uuid";
import {
  CompleteProgram,
  CreateStudentInput,
  CreateStudentRegister,
  StudentLoginInput,
  StudentUpateInput,
} from "../dto";
import {
  GenerateOTP,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  OnRequestOTP,
  ValidatePassword,
} from "../utility";
import { Program, Student } from "../models";
import { classToPlain, instanceToPlain, plainToClass } from "class-transformer";
import { IsProgramPassedDay } from "../utility";
/**----------------------------------------------------- Login -----------------------------------------------------*/
export const StudentLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const LoginInputs = plainToClass(StudentLoginInput, req.body);

  const LoginErrors = await validate(LoginInputs, {
    validationError: { target: true },
  });

  if (LoginErrors.length > 0) {
    return res.status(400).json(LoginErrors);
  }

  const { email, password } = LoginInputs;

  const existingUser = await FindStudent("", email);

  if (existingUser !== null) {
    // validations and give access
    const validations = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt
    );

    if (validations) {
      const signature = GenerateSignature({
        _id: existingUser.id,
        email: existingUser.email,
        verified: existingUser.verified,
      });

      return res.json({
        email: existingUser.email,
        signature,
        verified: existingUser.verified,
      });
    } else {
      return res.status(404).json({ message: "Password is not valid" });
    }
  }

  return res.status(404).json({ message: "Login credientals are not valid" });
};

/**----------------------------------------------------- Profile -----------------------------------------------------*/

export const GetStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingUser = await FindStudent(user._id);

    return res.json(existingUser);
  }

  return res.json({ message: "Student information is not found" });
};

/**----------------------------------------------------- Update -----------------------------------------------------*/

export const UpdateStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const UpdateInput = classToPlain(StudentUpateInput, req.body);

  const InputErrors = await validate(UpdateInput, {
    validationError: { target: true },
  });

  if (InputErrors.length > 0) {
    return res.status(400).json(InputErrors);
  }

  const { name, address, phone, narration } = UpdateInput;

  const user = req.user;

  if (user) {
    const existingUser = await FindStudent(user._id);

    if (existingUser !== null) {
      existingUser.name = name;

      existingUser.phone = phone;

      existingUser.address = address;

      existingUser.narration = narration;

      const savedResults = await existingUser.save();

      return res.json(savedResults);
    }

    return res.json(existingUser);
  }

  return res.json({ message: "Student information is not found" });
};

/**----------------------------------------------------- Create / Signup -----------------------------------------------------*/

export const StudentRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const StudentInput = plainToClass(CreateStudentRegister, req.body);

  const InputErrors = await validate(StudentInput, {
    validationError: { target: true },
  });

  if (InputErrors.length > 0) {
    return res.status(400).json(InputErrors);
  }

  const { phone, status, narration, password, email, program, address, name } =
    <CreateStudentInput>req.body;

  const salt = await GenerateSalt();
  const studentPassword = await GeneratePassword(password, salt);
  const existingStudent = await FindStudent("", email);

  // generate otp

  const { otp, expiry } = GenerateOTP();

  if (existingStudent !== null) {
    return res
      .status(400)
      .json({ message: "A student is existing with this email" });
  }

  const result = await Student.create({
    name: name,
    email,
    password: studentPassword,
    salt,
    phone,
    address,
    status: status,
    narration,
    program,
    otp: otp,
    otp_expiry: expiry,
    lat: 0,
    lng: 0,
    verified: false,
    NumOfFails: 0,
    NumOfSuccess: 0,
  });

  if (result) {
    // send OTP to student

    await OnRequestOTP(otp, email);

    // generate a signature
    const signature = GenerateSignature({
      _id: result.id,
      email: result.email,
      verified: result.verified,
    });

    // send the result to the client
    return res.status(201).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }

  return res.status(400).json({ message: "Error with signup" });
};

/**----------------------------------------------------- Verify OTP -----------------------------------------------------*/

export const HandleVerifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const student = req.user;

  const { otp } = req.body;

  if (student) {
    const profile = await Student.findById(student._id);

    if (profile) {
      if (profile.otp == parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const result = await profile.save();

        const signature = GenerateSignature({
          _id: result._id,
          email: result.email,
          verified: result.verified,
        });

        return res
          .status(200)
          .json({ signature, email: result.email, verified: result.verified });
      }
    }
  }
  return res.status(400).json({ msg: "Unable to verify Customer" });
};

/**----------------------------------------------------- Choose Program -----------------------------------------------------*/

export const HandleStudentChooseProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { id } = req.body;

    const student = await FindStudent(user._id);

    const program = await Program.findById(id);
    if (student !== null) {
      if (program) {
        program.studentId = student._id;

        student.program.push(program);
        const result = await student.save();
        const programSaved = await program.save();
        return res.json({
          user: result,
          program: programSaved,
          msg: "تمت اضافة البرنامج بنجاح",
        });
      }
    }
  }

  return res.json({ message: "Something went wrong with creating program" });
};

/**----------------------------------------------------- Upload Image -----------------------------------------------------*/

export const HandleUpdateUserProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const student = await FindStudent(user._id);

    if (student !== null) {
      const file = req.file as Express.Multer.File;

      const image = file.filename;

      await Student.updateOne({ _id: student._id }, { profileImage: image });

      return res.json(student);
    }
  }
  return res.json({ message: "Something went worng with updating image" });
};

/**----------------------------------------------------- Complete Program -----------------------------------------------------*/

export const CompleteProgramByStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const student = req.user;

  if (student) {
    const program = await Program.findOne({ studentId: student._id });

    const profile = await Student.findById(student._id);

    if (program) {
      const CompeleteProgramInput = plainToClass(CompleteProgram, req.body);

      const CompleteProgramErrors = await validate(CompeleteProgramInput, {
        validationError: { target: true },
      });

      if (CompleteProgramErrors.length > 0) {
        return res.status(404).json(CompleteProgramErrors);
      }

      const { listenToSheihk, readTheMeaning, readThePast, repeatTheSurah } =
        CompeleteProgramInput;

      if (
        (listenToSheihk && readTheMeaning && readThePast && repeatTheSurah) ==
        true
      ) {
        program.isCompleted = true;
        program.listenToSheihk = true;
        program.readTheMeaning = true;
        program.readThePast = true;
        program.repeatTheSurah = true;
        program.progress += 5;
        profile.points += 5;
        profile.NumOfSuccess += 1;

        const result = await program.save();

        return res.status(200).json({
          isCompleted: result.isCompleted,
          name: result.name,
          msg: "تم تاكيد الرنامج بنجاح!",
        });
      } else {
        profile.NumOfFails += 1;
      }
    }
    return res.status(404).json({ message: "There is no program" });
  }

  return res.status(200).json({ message: "There is no student" });
};

/**----------------------------------------------------- Get Program -----------------------------------------------------*/
export const GetProgramForStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const student = req.user;

  if (student) {
    const profile = await Student.findById(student._id);

    if (profile) {
      const programForStudent = await Program.findOne({
        studentId: student._id,
      });

      return res.status(200).json(programForStudent);
    }
  }

  return res.status(400).json({ message: "Can't get program" });
};

/**----------------------------------------------------- Update Program -----------------------------------------------------*/

export const UpdateProgramEvery24Hours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const student = req.user;

  if (student) {
    const profile = await Student.findById(student._id);

    const program = await Program.findOne({ studentId: student._id });

    if (profile && program) {
      if (IsProgramPassedDay(program.isCompleted)) {
        program.isCompleted = false;
        program.listenToSheihk = false;
        program.readThePast = false;
        program.readTheMeaning = false;
        program.repeatTheSurah = false;
        program.surah = req.body.surah;

        const result = await profile.save();

        const programSaved = await program.save();
        return res.status(200).json({ user: result, program: programSaved });
      } else {
        return res.status(200).json({ program: program });
      }
    }
  }

  return res.status(400).json({ message: "Please login first" });
};

/**----------------------------------------------------- Payment -----------------------------------------------------*/

export const HandlePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const student = req.user;

  const { amount, authToken, card } = req.body;
  const { token } = authToken;
  // const { card } = token;

  const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2020-08-27" });

  if (student) {
    const profile = await Student.findById(student._id);

    if (profile) {
      const idempotencyKey = uuidv4();

      const customer = await stripe.customers.create({
        email: profile.email,
        // source: token.id,
      });

      const response = await stripe.charges.create(
        {
          amount: amount * 100,
          currency: "egy",
          customer: customer.id,
          receipt_email: profile.email,
        },
        { idempotencyKey: idempotencyKey }
      );

      return res.json(response);
    }
  }
};
