import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function MonthlyOvertimeChart({ data }) {
  return (
    <section className="card chart-card">
      <h3>Hora extra/falta por dia</h3>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis unit="h" />
            <Tooltip formatter={(value) => `${value}h`} />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Bar dataKey="extraHoras" name="Saldo diário" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MonthlyOvertimeChart;
