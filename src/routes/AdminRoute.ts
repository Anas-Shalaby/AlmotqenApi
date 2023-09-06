import express, { Request, Response, NextFunction } from "express";
import {
  CreateProgram,
  CreateVandor,
  GetPrograms,
  GetVandors,
  GetVandorsById,
  UpdateStudent,
} from "../controllers";

import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

export const programImage = multer({ storage: imageStorage }).single(
  "programImage"
);

router.post("/student", CreateVandor);

router.get("/student", GetVandors);

router.get("/student/:id", GetVandorsById);

router.post("/program", CreateProgram);

router.get("/programs", GetPrograms);

router.patch("/updateSudent", UpdateStudent);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("Hello from admin route");
});

export { router as AdminRoute };
