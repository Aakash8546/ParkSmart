const Panel = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-xl border border-slate-600/70 bg-slate-800/70 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default Panel;