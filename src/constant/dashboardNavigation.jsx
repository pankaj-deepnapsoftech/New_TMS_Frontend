import { LayoutDashboard, CheckSquare, Users, Store, UserCog } from 'lucide-react';
import TaskDashboard from '@pages/Dashboard/Home';
import Department from '@pages/Dashboard/Department';
import Roles from '@pages/Dashboard/Roles';

export const DashbaordNavLinks = [
  {
    label: 'Overview',
    value: '/',
    icon: LayoutDashboard,
    component: <TaskDashboard />,
  },

  {
    label: 'Users',
    value: '/users',
    icon: Users,
    component: <Users />,
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
