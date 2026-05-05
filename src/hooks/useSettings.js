import { useEffect, useState } from "react";
import { db, ensureDefaultSettings, getDefaultSettings } from "../db/db";

const defaultSettings = getDefaultSettings();

export function useSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [holidays, setHolidays] = useState([]);

  const load = async () => {
    await ensureDefaultSettings();
    const saved = await db.settings.get("main");
    setSettings(saved || defaultSettings);
    const holidayRows = await db.holidays.orderBy("date").toArray();
    setHolidays(holidayRows);
  };

  useEffect(() => {
    load();
  }, []);

  const saveSettings = async (next) => {
    const weeklyMinutes = next.weeklyMinutes || settings.weeklyMinutes || defaultSettings.weeklyMinutes;
    const workDays = Object.entries(weeklyMinutes)
      .filter(([, value]) => Number(value) > 0)
      .map(([day]) => Number(day));

    const payload = {
      ...settings,
      ...next,
      id: "main",
      weeklyMinutes,
      workDays,
      dailyMinutes: Number(weeklyMinutes[1] || settings.dailyMinutes || 480)
    };

    await db.settings.put(payload);
    setSettings(payload);
  };

  const addHoliday = async (holiday) => {
    await db.holidays.add(holiday);
    await load();
  };

  const deleteHoliday = async (id) => {
    await db.holidays.delete(id);
    await load();
  };

  return { settings, holidays, saveSettings, addHoliday, deleteHoliday, reloadSettings: load };
}
