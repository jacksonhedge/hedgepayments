'use client'

import { useState, useEffect } from 'react'

interface Transaction {
  id: string
  date: string
  merchant: string
  amount: number
  roundUp: number
}

export default function RoundUpsDemo() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [roundUpType, setRoundUpType] = useState<'nearest_dollar' | 'custom'>('nearest_dollar')
  const [customAmount, setCustomAmount] = useState('1.00')
  const [destinationAccount, setDestinationAccount] = useState('savings')
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant')
  const [totalSaved, setTotalSaved] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  // Sample transactions for demo
  const [transactions] = useState<Transaction[]>([
    { id: '1', date: '2024-12-20', merchant: 'Starbucks', amount: 5.75, roundUp: 0.25 },
    { id: '2', date: '2024-12-20', merchant: 'Amazon', amount: 43.21, roundUp: 0.79 },
    { id: '3', date: '2024-12-19', merchant: 'Uber', amount: 18.40, roundUp: 0.60 },
    { id: '4', date: '2024-12-19', merchant: 'Target', amount: 67.83, roundUp: 0.17 },
    { id: '5', date: '2024-12-18', merchant: 'Netflix', amount: 15.99, roundUp: 0.01 },
  ])

  useEffect(() => {
    const total = transactions.reduce((sum, t) => {
      if (roundUpType === 'custom') {
        return sum + parseFloat(customAmount)
      }
      return sum + t.roundUp
    }, 0)
    setTotalSaved(total)
  }, [transactions, roundUpType, customAmount])

  const handleSaveSettings = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Round-Ups Settings</h1>
              <p className="text-gray-600 mt-2">Save spare change automatically with every purchase</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Saved This Month</p>
              <p className="text-3xl font-bold text-green-600">${totalSaved.toFixed(2)}</p>
            </div>
          </div>

          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Enable Round-Ups</h3>
              <p className="text-sm text-gray-600">Automatically round up your purchases</p>
            </div>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Settings */}
          {isEnabled && (
            <div className="space-y-6">
              {/* Round-Up Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Round-Up Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRoundUpType('nearest_dollar')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      roundUpType === 'nearest_dollar'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">Nearest Dollar</div>
                    <div className="text-sm text-gray-600 mt-1">Round up to the next dollar</div>
                  </button>
                  <button
                    onClick={() => setRoundUpType('custom')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      roundUpType === 'custom'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">Fixed Amount</div>
                    <div className="text-sm text-gray-600 mt-1">Add a fixed amount per transaction</div>
                  </button>
                </div>
              </div>

              {/* Custom Amount */}
              {roundUpType === 'custom' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Fixed Amount per Transaction
                  </label>
                  <div className="flex items-center">
                    <span className="text-2xl text-gray-600 mr-2">$</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-32 px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.50"
                      min="0.50"
                    />
                  </div>
                </div>
              )}

              {/* Destination Account */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Destination Account
                </label>
                <select
                  value={destinationAccount}
                  onChange={(e) => setDestinationAccount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="savings">Savings Account (****4532)</option>
                  <option value="investment">Investment Account (****7891)</option>
                  <option value="charity">Charity Fund (****2156)</option>
                </select>
              </div>

              {/* Transfer Frequency */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Transfer Frequency
                </label>
                <div className="flex gap-3">
                  {(['instant', 'daily', 'weekly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all capitalize ${
                        frequency === freq
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveSettings}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Save Settings
              </button>

              {showSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">✓ Settings saved successfully!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Transactions Preview */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Round-Ups Preview</h2>
          <p className="text-sm text-gray-600 mb-6">
            See how round-ups would apply to your recent transactions
          </p>

          <div className="space-y-3">
            {transactions.map((transaction) => {
              const roundUpAmount = roundUpType === 'custom'
                ? parseFloat(customAmount)
                : transaction.roundUp

              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{transaction.merchant}</div>
                    <div className="text-sm text-gray-600">{transaction.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900">${transaction.amount.toFixed(2)}</div>
                    {isEnabled && (
                      <div className="text-sm text-green-600 font-semibold">
                        +${roundUpAmount.toFixed(2)} saved
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {isEnabled && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Round-Ups</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${totalSaved.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Will be transferred {frequency === 'instant' ? 'immediately' : frequency}
              </p>
            </div>
          )}
        </div>

        {/* API Integration Info */}
        <div className="mt-6 p-6 bg-gray-900 rounded-2xl text-white">
          <h3 className="text-lg font-semibold mb-2">🚀 Easy Integration</h3>
          <p className="text-gray-300 mb-4">
            This entire round-ups configuration can be integrated into your app with just a few lines of code:
          </p>
          <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400">// Install the SDK</div>
            <div className="text-gray-300">npm install @hedge/roundups-sdk</div>
            <div className="mt-3 text-green-400">// Add to your app</div>
            <div className="text-gray-300">{'<RoundUpsSettings userId={user.id} />'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}