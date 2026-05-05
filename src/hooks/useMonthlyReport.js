import { useEffect, useMemo, useState } from "react";
import { isWeekend, parseISO } from "date-fns";
import { db } from "../db/db";
import { listMonthDays, toISODate } from "../utils/calendar";
import { expectedMinutesForDate } from "../utils/rules";
import { minutesBetween } from "../utils/time";

export function useMonthlyReport(refDate, settings, holidays, filters) {
  const [rows, setRows] = useState([]);
  const [reloadToken, setReloadToken] = useState(0);

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
          balanceMinutes: workedMinutes - expectedMinutes,
          sessions
        });
      }

      setRows(monthRows);
    };

    run();
  }, [refDate, settings, holidays, reloadToken]);

  const totals = useMemo(
    () => rows.reduce(
      (acc, item) => {
        acc.worked += item.workedMinutes;
        acc.expected += item.expectedMinutes;
        acc.balance += item.balanceMinutes;
        return acc;
      },
      { worked: 0, expected: 0, balance: 0 }
    ),
    [rows]
  );

  const workedVsExpectedSeries = useMemo(
    () => rows.map((row) => ({
      dia: row.date.slice(-2),
      data: row.date,
      trabalhadoHoras: Number((row.workedMinutes / 60).toFixed(2)),
      esperadoHoras: Number((row.expectedMinutes / 60).toFixed(2))
    })),
    [rows]
  );

  const dailyBalanceSeries = useMemo(
    () => rows.map((row) => ({
      dia: row.date.slice(-2),
      data: row.date,
      extraHoras: Number((row.balanceMinutes / 60).toFixed(2))
    })),
    [rows]
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const parsed = parseISO(row.date);
      const isHoliday = row.expectedMinutes === 0 && !isWeekend(parsed);
      if (!filters.showAllDays && row.workedMinutes <= 0 && row.sessions.length === 0) return false;
      if (!filters.includeWeekends && isWeekend(parsed)) return false;
      if (!filters.includeHolidays && isHoliday) return false;
      return true;
    });
  }, [rows, filters]);

  const reloadReport = () => setReloadToken((current) => current + 1);

  return { rows, filteredRows, totals, workedVsExpectedSeries, dailyBalanceSeries, reloadReport };
}
