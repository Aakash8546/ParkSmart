const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-500/20 text-emerald-400",
    Completed: "bg-blue-500/20 text-blue-400",
    Cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`rounded-md px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-600 text-slate-300"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;