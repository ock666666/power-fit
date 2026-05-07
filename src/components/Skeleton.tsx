export function SkeletonCard() {
  return (
    <div className="liquid-glass rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-foreground/5" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded bg-foreground/5" />
          <div className="h-2 w-1/2 rounded bg-foreground/[0.03]" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonMuscleCard() {
  return (
    <div className="liquid-glass rounded-2xl p-6 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-foreground/5 mb-3" />
      <div className="h-4 w-2/3 rounded bg-foreground/5 mb-2" />
      <div className="h-3 w-full rounded bg-foreground/[0.03] mb-2" />
      <div className="h-3 w-3/4 rounded bg-foreground/[0.03]" />
    </div>
  );
}

export function SkeletonLine() {
  return (
    <div className="liquid-glass rounded-xl p-4 animate-pulse space-y-2">
      <div className="h-3 w-1/3 rounded bg-foreground/5" />
      <div className="h-2 w-2/3 rounded bg-foreground/[0.03]" />
    </div>
  );
}
