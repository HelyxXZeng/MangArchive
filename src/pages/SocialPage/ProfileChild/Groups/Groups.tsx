import "./Groups.scss"
import UserCardLarge from '../../../../components/socialComponents/userCardLarge/UserCardLarge'
import { useEffect, useState } from "react";
import useCheckSession from "../../../../hooks/session";
import { supabase } from "../../../../utils/supabase";
import { useParams } from "react-router-dom";
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

    const fetchFollowingUsers = async () => {
        try {
            if (userInfo && userInfo.id) {
                const { data, error } = await supabase.rpc("get_follow_group", {
                    this_user_id: userInfo?.id,
                });
                if (error) console.error(error);
                else {
                    setFollowingUsers(data);
                    // console.log(data)
                }
            }
        } catch (error) {
            console.error("Error fetching following users:", error);
        }finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchFollowingUsers();
    }, [userInfo])
    if (isLoading) {
        return <div>Loading...</div>;
      }
    return (
        <div className="groupListContainer">
            {followingUsers.length > 0 ? (
                followingUsers.map((user, index) => (
                    <UserCardLarge
                        key={index}
                        userID={user}
                        fetchSuggestUser={fetchFollowingUsers}
                    />
                ))
            ) : (
                <div className="no-following-users">
                    This user has no following users.
                </div>
            )}
        </div>
    );
}


export default Groups