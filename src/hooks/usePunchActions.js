import { endOfDay, startOfDay } from "date-fns";
import { db } from "../db/db";

function toDateTimeISO(baseDate, hhmm) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const next = new Date(baseDate);
  next.setHours(hours, minutes, 0, 0);
  return next.toISOString();
}

export function usePunchActions(reload) {
  const replacePointsByDate = async (baseDateInput, points) => {
    const baseDate = new Date(baseDateInput);
    const start = startOfDay(baseDate).toISOString();
    const end = endOfDay(baseDate).toISOString();

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
          start: toDateTimeISO(baseDate, startPoint.time),
          end: endPoint ? toDateTimeISO(baseDate, endPoint.time) : null
        });
      }
    });

    if (reload) {
      await reload();
    }
  };

  const replaceTodayFromPoints = async (points) => replacePointsByDate(new Date(), points);

  return { replaceTodayFromPoints, replacePointsByDate };
}
