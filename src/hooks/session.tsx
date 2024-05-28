import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; // Import supabaseClient từ file khác

const useCheckSession = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionListener = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // Kiểm tra phiên đăng nhập khi component unmount
    return () => {
      sessionListener.data.subscription.unsubscribe();
    };
  }, []);

  return session;
};

export default useCheckSession;
