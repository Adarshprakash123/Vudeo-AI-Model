export function AuthShell({ title, subtitle, children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-[28px] border border-line bg-[#0e0e0e] p-7 shadow-panel">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent text-sm font-bold text-black">
            Q
          </div>
          <p className="text-sm font-semibold tracking-tight text-white">QRT Studio</p>
        </div>

        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-subtle">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
