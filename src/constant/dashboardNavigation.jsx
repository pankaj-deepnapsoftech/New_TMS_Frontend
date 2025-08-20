import { LayoutDashboard, CheckSquare, Users} from 'lucide-react';
import TaskDashboard from '@pages/Dashboard/Home';
import Department from '@pages/Dashboard/Department';
import Roles from '@pages/Dashboard/Roles';


export const DashbaordNavLinks = [
    {
        label:"Overview",
        value:"/",
        icon:LayoutDashboard,
        component:<TaskDashboard/>
    },

    {
        label:"Users",
        value:"/users",
        icon:Users,
        component:<Users/>
    },
    {
        label:"Department",
        value:"/department",
        icon:CheckSquare,
        component:<Department/>
    },
    {
        label:"Role",
        value:"/role",
        icon:Users,
        component:<Roles/>
    },

]