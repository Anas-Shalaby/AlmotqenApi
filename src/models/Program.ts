import mongoose, { Document, Schema, Model } from "mongoose";

interface ProgramDoc extends Document {
  name: string;
  time: number;
  status: string;
  narration: [string];
  readThePast: boolean;
  listenToSheihk: boolean;
  readTheMeaning: boolean;
  description: string;
  programImage: string;
  studentId: [string];
  isCompleted: boolean;
  surah: string;
  progress: number;
  repeatTheSurah: boolean;
}

const programSchema = new Schema(
  {
    studentId: { type: [String] },
    name: { type: String, required: true },
    time: { type: Number, required: true },
    status: { type: String, required: true },
    surah: { type: String, required: true },
    progress: { type: Number },
    readThePast: { type: Boolean, required: true },
    repeatTheSurah: { type: Boolean, required: true },
    listenToSheihk: { type: Boolean, required: true },
    readTheMeaning: { type: Boolean },
    programImage: { type: String },
    description: { type: String, required: true },
    narration: { type: [String], required: true },
    isCompleted: { type: Boolean, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Program = mongoose.model<ProgramDoc>("program", programSchema);

export { Program };
