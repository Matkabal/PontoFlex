import { db } from "../db/db";

export async function ensureYearHolidays(year) {
  const normalizedYear = Number(year);
  if (!Number.isFinite(normalizedYear)) {
    throw new Error("Ano de feriado invalido.");
  }

  const existingCount = await db.holidays.where("year").equals(normalizedYear).count();
  if (existingCount > 0) {
    return { loaded: false, reason: "cache" };
  }

  const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${normalizedYear}`);
  if (!response.ok) {
    throw new Error("Falha ao sincronizar feriados da API.");
  }

  const payload = await response.json();
  const rows = payload
    .filter((item) => item?.date && item?.name)
    .map((item) => ({
      date: item.date,
      name: item.name,
      year: normalizedYear,
      source: "api"
    }));

  if (rows.length > 0) {
    await db.holidays.bulkAdd(rows);
  }

  await db.holidaySync.put({ year: normalizedYear, syncedAt: new Date().toISOString() });
  return { loaded: true, reason: "network" };
}
