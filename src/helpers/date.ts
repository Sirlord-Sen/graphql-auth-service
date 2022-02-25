import ms from 'ms';
import {
    isDate,
    addMilliseconds,
    isSameDay as isSameDayFns,
    getUnixTime,
    format as formatDayFns,
} from 'date-fns';
  
  
export default (() => {
    const isSameDay = ( dateLeft?: Date | number, dateRight?: Date | number ): boolean => {
        if (dateLeft && dateRight) {
            return isSameDayFns(dateLeft, dateRight);
        }
  
        return false;
    };
  
    const format = (date: Date | number, formatString = 'yyyy-MM-dd') => {
        return formatDayFns(date, formatString);
    };
  
    const convertToMS = (input: string): number => ms(input);
  
    const addMillisecondToDate = ( input?: Date | number, amount?: number ): Date => {
        return addMilliseconds(
            input && isDate(input) ? input : new Date(),
            amount || 0,
        );
    };
  
    const getUnixTimeOfDate = (input?: Date | number): number => {
        return getUnixTime(input && isDate(input) ? input : new Date());
    };
  
    return {
        isSameDay,
        convertToMS,
        addMillisecondToDate,
        getUnixTimeOfDate,
        format,
    };
})();