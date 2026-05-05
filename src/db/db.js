import Dexie from "dexie";

const defaultWeekly = { 0: 0, 1: 480, 2: 480, 3: 480, 4: 480, 5: 480, 6: 0 };

export const db = new Dexie("pontoflex");

db.version(1).stores({
  sessions: "++id,start,end",
  settings: "id,dailyMinutes",
  holidays: "++id,date,name"
});

export function getDefaultSettings() {
  return {
    id: "main",
    dailyMinutes: 480,
    workDays: [1, 2, 3, 4, 5],
    weeklyMinutes: { ...defaultWeekly }
  };
}

export async function ensureDefaultSettings() {
  const current = await db.settings.get("main");
  if (!current) {
    await db.settings.put(getDefaultSettings());
    return;
  }

  if (!current.weeklyMinutes) {
    const weeklyMinutes = { ...defaultWeekly };
    for (const day of current.workDays || [1, 2, 3, 4, 5]) {
      weeklyMinutes[day] = current.dailyMinutes || 480;
    }

    await db.settings.put({ ...current, weeklyMinutes });
  }
}
