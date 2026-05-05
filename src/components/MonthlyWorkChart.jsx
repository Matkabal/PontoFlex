import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function MonthlyWorkChart({ data }) {
  return (
    <section className="card chart-card">
      <h3>Horas por dia (trabalhado x esperado)</h3>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis unit="h" />
            <Tooltip formatter={(value) => `${value}h`} />
            <Legend />
            <Bar dataKey="esperadoHoras" name="Esperado" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            <Bar dataKey="trabalhadoHoras" name="Trabalhado" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MonthlyWorkChart;
