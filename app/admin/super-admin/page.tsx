'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './SuperAdmin.module.css';
import { supabase } from '@/app/utils/supabase';

interface AgentData {
  status: 'healthy' | 'warning' | 'stale' | 'error';
  lastCheck: string | null;
  ageMinutes: number;
  nextCheck: number;
  issues: {
    p0: number;
    p1: number;
    p2: number;
    p3: number;
  };
}

interface AgentConfig {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  schedule: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}

interface BusinessMetrics {
  newSignups: number;
  totalUsers: number;
  transactionCount: number;
  transactionVolume: number;
  revenue: number;
  activeWallets: number;
}

interface StatusData {
  agents: {
    uiOptimizer?: AgentData;
    kycSecurity?: AgentData;
  };
  timestamp: string;
}

interface Issue {
  priority: string;
  title: string;
  date: string;
  report: string;
  agent: string;
}

// Agent Configuration - Hedge Payments Monitoring Agents
const AGENT_CONFIGS: AgentConfig[] = [
  { id: 'payment-processor', name: 'Payment Processing Health', shortName: 'Payment', icon: '💳', description: 'Transaction monitoring', schedule: 'Every 2 min', position: { top: '10%', left: '15%' } },
  { id: 'fraud-security', name: 'Fraud & Security Monitor', shortName: 'Fraud', icon: '🛡️', description: 'Security & fraud detection', schedule: 'Every 5 min', position: { top: '10%', right: '15%' } },
  { id: 'api-health', name: 'API & Infrastructure Health', shortName: 'API', icon: '🔧', description: 'System uptime monitoring', schedule: 'Every 1 min', position: { top: '30%', left: '5%' } },
  { id: 'business-intel', name: 'Business Intelligence', shortName: 'BI', icon: '📊', description: 'Analytics & reporting', schedule: 'Hourly', position: { top: '30%', right: '5%' } },
  { id: 'merchant-support', name: 'Merchant Support Bot', shortName: 'Support', icon: '🎧', description: 'Customer service', schedule: 'Every 15 min', position: { top: '50%', left: '3%' } },
  { id: 'compliance', name: 'Compliance & Regulatory', shortName: 'Compliance', icon: '🔐', description: 'Legal compliance', schedule: 'Hourly', position: { top: '50%', right: '3%' } },
  { id: 'onboarding', name: 'Merchant Onboarding', shortName: 'Onboard', icon: '📈', description: 'User onboarding', schedule: 'Hourly', position: { top: '70%', left: '5%' } },
  { id: 'bug-detection', name: 'Bug Detection & Testing', shortName: 'QA', icon: '🐛', description: 'Quality assurance', schedule: 'Hourly', position: { top: '70%', right: '5%' } },
  { id: 'financial-recon', name: 'Financial Reconciliation', shortName: 'Finance', icon: '💰', description: 'Accounting & payouts', schedule: 'Hourly', position: { bottom: '30%', left: '5%' } },
  { id: 'integration-health', name: 'Integration Health', shortName: 'Integrations', icon: '🌐', description: 'Webhook monitoring', schedule: 'Every 5 min', position: { bottom: '30%', right: '5%' } },
  { id: 'communication', name: 'Communication Agent', shortName: 'Comms', icon: '📧', description: 'Email & notifications', schedule: 'Real-time', position: { bottom: '10%', left: '15%' } },
  { id: 'seo-web', name: 'SEO & Web Presence', shortName: 'SEO', icon: '🔍', description: 'Website monitoring', schedule: 'Daily', position: { bottom: '10%', right: '15%' } },
];

