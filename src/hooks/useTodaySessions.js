import { useEffect, useState } from "react";
import { endOfDay, startOfDay } from "date-fns";
import { db } from "../db/db";

export function useTodaySessions() {
  const [sessions, setSessions] = useState([]);

  const reload = async () => {
    const start = startOfDay(new Date()).toISOString();
    const end = endOfDay(new Date()).toISOString();
    const rows = await db.sessions.where("start").between(start, end, true, true).toArray();
    rows.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    setSessions(rows);
  };

  useEffect(() => {
    reload();
  }, []);

  const openSession = sessions.find((item) => !item.end) || null;

  return { sessions, openSession, reloadToday: reload };
}
