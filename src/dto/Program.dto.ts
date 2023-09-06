import { IsEmail, Length, IsEmpty, IsBoolean } from "class-validator";

export interface CreateProgramInput {
  name: string;
  narration: [string];
  status: string;
  listenToSheihk: boolean;
  readThePast: boolean;
  readTheMeaning: boolean;
  time: number;
  description: string;
  programImage: string;
  studentId: [string];
  surah: string;
  isCompleted: boolean;
  progress: number;
}

export interface UpdateProgramInfo {
  isCompleted: boolean;
}

export class CompleteProgram {
  @IsBoolean()
  readThePast: boolean;
  @IsBoolean()
  repeatTheSurah: boolean;

  @IsBoolean()
  listenToSheihk: boolean;

  @IsBoolean()
  readTheMeaning: boolean;
}
