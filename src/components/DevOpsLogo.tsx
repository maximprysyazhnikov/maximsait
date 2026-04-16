export default function DevOpsLogo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.svg"
        alt="DevOps logo"
        className="h-11 w-11 shrink-0 rounded-full border border-[#b8ffff]/20 bg-[#f2ffff]/5 object-cover p-0.5 drop-shadow-[0_0_18px_rgba(0,204,204,0.18)]"
      />

      <div className="leading-none">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-zinc-400">
          Maksym
        </div>
        <div className="text-lg font-semibold tracking-tight text-zinc-100">
          DevOps
        </div>
      </div>
    </div>
  );
}
