import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, CheckSquare, Users, FileText, Settings, LogOut, Bell, Search, Plus, Calendar, MessageSquare, Star } from 'lucide-react';

// --- Helper UI Components ---
// eslint-disable-next-line no-unused-vars
function SidebarItem({ icon: Icon, label, active, expanded }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors select-none
      ${active ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'}`}
      title={!expanded ? label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {expanded && <span className="text-sm font-medium truncate">{label}</span>}
    </div>
  );
}

function Card({ title, subtitle, right, children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

function Donut({ percent = 72, label = '', value = '', color = '#3b82f6' }) {
  const bg = useMemo(
    () => ({
      background: `conic-gradient(${color} ${percent}%, #e5e7eb ${percent}%)`,
    }),
    [percent, color],
  );
  return (
    <div className="relative w-36 h-36">
      <div className="absolute inset-0 rounded-full" style={bg} />
      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold leading-tight">{value}</div>
          <div className="text-xs text-gray-500 -mt-0.5">{label}</div>
        </div>
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function TaskDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // hover to expand
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedProject, setSelectedProject] = useState('Project Alpha');

  // Sparkline data (overall progress)
  const progressLine = [
    { m: 'jan', v: 46 },
    { m: 'feb', v: 52 },
    { m: 'mar', v: 48 },
    { m: 'apr', v: 56 },
    { m: 'may', v: 60 },
    { m: 'jun', v: 58 },
    { m: 'jul', v: 65 },
    { m: 'aug', v: 62 },
    { m: 'sep', v: 68 },
    { m: 'oct', v: 66 },
    { m: 'nov', v: 72 },
    { m: 'dec', v: 75 },
  ];

  // Bar + line like the screenshot (task creation vs completed per month)
  const workstream = [
    { name: 'jan', created: 120, completed: 90 },
    { name: 'feb', created: 140, completed: 110 },
    { name: 'mar', created: 170, completed: 130 },
    { name: 'apr', created: 150, completed: 120 },
    { name: 'may', created: 160, completed: 150 },
    { name: 'jun', created: 180, completed: 160 },
    { name: 'jul', created: 210, completed: 190 },
    { name: 'aug', created: 230, completed: 210 },
    { name: 'sep', created: 240, completed: 220 },
    { name: 'oct', created: 200, completed: 190 },
    { name: 'nov', created: 260, completed: 240 },
    { name: 'dec', created: 280, completed: 260 },
  ];

  // Pie segments for status distribution
  const statusPie = [
    { name: 'To Do', value: 120 },
    { name: 'In Progress', value: 180 },
    { name: 'Review', value: 60 },
    { name: 'Completed', value: 420 },
  ];
  const STATUS_COLORS = ['#6A5AE0', '#27AE60', '#F5A623', '#2D9CDB']; // purple, green, orange, blue

  // Latest updates (like reviews list)
  const updates = [
    {
      name: 'Deena Timmons',
      time: '5 hours ago',
      source: 'Sprint Board',
      text: 'Moved ‘Marketing site QA’ to Review. Great progress; waiting on copy approval.',
      avatar: 'https://i.pravatar.cc/40?img=1',
      chips: ['marketing', 'frontend', 'priority:medium'],
      attachments: [
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=200&q=40',
        'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=200&q=40',
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=200&q=40',
      ],
    },
    {
      name: 'Sheila Lee',
      time: '2 days ago',
      source: 'Automations',
      text: 'Recurring task ‘Weekly analytics report’ completed and archived.',
      avatar: 'https://i.pravatar.cc/40?img=5',
      chips: ['reporting', 'data', 'automation'],
      attachments: [],
    },
    {
      name: 'Sarah Doyle',
      time: '5 days ago',
      source: 'Mentions',
      text: '@Sarah marked ‘Mobile onboarding redesign’ as blocked by API changes.',
      avatar: 'https://i.pravatar.cc/40?img=10',
      chips: ['mobile', 'ux', 'blocked'],
      attachments: [],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar (hover-expand) */}
      <aside onMouseEnter={() => setSidebarOpen(true)} onMouseLeave={() => setSidebarOpen(false)} className={`group relative z-20 h-full bg-white border-r border-gray-200 shadow-sm transition-[width] duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 grid place-items-center text-white font-bold">T</div>
          {sidebarOpen && <span className="font-semibold">TaskFlow</span>}
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Overview" expanded={sidebarOpen} active />
          <SidebarItem icon={Users} label="Users" expanded={sidebarOpen} />
          <SidebarItem icon={CheckSquare} label="Department" expanded={sidebarOpen} />
          <SidebarItem icon={Users} label="Roles" expanded={sidebarOpen} />
          <SidebarItem icon={FileText} label="Reports" expanded={sidebarOpen} />
          <SidebarItem icon={Calendar} label="Calendar" expanded={sidebarOpen} />
          <SidebarItem icon={MessageSquare} label="Messages" expanded={sidebarOpen} />
        </nav>

        {/* Bottom fixed */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 space-y-1 bg-white">
          <SidebarItem icon={Settings} label="Settings" expanded={sidebarOpen} />
          <SidebarItem icon={LogOut} label="Logout" expanded={sidebarOpen} />
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar + tabs */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
          <div className="max-w-full px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm font-medium shadow hover:bg-indigo-500">
                <Plus className="w-4 h-4" />
                New Task
              </button>
              <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-xl">
                <Search className="w-4 h-4 text-gray-500" />
                <input placeholder="Search tasks, projects, people…" className="bg-transparent outline-none ml-2 text-sm w-64" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="https://i.pravatar.cc/64?img=15" alt="avatar" />
              </div>
            </div>
          </div>

          {/* Tabs row */}
          <div className="px-6 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {['Overview', 'Projects', 'Team', 'Workload', 'Reports', 'Reputation'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm border transition shadow-sm ${activeTab === tab ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Progress */}
            <Card title="Overall Progress" subtitle="vs last month">
              <div className="flex items-center gap-6">
                <div className="flex-1 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressLine} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="m" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="v" stroke="#6A5AE0" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center pr-2">
                  <div className="text-3xl font-bold">3.6</div>
                  <div className="flex items-center justify-center gap-1 text-yellow-500">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">team rating</div>
                </div>
              </div>
            </Card>

            {/* Workstream Activity */}
            <Card title="Workstream Activity" subtitle="Created vs Completed">
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workstream}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="created" fill="#e5e7eb" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="completed" fill="#27AE60" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Team Sentiment / Sprint Health gauge */}
            <Card title="Team Sentiment" subtitle="survey this month">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <Donut percent={91} value={'91%'} label="positive" color="#22c55e" />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="font-semibold text-green-600">Superb!</div>
                  <div>Most team members satisfied with current sprint.</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Latest Updates */}
            <Card title="Latest Updates" className="xl:col-span-2">
              <div className="space-y-5">
                {updates.map((u, idx) => (
                  <div key={idx} className="flex gap-3">
                    <img src={u.avatar} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.time}</div>
                        <span className="text-xs text-indigo-600">{u.source}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{u.text}</p>
                      {u.chips?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {u.chips.map((c) => (
                            <span key={c} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                      {u.attachments?.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {u.attachments.map((src, i) => (
                            <img key={i} src={src} className="w-20 h-12 object-cover rounded-lg border" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right column donuts like screenshot */}
            <div className="space-y-6">
              <Card title="Open Tasks" right={<span className="text-xs text-gray-500">New: 5.9k · Returning: 3.1k</span>}>
                <div className="flex items-center justify-between">
                  <Donut percent={72} value={'9,245'} label="open" color="#2563eb" />
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span> New: 5,900
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-300"></span> Returning: 3,145
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Completed Tasks" right={<span className="text-xs text-gray-500">New: 2.6k · Returning: 671</span>}>
                <div className="flex items-center justify-between">
                  <Donut percent={58} value={'3,271'} label="completed" color="#16a34a" />
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span> On time: 2,600
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-300"></span> Late: 671
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card title="Website Traffic" subtitle="(Demo) Velocity & Focus" className="xl:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressLine}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="m" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="v" stroke="#2D9CDB" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl font-bold">26,751</div>
                  <div className="text-xs text-gray-500">Unique sessions (demo)</div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '55%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Direct</span>
                    <span>55%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: '30%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Referrals</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Top Labels" right={<span className="text-xs text-gray-500">this month</span>}>
              <div className="space-y-3">
                {['frontend', 'bug', 'ux', 'documentation', 'infra'].map((tag, i) => (
                  <div key={tag} className="flex items-center justify-between">
                    <a className="text-indigo-600 hover:underline" href="#">
                      {tag}
                    </a>
                    <span className="text-gray-700">{(i + 1) * 1320}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Status distribution like screenshot (donut list) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card title="Task Status Distribution">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPie} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
                      {statusPie.map((e, idx) => (
                        <Cell key={idx} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Project Selector" subtitle="Quick filters">
              <div className="flex items-center gap-3">
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Project Alpha</option>
                  <option>Project Beta</option>
                  <option>Project Gamma</option>
                </select>
                <button className="px-3 py-2 rounded-xl text-sm bg-gray-100 hover:bg-gray-200">Export</button>
              </div>
            </Card>

            <Card title="Notes">
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Standup moved to 10:00 AM this week.</li>
                <li>Design review on Thursday — bring prototypes.</li>
                <li>API rate limit fix deployed to production.</li>
              </ul>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
