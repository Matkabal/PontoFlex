function parseNumber(value) {
  const normalized = String(value ?? "").trim().replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function toMinutes(totalHours) {
  return Math.max(0, Math.round(totalHours * 60));
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function minutesToHHMM(minutes) {
  const bounded = Math.max(0, Math.min(minutes, 23 * 60 + 59));
  const hours = Math.floor(bounded / 60);
  const mins = bounded % 60;
  return `${pad2(hours)}:${pad2(mins)}`;
}

export function parseMonthlyCsvText(csvText) {
  const lines = String(csvText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV vazio ou sem dados.");
  }

  const header = lines[0].split(",").map((col) => col.trim());
  const expectedHeader = ["data", "trabalhado_horas", "esperado_horas", "saldo_horas", "qtd_sessoes"];
  if (header.join(",") !== expectedHeader.join(",")) {
    throw new Error("Cabeçalho CSV inválido para importação.");
  }

  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i].split(",").map((col) => col.trim());
    if (cols.length < 5) continue;

    const [date, workedHoursRaw, expectedHoursRaw, balanceHoursRaw, sessionsRaw] = cols;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Data inválida na linha ${i + 1}: ${date}`);
    }

    const workedHours = parseNumber(workedHoursRaw);
    const expectedHours = parseNumber(expectedHoursRaw);
    const balanceHours = parseNumber(balanceHoursRaw);
    const sessionCount = Math.max(1, Math.round(parseNumber(sessionsRaw) ?? 1));

    if (workedHours === null || expectedHours === null || balanceHours === null) {
      throw new Error(`Valor numérico inválido na linha ${i + 1}.`);
    }

    rows.push({
      date,
      workedHours,
      expectedHours,
      balanceHours,
      sessionCount
    });
  }

  return rows;
}

export function buildPointsFromAggregatedRow(row) {
  const totalMinutes = toMinutes(row.workedHours);
  if (totalMinutes <= 0) return [];

  const sessionCount = Math.max(1, row.sessionCount || 1);
  const baseMinutes = Math.floor(totalMinutes / sessionCount);
  const remainder = totalMinutes % sessionCount;

  const points = [];
  let cursorMinutes = 8 * 60;

  for (let i = 0; i < sessionCount; i += 1) {
    const thisSessionMinutes = baseMinutes + (i < remainder ? 1 : 0);
    const startMinutes = cursorMinutes;
    const endMinutes = startMinutes + thisSessionMinutes;

    points.push({ id: `${row.date}-in-${i}`, time: minutesToHHMM(startMinutes) });
    points.push({ id: `${row.date}-out-${i}`, time: minutesToHHMM(endMinutes) });

    // Pausa fixa entre sessões para reconstrução sintética.
    cursorMinutes = endMinutes + 60;
  }

  return points;
}
