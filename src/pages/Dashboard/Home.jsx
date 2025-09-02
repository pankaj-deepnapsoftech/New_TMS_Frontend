/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@components/ui/DashboardCards';
import { Donut } from '@components/charts/DonutChart';
import { useGetAdminTicketcardDataQuery } from '@/services/Ticket.service';
import { CardsDataa, StatusPie } from '@/constant/dynomicData';
import { useSelector } from 'react-redux';
import { useGetCardsDataQuery, useGetCompletedTasksQuery, useGetOpenTasksQuery, useGetOverdueTicketsQuery, useGetTicketOverviewQuery, useGetUserDataQuery, useGetWorkstreamActivityQuery } from '@/services/Dashboard.services';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useGetAssigneUserQuery } from '@/services/Users.service';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '@/components/Loading/Loading';

// --- Main Dashboard ---
export default function TaskDashboard() {
  const [selectedUser, setSelectedUser] = useState('');

  const navigate = useNavigate();

  const { data: AdminCarddata, isLoading: adminCardDataload, refetch } = useGetAdminTicketcardDataQuery();
  const user = useSelector((state) => state.Auth.user);

  const { data: TicketOverviews, isLoading: TicketOverviewLoad, refetch: TicketOverviewRefetch } = useGetTicketOverviewQuery();

  const { data: WorkstreamActivity, isLoading: WorkstreamActivityLoad, refetch: WorkstreamActivityRefetch } = useGetWorkstreamActivityQuery();

  const { data: OpenTasks, isLoading: OpenTasksLoad, refetch: OpenTasksRefetch } = useGetOpenTasksQuery();

  const { data: CompletedTasks, isLoading: CompletedTasksLoad, refetch: CompletedTasksRefetch } = useGetCompletedTasksQuery();

  const { data: CardsData, isLoading: CardsDataLoad, refetch: CardsDataRefetch } = useGetCardsDataQuery();

  const { data: UserData, isLoading: UserDataLoad, refetch: UserDataRefetch, error } = useGetUserDataQuery(selectedUser);

  const { data: AllUserData, isloading: AllUsersDataLoading, refetch: GetAllUsersAgaian } = useGetAssigneUserQuery();

  const { data: OverdueTickets, isLoading: OverdueTicketsLoad, refetch: OverdueTicketsRefetch } = useGetOverdueTicketsQuery();

  const STATUS_COLORS = ['#6A5AE0', '#27AE60', '#F5A623', '#2D9CDB'];

  const handlePercentage = (data) => {
    const total = data.reduce((i, r) => i + r.count, 0);
    const notStarted = data.find((item) => item._id === 'Not Started')?.count;
    const percentage = (notStarted * 100) / total;
    return percentage.toFixed();
  };

  useEffect(() => {
    if (user) {
      refetch();
      TicketOverviewRefetch();
      WorkstreamActivityRefetch();
      OpenTasksRefetch();
      CompletedTasksRefetch();
      CardsDataRefetch();
      UserDataRefetch();
      GetAllUsersAgaian();
      OverdueTicketsRefetch();
    }
  }, [user, refetch]);

  // if (TicketOverviewLoad || WorkstreamActivityLoad || OpenTasksLoad || CompletedTasksLoad || CardsDataLoad || UserDataLoad || AllUsersDataLoading || OverdueTicketsLoad) {
  //   return <LoadingPage/>
  // }

  return (
    <main className="flex-1  px-6 py-6 space-y-6">
      {/* // ------------- Cards ------------- // */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CardsDataa(CardsData?.data).map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
            onClick={() => navigate(card.path)}
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
        <Card title="Ticket Activity" subtitle="Created vs Completed">
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

        <Card title="Open Tasks">
          <div className="flex items-center justify-between">
            <Donut percent={handlePercentage(OpenTasks?.data || [])} value={OpenTasks?.data?.reduce((i, r) => i + r.count, 0)} label="open" color="#2563eb" />
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span> Not Started: {OpenTasks?.data?.find((item) => item?._id === 'Not Started')?.count}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-300"></span> Re Open: {OpenTasks?.data?.find((item) => item?._id === 'Re Open')?.count}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Latest Updates */}
        <Card title="Latest Updates" className="xl:col-span-2">
          <div className="space-y-6">
            {/* Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
              <select value={selectedUser || ''} onChange={(e) => setSelectedUser(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                <option value="">-- Choose User --</option>
                {AllUserData?.data?.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u?.full_name} ({u?.username})
                  </option>
                ))}
              </select>
            </div>

            {/* User Task Details */}
            {selectedUser && (
              <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition duration-200">
                {UserDataLoad ? (
                  <p className="text-gray-500 text-center">Loading...</p>
                ) : error ? (
                  <p className="text-red-500 text-center">Failed to load data</p>
                ) : UserData?.data?.length === 0 ? (
                  <p className="text-gray-500 text-center">No tasks found</p>
                ) : (
                  <div className="max-h-72 overflow-y-auto pr-2 space-y-4">
                    {UserData?.data?.map((task) => (
                      <div key={task._id} className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition">
                        <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description || 'No description'}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(task.due_date).toLocaleString()}</p>
                        <p className={`mt-2 text-sm font-medium ${task.status?.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>Status: {task.status?.status}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Right column donuts */}
        <div className="space-y-6">
          <Card title="Completed Tasks">
            <div className="flex items-center justify-between">
              <Donut percent={(CompletedTasks?.overdueCompleted * 100) / CompletedTasks?.totalCompleted} value={CompletedTasks?.totalCompleted} label="completed" color="#16a34a" />
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span> Completed: {CompletedTasks?.totalCompleted}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-gray-300"></span> Overdue: {CompletedTasks?.overdueCompleted}
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

      {/* Status distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {adminCardDataload ? <div className='flex-1'  >loading....</div> : <Card title="Task Status Distribution">
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
        </Card>}
        <Card title="Overdue Tickets">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'Overdue', value: OverdueTickets?.overdureTicket || 0 }]} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  <Cell fill={STATUS_COLORS[0]} />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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
