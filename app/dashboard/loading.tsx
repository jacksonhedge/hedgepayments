export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-dash-surface-border rounded-lg" />
          <div className="h-4 w-32 bg-dash-surface-border rounded-lg mt-2" />
        </div>
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-dash-surface-card border border-dash-surface-border rounded-xl p-6">
            <div className="h-4 w-24 bg-dash-surface-border rounded" />
            <div className="h-8 w-32 bg-dash-surface-border rounded mt-3" />
            <div className="h-3 w-20 bg-dash-surface-border rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dash-surface-card border border-dash-surface-border rounded-xl">
            <div className="p-6 border-b border-dash-surface-border">
              <div className="h-6 w-32 bg-dash-surface-border rounded" />
              <div className="h-4 w-48 bg-dash-surface-border rounded mt-2" />
            </div>
            <div className="divide-y divide-dash-surface-border">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-dash-surface-border rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 w-24 bg-dash-surface-border rounded" />
                    <div className="h-4 w-48 bg-dash-surface-border rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-dash-surface-card border border-dash-surface-border rounded-xl p-6">
            <div className="h-4 w-24 bg-dash-surface-border rounded" />
            <div className="h-6 w-16 bg-dash-surface-border rounded mt-3" />
          </div>
          <div className="bg-dash-surface-card border border-dash-surface-border rounded-xl">
            <div className="p-6 border-b border-dash-surface-border">
              <div className="h-6 w-32 bg-dash-surface-border rounded" />
            </div>
            <div className="divide-y divide-dash-surface-border">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dash-surface-border rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-dash-surface-border rounded" />
                    <div className="h-3 w-32 bg-dash-surface-border rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
