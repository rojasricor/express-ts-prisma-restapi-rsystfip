import { IPeople } from "./IPeople";
import { IScheduleData } from "./IScheduleData";

export interface ICalendar {
  id: IScheduleData["person_id"];
  title: IPeople["name"];
  start: IScheduleData["start_date"];
  end: IScheduleData["end_date"];
  color: IScheduleData["color"];
}
