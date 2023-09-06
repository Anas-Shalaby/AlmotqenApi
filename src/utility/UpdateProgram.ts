import nodeSchedule from "node-schedule";
import { CronJob } from "cron";
export const IsProgramPassedDay = (isCompleted: boolean) => {
  if (isCompleted == true) {
    new CronJob("00 00 12 * * 0-6", () => {
      return true;
    });
  }
  return false;
};
