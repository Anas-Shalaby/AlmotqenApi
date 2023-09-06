import express, { Request, Response, NextFunction, request } from "express";

import {
  GetStudentProfile,
  UpdateStudentProfile,
  StudentLogin,
  StudentRegister,
  HandleStudentChooseProgram,
  HandleUpdateUserProfileImage,
  HandleVerifyOTP,
  CompleteProgramByStudent,
  UpdateProgramEvery24Hours,
  HandlePayment,
  GetProgramForStudent,
  // LinkProgramToStudent,
} from "../controllers";
import multer from "multer";

import { Authinticate } from "../middlewares";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images/profileImages");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const image = multer({ storage: storage }).single("profileImage");

const router = express.Router();

router.post("/login", StudentLogin);

router.post("/register", StudentRegister);

router.get("/otp");

router.use(Authinticate);
router.patch("/verify", HandleVerifyOTP);

router.get("/profile", GetStudentProfile);

router.patch("/profile", UpdateStudentProfile);

router.post("/chooseProgram", HandleStudentChooseProgram);

router.patch("/uploadImage", image, HandleUpdateUserProfileImage); // upload images when updating  profile

router.post("/completeProgram", CompleteProgramByStudent);

router.get("/home", UpdateProgramEvery24Hours);

router.post("/choose-shiehk");

router.post("/donations", HandlePayment);

router.get("/program", GetProgramForStudent);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("Hello from vandor route");
});

export { router as StudentRoute };
