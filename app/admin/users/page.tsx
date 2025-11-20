'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterEnvironment, setFilterEnvironment] = useState('all')

  // Mock data - will be replaced with real Supabase data
  const users = [
    // Will be populated from database
  ]

  const filteredUsers = users // Will implement filtering logic

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-4xl text-[#2C2416] mb-2 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Users
        </h1>
        <p
          className="text-base text-[#6B5D4F]"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Manage API users and track onboarding progress
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-[#D4C5B0] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-[#D4C5B0] bg-[#FAF8F5] text-[#2C2416] focus:outline-none focus:border-[#2C2416]"
              style={{ fontFamily: 'Georgia, serif' }}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-[#D4C5B0] bg-[#FAF8F5] text-[#2C2416] focus:outline-none focus:border-[#2C2416]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="onboarding">Onboarding</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Environment Filter */}
          <div>
            <label className="block text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Environment
            </label>
            <select
              value={filterEnvironment}
              onChange={(e) => setFilterEnvironment(e.target.value)}
              className="w-full px-4 py-2 border border-[#D4C5B0] bg-[#FAF8F5] text-[#2C2416] focus:outline-none focus:border-[#2C2416]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <option value="all">All Environments</option>
              <option value="test">Test Mode</option>
              <option value="live">Live Mode</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#D4C5B0]">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              No users found
            </p>
            <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Users will appear here once they sign up
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAF8F5] border-b border-[#D4C5B0]">
                <tr>
                  <th className="text-left py-4 px-6 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    Company
                  </th>
                  <th className="text-left py-4 px-6 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    Onboarding
                  </th>
                  <th className="text-left py-4 px-6 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    Environment
                  </th>
                  <th className="text-left py-4 px-6 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    Last Active
                  </th>
                  <th className="text-left py-4 px-6 text-xs text-[#8B7E6E] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any, index: number) => (
                  <tr key={index} className="border-b border-[#D4C5B0] hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                          {user.name}
                        </p>
                        <p className="text-xs text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                        {user.company || '—'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="w-full bg-[#FAF8F5] h-2 rounded overflow-hidden mb-1">
                          <div
                            className="bg-[#2C2416] h-full"
                            style={{ width: user.onboardingProgress + '%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                          {user.onboardingProgress}% complete
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={'inline-block px-3 py-1 text-xs ' + (
                          user.environment === 'live'
                            ? 'bg-[#2C2416] text-[#FAF8F5]'
                            : 'bg-[#FAF8F5] text-[#6B5D4F] border border-[#D4C5B0]'
                        )}
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {user.environment}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                        {user.lastActive}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={'/admin/users/' + user.id}
                        className="text-sm text-[#2C2416] hover:underline"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
