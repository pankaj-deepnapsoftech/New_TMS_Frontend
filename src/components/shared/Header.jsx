import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const notificationRef = useRef(null);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setOpenNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-xl">
            <Search className="w-4 h-4 text-gray-500" />
            <input placeholder="Search tasks, projects, people…" className="bg-transparent outline-none ml-2 text-sm w-64" />
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <button onClick={() => setOpenNotification(!openNotification)} className="relative p-2 rounded-lg hover:bg-gray-100 focus:outline-none">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

    
          {openNotification && (
            <div ref={notificationRef} className="absolute z-50 top-12 right-12 w-80 bg-white border border-gray-200 rounded-lg shadow-xl">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                <li className="p-4 hover:bg-gray-50 transition-all">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">"Design Landing Page"</span>.
                  </p>
                  <span className="text-xs text-gray-400">5 minutes ago</span>
                </li>
                <li className="p-4 hover:bg-gray-50 transition-all">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">"Q3 Marketing Plan"</span> was approved.
                  </p>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </li>
               
              </ul>
              <div className="p-2 text-center border-t">
                <button className="text-sm text-blue-600 hover:underline">View all notifications</button>
              </div>
            </div>
          )}

          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="https://i.pravatar.cc/64?img=15" alt="avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
