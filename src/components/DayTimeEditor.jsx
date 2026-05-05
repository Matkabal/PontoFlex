import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import TimePointsEditor from "./TimePointsEditor";
import { formatMinutesToHHMM, formatWorkedMinutes } from "../utils/time";

function DayTimeEditor({ selectedDate, row, points, onAdd, onUpdate, onDelete, error }) {
  return (
    <section className="card day-detail-card">
      <h3>Detalhe e edição do dia</h3>
      <p className="helper">{format(new Date(`${selectedDate}T12:00:00`), "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
      <p>Trabalhado: {formatWorkedMinutes(row?.workedMinutes || 0)}</p>
      <p>Esperado: {formatWorkedMinutes(row?.expectedMinutes || 0)}</p>
      <p className={(row?.balanceMinutes || 0) >= 0 ? "balance-pos" : "balance-neg"}>Saldo: {formatMinutesToHHMM(row?.balanceMinutes || 0)}</p>
      {error ? <p className="error">{error}</p> : null}
      <TimePointsEditor points={points} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
    </section>
  );
}

export default DayTimeEditor;
