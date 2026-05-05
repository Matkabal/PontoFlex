import { eachDayOfInterval, endOfMonth, format, isSameDay, startOfDay, startOfMonth } from "date-fns";

export function toISODate(date) {
  return format(date, "yyyy-MM-dd");
}

export function listMonthDays(refDate) {
  return eachDayOfInterval({
    start: startOfMonth(refDate),
    end: endOfMonth(refDate)
  });
}

export function isDateInDay(dateA, dateB) {
  return isSameDay(startOfDay(dateA), startOfDay(dateB));
}
