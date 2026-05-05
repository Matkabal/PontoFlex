function PunchButton({ working, onPunchIn, onPunchOut }) {
  return (
    <button className="punch-btn" onClick={working ? onPunchOut : onPunchIn}>
      {working ? "Bater saida" : "Bater entrada"}
    </button>
  );
}

export default PunchButton;
