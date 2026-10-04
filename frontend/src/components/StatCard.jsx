const StatCard = ({ title, value, icon }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-600/70 bg-slate-800/70 px-5 py-4">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <h2 className="mt-1 text-2xl font-bold text-white">{value}</h2>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700/80 text-blue-400">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;