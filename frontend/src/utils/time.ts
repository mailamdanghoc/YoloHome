import {format, parse, eachDayOfInterval, eachMonthOfInterval} from "date-fns";
import { chartData } from "../components/controlBoard/controlBoardChart";
 
// Heavily depend on date-fns

class timeUtils {
    // Format needed for display. Other than that, just for syncing the function
    private useFormat: string;
    private useMonthFormat: string;

    public constructor() {
        this.useFormat = "";
        this.useMonthFormat = "";
    }

    public setFormat = (newFormat: string): void => {
        this.useFormat = newFormat;
    }

    public setMonthFormat = (newFormat: string): void => {
        this.useMonthFormat = newFormat;
    }

    /** Customized function to get day by now, 7 days ago, 1 month ago and 1 year ago
     */

    public customGetTime = (): {
        now: string,
        last7Days: string,
        lastMonth: string,
        lastYear: string
    } => {return {
        now: format(Date.now(), this.useFormat),
        last7Days: format(Date.now() - 7 * 24 * 60 * 60 * 1000, this.useFormat),
        lastMonth: format(Date.now() - 30 * 24 * 60 * 60 * 1000, this.useFormat),
        lastYear: format(Date.now() - 365 * 24 * 60 * 60 * 1000, this.useFormat)
    }}

    /** Function use to fill empty date or month in an array of object with value 0
     */

    public fillMissingArray = (arr: chartData [],  startDate: string, endDate: string, type: "day" | "month"): chartData [] => {
        const interval: {start: Date, end: Date} = {
            start:  parse(startDate, this.useFormat, new Date()),
            end:  parse(endDate, this.useFormat, new Date())
        };

        const samplingArr: string [] = (type == "day" ? eachDayOfInterval(interval) : eachMonthOfInterval(interval))
        .map((obj: Date) => format(obj, type == "day" ? this.useFormat : this.useMonthFormat)).splice(1);
        
        return  samplingArr.map((date: string) => {
            const obj: chartData | undefined = arr.find(obj => obj.time == date)
            return obj ? obj : {sumValue: 0, time: date}
        })
    }

    public reFormat = (obj: chartData[] , newFormat: string): chartData[] => {
        return obj.map((ele: chartData): chartData =>  {return {sumValue: ele.sumValue / 3600, time: format(ele.time, newFormat)}});
    }

}

export const time = new timeUtils();