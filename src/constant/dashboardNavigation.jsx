import { LayoutDashboard, Store, UserCog, BrickWallFire, UserRoundPlus } from 'lucide-react';
import TaskDashboard from '@pages/Dashboard/Home';
import Department from '@pages/Dashboard/Department';
import Roles from '@pages/Dashboard/Roles';
import UsersPage from '@pages/Dashboard/UsersPage';
import TicketsPage from '@pages/Dashboard/Ticket';

export const DashbaordNavLinks = [
  {
    label: 'Overview',
    value: '/',
    icon: LayoutDashboard,
    component: <TaskDashboard />,
  },
  {
    label: 'Ticket',
    value: '/ticket',
    icon: BrickWallFire,
    component: <TicketsPage />,
  },
  {
    label: 'Users',
    value: '/users',
    icon: UserRoundPlus,
    component: <UsersPage />,
  },
  {
    label: 'Department',
    value: '/department',
    icon: Store,
    component: <Department />,
  },
  {
    label: 'Role',
    value: '/role',
    icon: UserCog,
    component: <Roles />,
  },
];
