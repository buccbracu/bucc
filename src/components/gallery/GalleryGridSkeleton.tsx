export function GalleryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="relative aspect-square overflow-hidden rounded-lg bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}
