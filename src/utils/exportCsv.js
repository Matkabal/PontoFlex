export function exportMonthlyCsv(rows, fileName) {
  const header = ["data", "trabalhado_horas", "esperado_horas", "saldo_horas", "qtd_sessoes"];
  const lines = rows.map((row) => {
    const worked = (row.workedMinutes / 60).toFixed(2);
    const expected = (row.expectedMinutes / 60).toFixed(2);
    const balance = (row.balanceMinutes / 60).toFixed(2);
    return [row.date, worked, expected, balance, String(row.sessions.length)].join(",");
  });

  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}
