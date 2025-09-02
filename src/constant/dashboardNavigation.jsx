import { LayoutDashboard, Store, UserCog, BrickWallFire, UserRoundPlus, RefreshCcw, NotebookTabs, Layers } from 'lucide-react';
import TaskDashboard from '@pages/Dashboard/Home';
import Department from '@pages/Dashboard/Department';
import Roles from '@pages/Dashboard/Roles';
import UsersPage from '@pages/Dashboard/UsersPage';
import TicketsPage from '@pages/Dashboard/Ticket';
import Renuals from '@pages/Dashboard/Renuals';
import ImportantNotes from '@pages/Dashboard/ImportantNotes';
import Assets from '@/pages/Dashboard/Assets';

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
  {
    label: 'Assets',
    value: '/assets',
    icon: Layers,
    component: <Assets />,
  },
  {
    label: 'Tickets',
    value: '/ticket',
    icon: BrickWallFire,
    component: <TicketsPage />,
  },
  {
    label: 'Renewals',
    value: '/renuals',
    icon: RefreshCcw,
    component: <Renuals />,
  },
  {
    label: 'Important notes',
    value: '/important',
    icon: NotebookTabs,
    component: <ImportantNotes />,
  },
];
