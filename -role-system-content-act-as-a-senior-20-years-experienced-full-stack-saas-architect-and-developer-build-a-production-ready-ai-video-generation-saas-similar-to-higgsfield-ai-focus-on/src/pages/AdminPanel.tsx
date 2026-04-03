import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  TrendingUp,
  CreditCard,
  Activity,
  BarChart3,
  DollarSign,
  Video,
  Search,
  Eye,
} from 'lucide-react';

interface MockUser {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'pro';
  credits: number;
  videosGenerated: number;
  joinedAt: string;
  status: 'active' | 'inactive';
}

interface MockPayment {
  id: string;
  userEmail: string;
  amount: number;
  credits: number;
  status: 'succeeded' | 'pending' | 'failed';
  date: string;
}

const mockUsers: MockUser[] = [
  { id: 'u1', email: 'alice@example.com', name: 'Alice Johnson', plan: 'pro', credits: 342, videosGenerated: 158, joinedAt: '2026-01-15', status: 'active' },
  { id: 'u2', email: 'bob@example.com', name: 'Bob Smith', plan: 'starter', credits: 67, videosGenerated: 33, joinedAt: '2026-02-01', status: 'active' },
  { id: 'u3', email: 'carol@example.com', name: 'Carol Davis', plan: 'free', credits: 2, videosGenerated: 3, joinedAt: '2026-02-10', status: 'active' },
  { id: 'u4', email: 'dave@example.com', name: 'Dave Wilson', plan: 'starter', credits: 0, videosGenerated: 100, joinedAt: '2026-01-20', status: 'inactive' },
  { id: 'u5', email: 'eve@example.com', name: 'Eve Martinez', plan: 'pro', credits: 489, videosGenerated: 11, joinedAt: '2026-03-01', status: 'active' },
  { id: 'u6', email: 'frank@example.com', name: 'Frank Brown', plan: 'free', credits: 5, videosGenerated: 0, joinedAt: '2026-03-05', status: 'active' },
  { id: 'u7', email: 'grace@example.com', name: 'Grace Lee', plan: 'starter', credits: 45, videosGenerated: 55, joinedAt: '2026-02-15', status: 'active' },
  { id: 'u8', email: 'henry@example.com', name: 'Henry Taylor', plan: 'pro', credits: 201, videosGenerated: 299, joinedAt: '2026-01-10', status: 'active' },
];

const mockPayments: MockPayment[] = [
  { id: 'pay_1', userEmail: 'alice@example.com', amount: 49, credits: 500, status: 'succeeded', date: '2026-03-01' },
  { id: 'pay_2', userEmail: 'bob@example.com', amount: 19, credits: 100, status: 'succeeded', date: '2026-02-28' },
  { id: 'pay_3', userEmail: 'eve@example.com', amount: 49, credits: 500, status: 'succeeded', date: '2026-03-01' },
  { id: 'pay_4', userEmail: 'dave@example.com', amount: 19, credits: 100, status: 'failed', date: '2026-02-25' },
  { id: 'pay_5', userEmail: 'grace@example.com', amount: 19, credits: 100, status: 'succeeded', date: '2026-02-15' },
  { id: 'pay_6', userEmail: 'henry@example.com', amount: 49, credits: 500, status: 'succeeded', date: '2026-02-10' },
];

const stats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalRevenue: 24580,
  totalVideos: 8934,
  apiCallsToday: 342,
  failedJobsToday: 12,
};

