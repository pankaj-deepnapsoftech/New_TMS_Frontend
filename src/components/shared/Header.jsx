import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import { useGetNotificationQuery, useUpdatedStatusMutation } from '@/services/Notification.service';
import { socket } from '@/Socket';
import { useSelector } from 'react-redux';



const Header = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const notificationRef = useRef(null);
  const { data } = useGetNotificationQuery()
  const [updatedNotification] = useUpdatedStatusMutation()
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const currentUser = useSelector((state) => state.Auth.user);
  
 
  useEffect(() => {
    socket.connect();

    const handleNewNotification = (newNotification) => {

      console.log("new notification", newNotification)
      if (newNotification.creator?._id !== currentUser?._id ) {
        setNotifications((prev) => [newNotification, ...prev]);
        setHasNewNotification(true);
      }
    };

    socket.on("notification", handleNewNotification);
    
    return () => {
      socket.off("notification", handleNewNotification);
      socket.off("connect");
      socket.disconnect();
    };
  }, []);



  useEffect(() => {
    if (data?.data) {
      setNotifications(data.data);
    }
  }, [data]);

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
          <button
            onClick={() => {
              setOpenNotification(!openNotification);
              setHasNewNotification(false);
            }}
            className="relative p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          >
            <Bell className="w-5 h-5 text-gray-600" />

            {hasNewNotification && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>



          {openNotification && (
            <div ref={notificationRef} className="absolute z-50 top-12 right-12 w-80 bg-white border border-gray-200 rounded-lg shadow-xl">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li
                      key={notification._id}
                      className={`p-4 flex justify-between items-center hover:bg-gray-50 transition-all ${notification.status === 'unread' ? 'bg-gray-100' : ''
                        }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">
                          <span className="font-normal">{notification.title}</span>: {notification.message}
                        </p>
                        <p className="text-xs font-normal text-gray-500">
                          Assigned By: <span className="font-normal">{notification.creator?.full_name || 'N/A'}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          Status: <span className={`${notification.status === 'unread' ? 'text-red-600' : 'text-green-600'}`}>
                            {notification.status}
                          </span>
                        </p>
                        <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                      {notification.status === 'unread' && (
                        <button
                          className="text-xs text-blue-600 ml-4 hover:underline whitespace-nowrap cursor-pointer"
                          onClick={() => {
                            updatedNotification({ id: notification._id, status: 'read' });
                            setNotifications((prev) =>
                              prev.map((n) => (n._id === notification._id ? { ...n, status: 'read' } : n))
                            );
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                    </li>


                  ))
                ) : (
                  <li className="p-4 text-sm text-gray-500">No notifications</li>
                )}
              </ul>


              <div className="p-2 text-center border-t border-gray-200">
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
