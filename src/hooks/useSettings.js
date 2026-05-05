import { useEffect, useState } from "react";
import { db, ensureDefaultSettings, getDefaultSettings } from "../db/db";
import { ensureYearHolidays } from "../utils/holidaySync";

const defaultSettings = getDefaultSettings();

export function useSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [holidays, setHolidays] = useState([]);
  const [holidaySyncStatus, setHolidaySyncStatus] = useState("idle");

  const load = async () => {
    await ensureDefaultSettings();

    const currentYear = new Date().getFullYear();
    const saved = await db.settings.get("main");
    setSettings(saved || defaultSettings);

    const yearRows = await db.holidays.where("year").equals(currentYear).sortBy("date");

    if (yearRows.length === 0) {
      try {
        setHolidaySyncStatus("syncing");
        await ensureYearHolidays(currentYear);
        setHolidaySyncStatus("ready");
      } catch {
        setHolidaySyncStatus("error");
      }
    } else {
      setHolidaySyncStatus("ready");
    }

    const refreshedRows = await db.holidays.where("year").equals(currentYear).sortBy("date");
    setHolidays(refreshedRows);
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
    await db.holidays.add({
      ...holiday,
      year: Number(String(holiday.date).slice(0, 4)),
      source: "manual"
    });
    await load();
  };

  const deleteHoliday = async (id) => {
    await db.holidays.delete(id);
    await load();
  };

  return {
    settings,
    holidays,
    holidaySyncStatus,
    saveSettings,
    addHoliday,
    deleteHoliday,
    reloadSettings: load
  };
}
