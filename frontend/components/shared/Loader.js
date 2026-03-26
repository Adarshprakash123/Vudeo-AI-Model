export function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-sm text-subtle">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
