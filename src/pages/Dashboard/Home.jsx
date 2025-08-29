/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@components/ui/DashboardCards';
import { Donut } from '@components/charts/DonutChart';
import { useGetAdminTicketcardDataQuery } from '@/services/Ticket.service';
import { StatusPie } from '@/constant/dynomicData';
import { useSelector } from 'react-redux';
import { useGetOpenTasksQuery, useGetTicketOverviewQuery, useGetWorkstreamActivityQuery } from '@/services/Dashboard.services';
import { Users, Briefcase, RefreshCcw, Building2 } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// --- Main Dashboard ---
export default function TaskDashboard() {
  const [selectedProject, setSelectedProject] = useState('Project Alpha');

  const { data: AdminCarddata, isLoading: adminCardDataload, refetch } = useGetAdminTicketcardDataQuery();
  const user = useSelector((state) => state.Auth.user);

  const { data: TicketOverviews, isLoading: TicketOverviewLoad, refetch: TicketOverviewRefetch, error } = useGetTicketOverviewQuery();

  const { data: WorkstreamActivity, isLoading: WorkstreamActivityLoad, refetch: WorkstreamActivityRefetch } = useGetWorkstreamActivityQuery();

  const {data: OpenTasks, isLoading: OpenTasksLoad, refetch: OpenTasksRefetch} = useGetOpenTasksQuery();

  const STATUS_COLORS = ['#6A5AE0', '#27AE60', '#F5A623', '#2D9CDB']; // purple, green, orange, blue

  const cards = [
    {
      title: 'Leads',
      value: '1,245',
      caption: 'this month',
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      bg: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-100',
    },
    {
      title: 'Deals',
      value: '567',
      caption: 'closed',
      icon: <Briefcase className="h-5 w-5 text-green-600" />,
      bg: 'from-green-50 to-white',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Renewals',
      value: '312',
      caption: 'active',
      icon: <RefreshCcw className="h-5 w-5 text-yellow-600" />,
      bg: 'from-yellow-50 to-white',
      iconBg: 'bg-yellow-100',
    },
    {
      title: 'Customers',
      value: '4,829',
      caption: 'total',
      icon: <Building2 className="h-5 w-5 text-pink-600" />,
      bg: 'from-pink-50 to-white',
      iconBg: 'bg-pink-100',
    },
  ];

  // Latest updates (like reviews list)
  const updates = [
    {
      name: 'Deena Timmons',
      time: '5 hours ago',
      source: 'Sprint Board',
      text: 'Moved ‘Marketing site QA’ to Review. Great progress; waiting on copy approval.',
      chips: ['marketing', 'frontend', 'priority:medium'],
    },
    {
      name: 'Sheila Lee',
      time: '2 days ago',
      source: 'Automations',
      text: 'Recurring task ‘Weekly analytics report’ completed and archived.',
      chips: ['reporting', 'data', 'automation'],
      attachments: [],
    },
    {
      name: 'Sarah Doyle',
      time: '5 days ago',
      source: 'Mentions',
      text: '@Sarah marked ‘Mobile onboarding redesign’ as blocked by API changes.',
      chips: ['mobile', 'ux', 'blocked'],
      attachments: [],
    },
  ];
  useEffect(() => {
    if (user) {
      refetch();
      TicketOverviewRefetch();
      WorkstreamActivityRefetch();
      OpenTasksRefetch();
    }
  }, [user, refetch]);

  if (adminCardDataload || TicketOverviewLoad || WorkstreamActivityLoad) {
    return <div>loading.....</div>;
  }

  return (
    <main className="flex-1  px-6 py-6 space-y-6">
      {/* // ------------- Cards ------------- // */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
            className={`p-5 rounded-2xl border border-gray-100 bg-gradient-to-br ${card.bg} transition`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{card.title}</span>
              <div className={`p-2 rounded-xl ${card.iconBg}`}>{card.icon}</div>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-900">{card.value}</div>
            <p className="text-xs text-gray-500 mt-1">{card.caption}</p>
          </motion.div>
        ))}
      </div>
      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <Card title="Ticket Overview" subtitle="vs last month">
          <div className="flex items-center gap-6">
            <div className="flex-1 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TicketOverviews?.data} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="m" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={0} minTickGap={0} className="p-4" />

                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" stroke="#6A5AE0" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Workstream Activity */}
        <Card title="Workstream Activity" subtitle="Created vs Completed">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WorkstreamActivity?.data}>
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

        <Card title="Open Tasks" right={<span className="text-xs text-gray-500">New: 5.9k · Returning: 3.1k</span>}>
          <div className="flex items-center justify-between">
            <Donut percent={OpenTasks?.data?.reduce((i,r)=>i.count + r.count)/(100*OpenTasks?.data?.find((item)=>item._id === "Not Started"))} value={OpenTasks?.data?.reduce((i,r)=>i.count + r.count)} label="open" color="#2563eb" />
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
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Latest Updates */}
        <Card title="Latest Updates" className="xl:col-span-2">
          <div className="space-y-5">
            {updates.map((u, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.time}</div>
                    <span className="text-xs text-sky-600">{u.source}</span>
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

        {/* Right column donuts */}
        <div className="space-y-6">
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
          <Card title="Top Labels" right={<span className="text-xs text-gray-500">this month</span>}>
            <div className="space-y-3">
              {['frontend', 'bug', 'ux', 'documentation', 'infra'].map((tag, i) => (
                <div key={tag} className="flex items-center justify-between">
                  <a className="text-sky-600 hover:underline" href="#">
                    {tag}
                  </a>
                  <span className="text-gray-700">{(i + 1) * 1320}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Status distribution like screenshot (donut list) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card title="Task Status Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={StatusPie(AdminCarddata?.data?.statusCounts)} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {StatusPie(AdminCarddata?.data?.statusCounts).map((e, idx) => (
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
            <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
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
  );
}
