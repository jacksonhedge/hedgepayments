'use client'

import { useState, useEffect } from 'react'
import { ArrowUpIcon, ArrowDownIcon, PlusIcon, CreditCardIcon, BanknotesIcon, WalletIcon, ChartBarIcon, CogIcon, BellIcon } from '@heroicons/react/24/outline'
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid'

// Mock data - will be replaced with Supabase
const mockWalletData = {
  balance: {
    available: 12543.67,
    pending: 450.00,
    reserved: 100.00
  },
  currency: 'USD',
  transactions: [
    { id: 1, type: 'deposit', amount: 500.00, status: 'completed', description: 'Bank Transfer', date: '2024-01-15', icon: '🏦' },
    { id: 2, type: 'payment', amount: -23.45, status: 'completed', description: 'Coffee Shop', date: '2024-01-14', icon: '☕' },
    { id: 3, type: 'transfer_in', amount: 100.00, status: 'pending', description: 'From John Doe', date: '2024-01-14', icon: '👤' },
    { id: 4, type: 'withdrawal', amount: -1000.00, status: 'completed', description: 'To Bank Account', date: '2024-01-13', icon: '🏦' },
    { id: 5, type: 'payment', amount: -156.78, status: 'completed', description: 'Amazon Purchase', date: '2024-01-12', icon: '🛒' },
  ],
  paymentMethods: [
    { id: 1, type: 'card', brand: 'Visa', last4: '4242', isDefault: true },
    { id: 2, type: 'bank', bank: 'Chase', last4: '6789', isDefault: false },
    { id: 3, type: 'paypal', email: 'user@example.com', isDefault: false }
  ]
}

type TabType = 'overview' | 'send' | 'receive' | 'transactions' | 'methods' | 'settings'