export default function SuperAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [alerts, setAlerts] = useState<Issue[]>([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [token, setToken] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    newSignups: 0,
    totalUsers: 0,
    transactionCount: 0,
    transactionVolume: 0,
    revenue: 0,
    activeWallets: 0
  });
  const wsRef = useRef<WebSocket | null>(null);

  // API base URL (Express server)
  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    // Check for existing token
    const savedToken = localStorage.getItem('radar_token');
    if (savedToken) {
      setToken(savedToken);
      verifyToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      startMonitoring();
      fetchMetrics();

      // Refresh metrics every 30 seconds
      const metricsInterval = setInterval(fetchMetrics, 30000);

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
        clearInterval(metricsInterval);
      };
    }
  }, [isLoggedIn, token]);

  const fetchMetrics = async () => {
    try {
      if (!supabase) {
        console.log('Supabase not configured');
        return;
      }

      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

      // Fetch metrics in parallel
      const [
        usersResult,
        newSignupsResult,
        transactionsResult,
        walletsResult,
      ] = await Promise.all([
        // Total users
        supabase
          .from('users')
          .select('id', { count: 'exact', head: true }),

        // New signups in last 24h
        supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', last24Hours),

        // Transactions in last 24h
        supabase
          .from('transactions')
          .select('amount, fee_amount, status')
          .gte('created_at', last24Hours)
          .in('status', ['completed', 'processing']),

        // Active wallets
        supabase
          .from('wallets')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active'),
      ]);

      // Calculate transaction metrics
      const transactions = transactionsResult.data || [];
      const transactionCount = transactions.length;
      const transactionVolume = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
      const revenue = transactions.reduce((sum, tx) => sum + (tx.fee_amount || 0), 0);

      setMetrics({
        totalUsers: usersResult.count || 0,
        newSignups: newSignupsResult.count || 0,
        transactionCount,
        transactionVolume: transactionVolume / 100, // Convert from cents to dollars
        revenue: revenue / 100, // Convert from cents to dollars
        activeWallets: walletsResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Keep existing metrics on error
    }
  };

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/status`, {
        headers: { 'Authorization': `Bearer ${tokenToVerify}` }
      });

      if (response.ok) {
        setToken(tokenToVerify);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('radar_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('radar_token');
      setToken(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('radar_token', data.token);
      setIsLoggedIn(true);
      setPassword('');
    } catch (error) {
      setLoginError('ACCESS DENIED - Invalid credentials');
      setTimeout(() => setLoginError(''), 3000);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('radar_token');
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const startMonitoring = () => {
    fetchStatus();
    fetchAlerts();

    // Connect WebSocket
    connectWebSocket();

    // Fallback polling
    const interval = setInterval(() => {
      fetchStatus();
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  };

  const connectWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:3000`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'status') {
        setStatusData(message.data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed, reconnecting...');
      setTimeout(connectWebSocket, 5000);
    };

    wsRef.current = ws;
  };

  const fetchStatus = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/api/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStatusData(data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const fetchAlerts = async () => {
    if (!token) return;

    try {
      const [uiData, kycData] = await Promise.all([
        fetch(`${API_BASE}/api/logs/ui`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${API_BASE}/api/logs/kyc`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json())
      ]);

      const allIssues: Issue[] = [
        ...(uiData.issues || []).map((i: Issue) => ({ ...i, agent: 'UI/UX' })),
        ...(kycData.issues || []).map((i: Issue) => ({ ...i, agent: 'KYC' }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setAlerts(allIssues);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 120) return '1 min ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 7200) return '1 hour ago';
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 172800) return 'yesterday';
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const filteredAlerts = currentFilter === 'all'
    ? alerts
    : alerts.filter(a => a.priority === currentFilter);

  if (!isLoggedIn) {
    return (
      <div className={styles.loginScreen}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <div className={styles.radarIcon}>🎯</div>
            <h1>LINDEMAN RADAR</h1>
            <p className={styles.subtitle}>MONITORING COMMAND CENTER</p>
          </div>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                autoComplete="off"
                required
                className={styles.passwordInput}
              />
              <button type="submit" className={styles.btnPrimary}>
                ACCESS SYSTEM
              </button>
            </div>
            {loginError && (
              <div className={`${styles.errorMessage} ${styles.show}`}>
                {loginError}
              </div>
            )}
          </form>
          <div className={styles.loginFooter}>
            <span className={styles.statusIndicator}></span>
            <span>SYSTEM READY</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardScreen}>
      {/* Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.radarIcon}>🎯</div>
          <h1>HEDGE PAYMENTS SUPER-ADMIN</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.statusBadge}>
            <span className={styles.pulse}></span>
            MONITORING ACTIVE
          </div>
          <button onClick={handleLogout} className={styles.btnGhost}>
            LOGOUT
          </button>
        </div>
      </header>

      {/* Business Metrics Bar */}
      <div className={styles.metricsBar}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🆕</div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>New Signups (24h)</div>
            <div className={styles.metricValue}>{metrics.newSignups.toLocaleString()}</div>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>👥</div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Total Users</div>
            <div className={styles.metricValue}>{metrics.totalUsers.toLocaleString()}</div>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>💳</div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Transactions (24h)</div>
            <div className={styles.metricValue}>{metrics.transactionCount.toLocaleString()}</div>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📊</div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Volume (24h)</div>
            <div className={styles.metricValue}>${metrics.transactionVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>💰</div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Revenue (24h)</div>
            <div className={styles.metricValue}>${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>💼</div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Active Wallets</div>
            <div className={styles.metricValue}>{metrics.activeWallets.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.dashboardGrid}>
        {/* Radar Display */}
        <section className={`${styles.panel} ${styles.radarPanel}`}>
          <div className={styles.panelHeader}>
            <h2>AGENT STATUS</h2>
            <div className={styles.lastUpdated}>
              {statusData
                ? `Updated ${timeAgo(new Date(statusData.timestamp))}`
                : 'Updating...'}
            </div>
          </div>
          <div className={styles.radarContainer}>
            <div className={styles.radarCircle}>
              <div className={styles.radarSweep}></div>
              <div className={styles.radarGrid}></div>

              {/* Dynamic Agent Markers */}
              {AGENT_CONFIGS.map((agent) => (
                <div
                  key={agent.id}
                  className={styles.agentMarker}
                  data-status="healthy"
                  style={agent.position}
                  title={agent.name}
                >
                  <div className={styles.markerPulse}></div>
                  <div className={styles.markerDot}></div>
                  <div className={styles.markerLabel}>{agent.shortName}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agent Details */}
        <section className={`${styles.panel} ${styles.detailsPanel}`}>
          <div className={styles.panelHeader}>
            <h2>AGENT DETAILS</h2>
          </div>
          <div className={styles.agentDetails}>
            {/* UI Optimizer */}
            <AgentCard
              title="UI/UX Optimizer"
              icon="📱"
              description="iOS app and web admin monitoring"
              schedule="Every 4 hours"
              data={statusData?.agents.uiOptimizer}
              timeAgo={timeAgo}
            />

            {/* KYC Security */}
            <AgentCard
              title="KYC Security Monitor"
              icon="🔒"
              description="Authentication and fraud detection"
              schedule="Every hour"
              data={statusData?.agents.kycSecurity}
              timeAgo={timeAgo}
            />
          </div>
        </section>

        {/* Alert Feed */}
        <section className={`${styles.panel} ${styles.alertsPanel}`}>
          <div className={styles.panelHeader}>
            <h2>RECENT ALERTS</h2>
            <div className={styles.alertFilters}>
              {['all', 'P0', 'P1', 'P2', 'P3'].map(priority => (
                <button
                  key={priority}
                  className={`${styles.filterBtn} ${
                    currentFilter === priority ? styles.active : ''
                  }`}
                  onClick={() => setCurrentFilter(priority)}
                >
                  {priority.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.alertsContainer}>
            {filteredAlerts.length === 0 ? (
              <div className={styles.noAlerts}>
                <span>✅</span>
                <p>No recent alerts</p>
                <p className={styles.small}>All systems operational</p>
              </div>
            ) : (
              filteredAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`${styles.alertItem} ${styles[alert.priority.toLowerCase()]}`}
                >
                  <div className={styles.alertHeader}>
                    <span
                      className={`${styles.alertPriority} ${
                        styles[alert.priority.toLowerCase()]
                      }`}
                    >
                      {alert.priority}
                    </span>
                    <span className={styles.alertTime}>
                      {timeAgo(new Date(alert.date))}
                    </span>
                  </div>
                  <div className={styles.alertTitle}>{alert.title}</div>
                  <div className={styles.alertSource}>
                    Source: {alert.agent} • {alert.report}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

interface AgentCardProps {
  title: string;
  icon: string;
  description: string;
  schedule: string;
  data?: AgentData;
  timeAgo: (date: Date) => string;
}

function AgentCard({ title, icon, description, schedule, data, timeAgo }: AgentCardProps) {
  const status = data?.status || 'healthy';

  return (
    <div className={styles.agentCard}>
      <div className={styles.agentCardHeader}>
        <div className={styles.agentIcon}>{icon}</div>
        <div>
          <h3>{title}</h3>
          <p className={styles.agentDescription}>{description}</p>
        </div>
        <div className={`${styles.statusBadge}`} data-status={status}>
          <span className={styles.pulse}></span>
          <span className={styles.statusText}>{status.toUpperCase()}</span>
        </div>
      </div>
      <div className={styles.agentStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Last Check</span>
          <span className={styles.statValue}>
            {data?.lastCheck ? timeAgo(new Date(data.lastCheck)) : '--'}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Next Check</span>
          <span className={styles.statValue}>
            {data?.nextCheck ? `${Math.floor(data.nextCheck)} min` : '--'}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Schedule</span>
          <span className={styles.statValue}>{schedule}</span>
        </div>
      </div>
      <div className={styles.agentIssues}>
        <div className={`${styles.issueCount} ${styles.p0}`}>
          <span className={styles.count}>{data?.issues?.p0 || 0}</span> P0
        </div>
        <div className={`${styles.issueCount} ${styles.p1}`}>
          <span className={styles.count}>{data?.issues?.p1 || 0}</span> P1
        </div>
        <div className={`${styles.issueCount} ${styles.p2}`}>
          <span className={styles.count}>{data?.issues?.p2 || 0}</span> P2
        </div>
        <div className={`${styles.issueCount} ${styles.p3}`}>
          <span className={styles.count}>{data?.issues?.p3 || 0}</span> P3
        </div>
      </div>
    </div>
  );
}
