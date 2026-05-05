import { useEffect, useState } from "react";
import { db } from "../db/db";
import { listMonthDays, toISODate } from "../utils/calendar";
import { expectedMinutesForDate } from "../utils/rules";
import { minutesBetween } from "../utils/time";

export function useMonthlyReport(refDate, settings, holidays) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const run = async () => {
      const days = listMonthDays(refDate);
      const monthRows = [];

      for (const day of days) {
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999);

        const sessions = await db.sessions
          .where("start")
          .between(dayStart.toISOString(), dayEnd.toISOString(), true, true)
          .toArray();

        const workedMinutes = sessions.reduce((sum, session) => sum + minutesBetween(session.start, session.end), 0);
        const expectedMinutes = expectedMinutesForDate(day, settings, holidays);

        monthRows.push({
          date: toISODate(day),
          workedMinutes,
          expectedMinutes,
          balanceMinutes: workedMinutes - expectedMinutes
        });
      }

      setRows(monthRows);
    };

    run();
  }, [refDate, settings, holidays]);

  const totals = rows.reduce(
    (acc, item) => {
      acc.worked += item.workedMinutes;
      acc.expected += item.expectedMinutes;
      acc.balance += item.balanceMinutes;
      return acc;
    },
    { worked: 0, expected: 0, balance: 0 }
  );

  return { rows, totals };
}
