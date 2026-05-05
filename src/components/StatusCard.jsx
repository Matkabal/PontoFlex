function StatusCard({ working }) {
  return (
    <section className="card">
      <h2>Status atual</h2>
      <p className={working ? "ok" : "warn"}>{working ? "Trabalhando" : "Fora do expediente"}</p>
    </section>
  );
}

export default StatusCard;
