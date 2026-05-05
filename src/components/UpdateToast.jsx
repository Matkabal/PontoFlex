function UpdateToast({ visible, onApply }) {
  if (!visible) return null;

  return (
    <section className="update-toast" role="status" aria-live="polite">
      <p>Nova versao disponivel.</p>
      <button onClick={onApply}>Atualizar</button>
    </section>
  );
}

export default UpdateToast;
