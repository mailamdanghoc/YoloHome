/** Quick declaration for params
 */

interface rollback {
    day?: number,
    month?: number,
    year?: number
}

/** Function to get date format as YYYY-MM-DD 
 *  * Params: {day: number | undefined, month: number | undefined, year: number | undefined} | undefined 
 *  * Return: string (format date)
 * 
 *  Is currently being used as Strategy for function customGetTime
 */

const getDateFormatYMD = (rollback? : rollback): string => {
    let timeShift: number = 0;
    if(rollback) {
        timeShift += rollback.day ? rollback.day * 24 * 60 * 60 * 1000 : 0;
        timeShift += rollback.month ? rollback.month * 30 * 24 * 60 * 60 * 1000: 0;
        timeShift += rollback.year ? rollback.year * 365 * 24 * 60 * 60 * 1000: 0;
    }
    const d: Date = new Date(Date.now() - timeShift);
    let month: string = '' + (d.getMonth() + 1),
        day: string = '' + d.getDate(),
        year: string ='' + d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

/** Customized function to get day by now, 7 days ago, 1 month ago and 1 year ago
 *  * Params: function: type ({day: number | undefined, month: number | undefined, year: number | undefined} | undefined) => string
 *  * Return: object {now: string, last7Days: string, lastMonth: string, lastYear: string}
 */

const customGetTime = (f:(rollback?: rollback) => string): {
    now: string,
    last7Days: string,
    lastMonth: string,
    lastYear: string
} => {return {
    now: f(),
    last7Days: f({day: 7}),
    lastMonth: f({month: 1}),
    lastYear: f({year: 1})
}}

export {customGetTime, getDateFormatYMD};