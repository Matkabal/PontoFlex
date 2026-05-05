import { endOfDay, startOfDay } from "date-fns";
import { db } from "../db/db";

function toDateTimeISO(baseDate, hhmm) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const next = new Date(baseDate);
  next.setHours(hours, minutes, 0, 0);
  return next.toISOString();
}

export function usePunchActions(reload) {
  const replaceTodayFromPoints = async (points) => {
    const today = new Date();
    const start = startOfDay(today).toISOString();
    const end = endOfDay(today).toISOString();

    const sorted = [...points].sort((a, b) => a.time.localeCompare(b.time));

    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i].time === sorted[i - 1].time) {
        throw new Error("Existem horários duplicados. Ajuste antes de salvar.");
      }
    }

    const currentSessions = await db.sessions.where("start").between(start, end, true, true).toArray();

    await db.transaction("rw", db.sessions, async () => {
      await Promise.all(currentSessions.map((session) => db.sessions.delete(session.id)));

      for (let i = 0; i < sorted.length; i += 2) {
        const startPoint = sorted[i];
        const endPoint = sorted[i + 1];

        await db.sessions.add({
          start: toDateTimeISO(today, startPoint.time),
          end: endPoint ? toDateTimeISO(today, endPoint.time) : null
        });
      }
    });

    await reload();
  };

  return { replaceTodayFromPoints };
}
