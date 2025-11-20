'use client'

export default function AdminDashboard() {
  // Mock data - will be replaced with real data from Supabase
  const stats = {
    signupsToday: 0,
    signupsWeek: 0,
    totalUsers: 0,
    activeUsers: 0,
    apiCallsToday: 0,
    apiCallsWeek: 0,
    testModeUsers: 0,
    liveModeUsers: 0,
  }

  const recentUsers = [
    // Mock data
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-4xl text-[#2C2416] mb-2 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Dashboard
        </h1>
        <p
          className="text-base text-[#6B5D4F]"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Overview of your Hedge Payments platform
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white border border-[#D4C5B0] p-6">
          <p className="text-xs text-[#8B7E6E] uppercase tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Total Users
          </p>
          <p className="text-3xl text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            {stats.totalUsers}
          </p>
          <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
            +{stats.signupsToday} today
          </p>
        </div>

        {/* Active Users */}
        <div className="bg-white border border-[#D4C5B0] p-6">
          <p className="text-xs text-[#8B7E6E] uppercase tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Active Users
          </p>
          <p className="text-3xl text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            {stats.activeUsers}
          </p>
          <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
            Made API call in 7 days
          </p>
        </div>

        {/* API Calls Today */}
        <div className="bg-white border border-[#D4C5B0] p-6">
          <p className="text-xs text-[#8B7E6E] uppercase tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            API Calls Today
          </p>
          <p className="text-3xl text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            {stats.apiCallsToday.toLocaleString()}
          </p>
          <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
            {stats.apiCallsWeek.toLocaleString()} this week
          </p>
        </div>

        {/* Live Mode Users */}
        <div className="bg-white border border-[#D4C5B0] p-6">
          <p className="text-xs text-[#8B7E6E] uppercase tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Live Mode
          </p>
          <p className="text-3xl text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            {stats.liveModeUsers}
          </p>
          <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
            {stats.testModeUsers} in test mode
          </p>
        </div>
      </div>

      {/* Onboarding Funnel */}
      <div className="bg-white border border-[#D4C5B0] p-6 mb-8">
        <h2
          className="text-2xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Onboarding Funnel (This Week)
        </h2>
        <div className="space-y-4">
          {[
            { stage: 'Signed Up', count: stats.signupsWeek, percentage: 100 },
            { stage: 'Email Verified', count: 0, percentage: 0 },
            { stage: 'First API Call', count: 0, percentage: 0 },
            { stage: 'First Payment Created', count: 0, percentage: 0 },
            { stage: 'Webhook Configured', count: 0, percentage: 0 },
            { stage: 'Went Live', count: stats.liveModeUsers, percentage: 0 },
          ].map((item) => (
            <div key={item.stage}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                  {item.stage}
                </span>
                <span className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-[#FAF8F5] h-2 rounded overflow-hidden">
                <div
                  className="bg-[#2C2416] h-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Signups */}
      <div className="bg-white border border-[#D4C5B0] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-2xl text-[#2C2416]"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
          >
            Recent Signups
          </h2>
          <a
            href="/admin/users"
            className="text-sm text-[#6B5D4F] hover:text-[#2C2416] transition-colors"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            View all →
          </a>
        </div>

        {recentUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              No users yet. Waiting for first signup...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#D4C5B0]">
                <tr>
                  <th className="text-left py-3 px-4 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    Company
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    Signed Up
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Will be populated with data */}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
