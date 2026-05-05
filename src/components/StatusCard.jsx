function StatusCard({ working }) {
  return (
    <section className="card status-card">
      <h2>Status atual</h2>
      <p className={`status-pill ${working ? "is-working" : "is-paused"}`}>
        {working ? "Trabalhando" : "Fora do expediente"}
      </p>
    </section>
  );
}

export default StatusCard;
