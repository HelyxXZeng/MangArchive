import "./groups.scss";
import { useEffect, useState } from "react";
import useCheckSession from "../../../../hooks/session";
import { supabase } from "../../../../utils/supabase";
import { useParams } from "react-router-dom";
import { fetchFollowingGroups } from "../../../../api/scocialAPI";
import LoadingWave from "../../../../components/loadingWave/LoadingWave";
import GroupCardLarge from "../../../../components/socialComponents/group-card-large/GroupCardLarge";
const Groups = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const { username } = useParams<{ username: string }>();
  const [followingUsers, setFollowingUsers] = useState([]);
  const session = useCheckSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (username) {
          const { data, error } = await supabase
            .from("User")
            .select("*")
            .eq("username", username)
            .single();
          if (error) console.error(error);
          else {
            setUserInfo(data);
            // setIsCurrentUser(data.email === session?.user?.email);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [username, session]);

  const loadFollowingGroups = async () => {
    try {
      if (userInfo && userInfo.id) {
        const data = await fetchFollowingGroups(userInfo.id);
        setFollowingUsers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userInfo) {
      loadFollowingGroups();
    }
  }, [userInfo]);
  if (isLoading) {
    return (
      <div className="loading">
        <LoadingWave />
      </div>
    );
  }
  return (
    <div className="groupListContainer">
      {followingUsers.length > 0 ? (
        followingUsers.map((user, index) => (
          <GroupCardLarge
            key={index}
            userID={user}
            fetchSuggestUser={loadFollowingGroups}
          />
        ))
      ) : (
        <div className="no-following-users">
          This user has no following Groups.
        </div>
      )}
    </div>
  );
};

export default Groups;
