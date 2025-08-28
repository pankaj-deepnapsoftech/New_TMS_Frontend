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
    return <div>
      loading ......
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
