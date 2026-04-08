export default function DevOpsLogo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.svg"
        alt="DevOps logo"
        className="h-11 w-11 shrink-0 rounded-full border border-slate-500/40 bg-slate-200/5 object-cover p-0.5 drop-shadow-[0_0_18px_rgba(96,165,250,0.18)]"
      />

      <div className="leading-none">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-slate-400">
          Maksym
        </div>
        <div className="text-lg font-semibold tracking-tight text-slate-100">
          DevOps
        </div>
      </div>
    </div>
  );
}
