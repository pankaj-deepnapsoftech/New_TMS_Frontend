import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetCurrentUserQuery } from './services/Auth.service';
import { useDispatch } from 'react-redux';
import { addUser } from '@store/slice/AuthSlice';

// import sound from "@/soundes/noti.mp3"

const App = () => {

  const { data, isLoading, refetch } = useGetCurrentUserQuery();
  const dispatch = useDispatch();


  useEffect(() => {

    if (data) {
      dispatch(addUser(data?.user))
    } else if (!data) {
      refetch()
    }
  }, [data])

  if (isLoading) {
    return  <div className="p-8 bg-gray-50 min-h-screen">
      <div className="animate-pulse bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-12 bg-gray-100" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-28" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  }

  return (
    <>
      <GoogleOAuthProvider  clientId="YOUR_GOOGLE_CLIENT_ID">
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
