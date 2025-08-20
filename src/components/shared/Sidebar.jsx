import React, { useState } from 'react'
import { LayoutDashboard, CheckSquare, Users, FileText, LogOut, Calendar, MessageSquare } from 'lucide-react';
import { SidebarItem } from '@components/ui/SideItems'
import { useLogoutMutation } from '@/services/Auth.service';
import { useNavigate } from 'react-router-dom';
import { DashbaordNavLinks } from '@/constant/dashboardNavigation';

const Sidebar = () => {

  const [logout, { isLoading }] = useLogoutMutation();

  const navigate = useNavigate();


  const [sidebarOpen, setSidebarOpen] = useState(false); // hover to expand


  const LogoutHandler = async () => {
    try {
      const res = await logout().unwrap();
      console.log(res);
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const isActive = (route) => {
    const path = window.location.pathname;
    return route === path
  }
  return (
    <aside onMouseEnter={() => setSidebarOpen(true)} onMouseLeave={() => setSidebarOpen(false)} className={`group relative z-20 h-full bg-white border-r border-gray-200 shadow-sm transition-[width] duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 grid place-items-center text-white font-bold">T</div>
        {sidebarOpen && <span className="font-semibold">TaskFlow</span>}
      </div>

      {/* Nav Items */}
      <nav className="p-3 space-y-1">

        {DashbaordNavLinks.map((item)=><React.Fragment key={item.value}>
        <SidebarItem icon={item.icon} label={item.label} expanded={sidebarOpen} onClick={()=>navigate(item.value)} active={isActive(item.value)} />
        </React.Fragment>)}
        
        
      </nav>

      {/* Bottom fixed */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 space-y-1 bg-white">
        <SidebarItem icon={LogOut} label="Logout" disabled={isLoading} expanded={sidebarOpen} onClick={() => LogoutHandler()} />
      </div>
    </aside>
  )
}

export default Sidebar