import { MONGO_URI } from "../config";
import mongoose from "mongoose";

export default async () => {
  try {
    mongoose
      .connect(MONGO_URI)
      .then((result) => {
        console.log("DB connected");
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
};
