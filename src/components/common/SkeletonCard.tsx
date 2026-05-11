export function SkeletonCard() {
  return (
    <div className="motion-card min-h-72 rounded-lg border border-primary-100 bg-whitely-50 p-5 shadow-sm">
      <div className="motion-shimmer h-5 w-2/3 rounded" />
      <div className="motion-shimmer mt-4 h-3 w-full rounded" />
      <div className="motion-shimmer mt-2 h-3 w-5/6 rounded" />
      <div className="mt-5 flex gap-2">
        <div className="motion-shimmer h-7 w-24 rounded-full" />
        <div className="motion-shimmer h-7 w-20 rounded-full" />
      </div>
      <div className="motion-shimmer mt-8 h-10 rounded" />
    </div>
  );
}
