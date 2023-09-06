import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { ValidateSignature } from "../utility";
import { Program } from "../models";
import { FindStudent } from "../controllers";
import { StudentPayload } from "../dto";
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authinticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await ValidateSignature(req);

  if (validate) {
    next();
  } else {
    return res.json({ message: "User is not Authorized" });
  }
};
