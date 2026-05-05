import { getDay } from "date-fns";

export function isHoliday(dateISO, holidays) {
  return holidays.some((item) => item.date === dateISO);
}

export function expectedMinutesForDate(date, settings, holidays) {
  const dateISO = date.toISOString().slice(0, 10);
  if (isHoliday(dateISO, holidays)) return 0;

  const day = getDay(date);
  const weekly = settings.weeklyMinutes || {};
  const expected = Number(weekly[day] || 0);
  return expected > 0 ? expected : 0;
}
