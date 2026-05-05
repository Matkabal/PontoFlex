import { format } from "date-fns";

export function formatMinutesToHHMM(totalMinutes) {
  const sign = totalMinutes < 0 ? "-" : "+";
  const abs = Math.abs(totalMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatWorkedMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function minutesBetween(startISO, endISO) {
  if (!startISO || !endISO) return 0;
  const diffMs = new Date(endISO).getTime() - new Date(startISO).getTime();
  return diffMs > 0 ? Math.floor(diffMs / 60000) : 0;
}

export function formatDateTime(iso) {
  return format(new Date(iso), "HH:mm");
}