export default function WalletDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showAddMethod, setShowAddMethod] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [sendAmount, setSendAmount] = useState('')
  const [sendRecipient, setSendRecipient] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-500'
      case 'pending': return 'text-yellow-500'
      case 'failed': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'pending': return <ClockIcon className="w-5 h-5 text-yellow-500" />
      case 'failed': return <XCircleIcon className="w-5 h-5 text-red-500" />
      default: return <ArrowPathIcon className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🦔</div>
              <h1 className="text-2xl font-bold text-white">HedgeWallet</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <BellIcon className="w-6 h-6" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <CogIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Balance</p>
              <h2 className="text-4xl font-bold text-white mt-1">
                {formatCurrency(mockWalletData.balance.available)}
              </h2>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-2">
              <WalletIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/70 text-xs">Pending</p>
              <p className="text-white font-semibold">{formatCurrency(mockWalletData.balance.pending)}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">Reserved</p>
              <p className="text-white font-semibold">{formatCurrency(mockWalletData.balance.reserved)}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'send', label: 'Send', icon: ArrowUpIcon },
              { id: 'receive', label: 'Receive', icon: ArrowDownIcon },
              { id: 'transactions', label: 'History', icon: ClockIcon },
              { id: 'methods', label: 'Methods', icon: CreditCardIcon },
              { id: 'settings', label: 'Settings', icon: CogIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-white bg-slate-700/50'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('send')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  <ArrowUpIcon className="w-8 h-8 mb-2" />
                  <p className="font-semibold">Send Money</p>
                </button>
                <button
                  onClick={() => setActiveTab('receive')}
                  className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                >
                  <ArrowDownIcon className="w-8 h-8 mb-2" />
                  <p className="font-semibold">Receive Money</p>
                </button>
                <button
                  onClick={() => setShowAddMethod(!showAddMethod)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  <PlusIcon className="w-8 h-8 mb-2" />
                  <p className="font-semibold">Add Payment Method</p>
                </button>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {mockWalletData.transactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{tx.icon}</span>
                        <div>
                          <p className="text-white font-medium">{tx.description}</p>
                          <p className="text-slate-400 text-sm">{tx.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                        </span>
                        {getStatusIcon(tx.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Send Tab */}
          {activeTab === 'send' && (
            <div className="max-w-md mx-auto space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Send Money</h3>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Recipient</label>
                <input
                  type="text"
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  placeholder="Email, phone, or @username"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-8 pr-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select payment method</option>
                  {mockWalletData.paymentMethods.map(method => (
                    <option key={method.id} value={method.id.toString()}>
                      {method.type === 'card' ? `${method.brand} •••• ${method.last4}` :
                       method.type === 'bank' ? `${method.bank} •••• ${method.last4}` :
                       `PayPal (${method.email})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Note (optional)</label>
                <textarea
                  placeholder="What's this for?"
                  rows={3}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105">
                Send Money
              </button>
            </div>
          )}

          {/* Receive Tab */}
          {activeTab === 'receive' && (
            <div className="max-w-md mx-auto space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Receive Money</h3>

              <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                <div className="bg-white rounded-lg p-4 mb-4 inline-block">
                  {/* QR Code Placeholder */}
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">QR Code</span>
                  </div>
                </div>
                <p className="text-white font-medium mb-2">Your Wallet ID</p>
                <p className="text-emerald-400 font-mono text-lg">@hedgeuser123</p>
                <button className="mt-4 text-slate-400 hover:text-white transition-colors">
                  Copy to clipboard
                </button>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Request Specific Amount</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                      <input
                        type="number"
                        value={receiveAmount}
                        onChange={(e) => setReceiveAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-8 pr-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all">
                    Generate Payment Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Transaction History</h3>
              <div className="space-y-3">
                {mockWalletData.transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{tx.icon}</span>
                      <div>
                        <p className="text-white font-medium">{tx.description}</p>
                        <p className="text-slate-400 text-sm">{tx.date} • {tx.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                      </span>
                      {getStatusIcon(tx.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'methods' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Payment Methods</h3>
                <button
                  onClick={() => setShowAddMethod(!showAddMethod)}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add New</span>
                </button>
              </div>

              {showAddMethod && (
                <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Add Payment Method</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-slate-600/50 rounded-lg p-4 hover:bg-slate-600 transition-colors text-center">
                      <CreditCardIcon className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white font-medium">Credit/Debit Card</p>
                    </button>
                    <button className="bg-slate-600/50 rounded-lg p-4 hover:bg-slate-600 transition-colors text-center">
                      <BanknotesIcon className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white font-medium">Bank Account</p>
                    </button>
                    <button className="bg-slate-600/50 rounded-lg p-4 hover:bg-slate-600 transition-colors text-center">
                      <WalletIcon className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white font-medium">Digital Wallet</p>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {mockWalletData.paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                        {method.type === 'card' ? <CreditCardIcon className="w-6 h-6 text-white" /> :
                         method.type === 'bank' ? <BanknotesIcon className="w-6 h-6 text-white" /> :
                         <WalletIcon className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {method.type === 'card' ? `${method.brand} •••• ${method.last4}` :
                           method.type === 'bank' ? `${method.bank} •••• ${method.last4}` :
                           `PayPal`}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {method.type === 'paypal' && method.email}
                          {method.isDefault && <span className="text-emerald-400"> • Default</span>}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <CogIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-6">Wallet Settings</h3>

              <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-4">Security</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-slate-400 text-sm">Add extra security to your wallet</p>
                      </div>
                      <button className="bg-slate-600 rounded-full w-12 h-6 relative transition-colors">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Transaction Notifications</p>
                        <p className="text-slate-400 text-sm">Get notified for every transaction</p>
                      </div>
                      <button className="bg-emerald-500 rounded-full w-12 h-6 relative transition-colors">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-4">Limits</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Daily Transaction Limit</span>
                      <span className="text-white font-medium">$10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Monthly Transaction Limit</span>
                      <span className="text-white font-medium">$50,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Single Transaction Limit</span>
                      <span className="text-white font-medium">$5,000</span>
                    </div>
                  </div>
                  <button className="mt-4 text-emerald-400 hover:text-emerald-300 transition-colors text-sm">
                    Request Limit Increase →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}