const chartData = [
  { day: 'Mon', videos: 45, revenue: 120 },
  { day: 'Tue', videos: 62, revenue: 180 },
  { day: 'Wed', videos: 38, revenue: 95 },
  { day: 'Thu', videos: 78, revenue: 210 },
  { day: 'Fri', videos: 91, revenue: 280 },
  { day: 'Sat', videos: 55, revenue: 150 },
  { day: 'Sun', videos: 42, revenue: 110 },
];

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'payments'>('overview');

  const filteredUsers = mockUsers.filter(
    u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const maxVideos = Math.max(...chartData.map(d => d.videos));

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-3xl top-20 left-0" />
        <div className="absolute w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl bottom-0 right-0" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </h1>
          <p className="text-gray-400 mt-1">Monitor and manage your SaaS platform</p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-6">
          {(['overview', 'users', 'payments'] as const).map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm capitalize transition-all ${
                activeSection === section
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats.totalUsers.toLocaleString()}
                  change="+12%"
                  positive
                  color="purple"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Active Users"
                  value={stats.activeUsers.toLocaleString()}
                  change="+8%"
                  positive
                  color="cyan"
                />
                <StatCard
                  icon={DollarSign}
                  label="Total Revenue"
                  value={`$${stats.totalRevenue.toLocaleString()}`}
                  change="+23%"
                  positive
                  color="green"
                />
                <StatCard
                  icon={Video}
                  label="Videos Generated"
                  value={stats.totalVideos.toLocaleString()}
                  change="+15%"
                  positive
                  color="yellow"
                />
              </div>

              {/* API Usage & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* API Usage */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    API Usage Today
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">API Calls</span>
                        <span className="font-medium">{stats.apiCallsToday}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Failed Jobs</span>
                        <span className="font-medium text-red-400">{stats.failedJobsToday}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10">
                        <div className="h-full w-[5%] rounded-full bg-red-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Weekly Activity
                  </h3>
                  <div className="flex items-end gap-3 h-40">
                    {chartData.map(d => (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-cyan-400 transition-all"
                            style={{ height: `${(d.videos / maxVideos) * 120}px` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{d.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-gray-400">Videos</span>
                      </div>
                    </div>
                    <span className="text-gray-500">
                      Total: {chartData.reduce((a, b) => a + b.videos, 0)} videos this week
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Payments */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-400" />
                  Recent Payments
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Credits</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPayments.slice(0, 5).map(payment => (
                        <tr key={payment.id} className="border-b border-white/5">
                          <td className="py-3 px-4 text-sm">{payment.userEmail}</td>
                          <td className="py-3 px-4 text-sm font-medium">${payment.amount}</td>
                          <td className="py-3 px-4 text-sm">{payment.credits}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                payment.status === 'succeeded'
                                  ? 'bg-green-500/10 text-green-400'
                                  : payment.status === 'failed'
                                  ? 'bg-red-500/10 text-red-400'
                                  : 'bg-yellow-500/10 text-yellow-400'
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">{payment.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors text-white placeholder-gray-500"
                />
              </div>

              {/* Users Table */}
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Plan</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Credits</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Videos</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Joined</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-xs font-bold">
                              {user.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              user.plan === 'pro'
                                ? 'bg-purple-500/10 text-purple-400'
                                : user.plan === 'starter'
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'bg-gray-500/10 text-gray-400'
                            }`}
                          >
                            {user.plan}
                          </span>
                        </td>
                        <td className="p-4 text-sm">{user.credits}</td>
                        <td className="p-4 text-sm">{user.videosGenerated}</td>
                        <td className="p-4">
                          <span
                            className={`flex items-center gap-1.5 text-xs font-medium ${
                              user.status === 'active' ? 'text-green-400' : 'text-gray-500'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-400' : 'bg-gray-500'}`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">{user.joinedAt}</td>
                        <td className="p-4">
                          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    No users found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Payment Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-400">$24,580</p>
                </div>
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-purple-400">$4,820</p>
                </div>
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Failed Payments</p>
                  <p className="text-2xl font-bold text-red-400">3</p>
                </div>
              </div>

              {/* Payments Table */}
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Payment ID</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Credits</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPayments.map(payment => (
                      <tr key={payment.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-sm font-mono text-gray-400">{payment.id}</td>
                        <td className="p-4 text-sm">{payment.userEmail}</td>
                        <td className="p-4 text-sm font-medium">${payment.amount}</td>
                        <td className="p-4 text-sm">{payment.credits}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              payment.status === 'succeeded'
                                ? 'bg-green-500/10 text-green-400'
                                : payment.status === 'failed'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">{payment.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    green: 'from-green-500/20 to-green-600/5 border-green-500/20',
    yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/20',
  };
  const iconColorMap: Record<string, string> = {
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className={`p-5 rounded-xl bg-gradient-to-br ${colorMap[color]} border`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-5 h-5 ${iconColorMap[color]}`} />
        <span className={`text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
