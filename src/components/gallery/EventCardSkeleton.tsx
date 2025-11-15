export function EventCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden border animate-pulse">
      <div className="relative h-48 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
