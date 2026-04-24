export function PageSkeleton() {
  return (
    <div className="animate-pulse px-4 py-4">
      <div className="h-6 w-32 rounded-xl bg-gray-200" />
      <div className="mt-4 h-24 rounded-3xl bg-gray-200" />
      <div className="mt-4 flex gap-2 overflow-hidden">
        <div className="h-8 w-20 rounded-full bg-gray-200" />
        <div className="h-8 w-24 rounded-full bg-gray-200" />
        <div className="h-8 w-20 rounded-full bg-gray-200" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-24 rounded-2xl bg-gray-200" />
        <div className="h-24 rounded-2xl bg-gray-200" />
        <div className="h-24 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}
