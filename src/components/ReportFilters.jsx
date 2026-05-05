function ReportFilters({ filters, onChange, onExport, onImport }) {
  return (
    <section className="card filters-card">
      <div className="filters-grid">
        <label><input type="checkbox" checked={filters.showAllDays} onChange={(e) => onChange({ ...filters, showAllDays: e.target.checked })} /> Mostrar todos os dias</label>
        <label><input type="checkbox" checked={filters.includeWeekends} onChange={(e) => onChange({ ...filters, includeWeekends: e.target.checked })} /> Incluir fins de semana</label>
        <label><input type="checkbox" checked={filters.includeHolidays} onChange={(e) => onChange({ ...filters, includeHolidays: e.target.checked })} /> Incluir feriados</label>
      </div>
      <div className="filters-actions">
        <button className="btn-primary" onClick={onExport}>Exportar CSV</button>
        <button onClick={onImport}>Importar CSV</button>
      </div>
    </section>
  );
}

export default ReportFilters;
