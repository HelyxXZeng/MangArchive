import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase'; // Import supabase instance
import useCheckSession from './session';

const useUsername = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const session = useCheckSession();
      if (session !== null) {
        try {
          const { user } = session;
          const { data, error } = await supabase
                .from('User')
                .select('username')
                .eq('email', user.email)
                .single();
          if (error) {
            throw error;
          }
          console.log(data)
          if (data) {
            setUsername(data.username);
          }
          else throw new Error("No userdata found")
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
    };

    fetchUsername();
  }, []);

  return username;
};

export default useUsername;
