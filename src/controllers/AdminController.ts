import { Request, Response, NextFunction } from "express";
import { CreateProgramInput, CreateStudentInput } from "../dto";
import { Student, Program } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindStudent = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Student.findOne({ email: email });
  } else {
    return await Student.findById(id);
  }
};

export const FindProgram = async (id: string | undefined, name?: string) => {
  if (name) {
    return await Program.findOne({ name: name });
  } else {
    return await Program.findById(id);
  }
};

export const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, status, phone, address } = <
    CreateStudentInput
  >req.body;

  // generate salt and create password

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  // check email entered

  const exestingVandor = await FindStudent("", email);

  if (exestingVandor !== null) {
    return res.json({ message: "A vandor is existing with this email" });
  }

  const createVandor = await Student.create({
    name,
    email,
    password: userPassword,
    phone,
    address,
    salt: salt,
    status: status,
    profileImage: "",
    program: [],
  });

  return res.json(createVandor);
};

export const GetVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandors = await Student.find();

  if (vandors !== null) {
    return res.json(vandors);
  }

  return res.json({ message: "there is no vendors" });
};

export const GetVandorsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandorId = req.params.id;

  const vandor = await FindStudent(vandorId);

  if (vandor !== null) {
    return res.json(vandor);
  }

  return res.json({ message: "there is no students" });
};

export const CreateProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      time,
      name,
      status,
      listenToSheihk,
      readThePast,
      narration,
      description,
      surah,
      progress,
      isCompleted,
    } = <CreateProgramInput>req.body;

    const exestingProgram = await Program.findOne({ name });

    if (exestingProgram !== null) {
      return res.json({ message: "A program is existing with this name" });
    }

    // const file = req.file as Express.Multer.File;
    // const image = file.filename;

    const createdProgram = await Program.create({
      studentId: ["Created BY ADMIN"],
      time,
      name,
      status,
      listenToSheihk,
      readThePast,
      narration,
      description,
      surah,
      progress,
      isCompleted,
    });

    return res.json(createdProgram);
  } catch (error) {
    console.log(error);
  }
};

export const GetPrograms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const programs = await Program.find({});

  if (programs !== null) {
    return res.json(programs);
  }

  return res.json({ message: "There is no programs" });
};

export const UpdateStudent = async (req: Request, res: Response) => {
  const { email, name, narration, status } = <CreateStudentInput>req.body;

  const exestingStudent = await FindStudent("", email);

  if (exestingStudent !== null) {
    return res.status(400).json({ message: "Student not found" });
  }

  const updatedStudent = await Student.updateOne(
    { email: email },
    {
      email: email,
      name: name,
      narration: narration,
      status: status,
    }
  );

  return res.status(200).json(updatedStudent);
};
