import "../../SocialPage/ProfileChild/Friends/friends.scss";
import UserCardLarge from "../../../components/socialComponents/userCardLarge/UserCardLarge";
import { useEffect, useState } from "react";
import useCheckSession from "../../../hooks/session";
import { useParams } from "react-router-dom";
import { fetchGroupMembers } from "../../../api/scocialAPI";
import LoadingWave from "../../../components/loadingWave/LoadingWave";
import { fetchGroupData } from "../../../api/groupApi";

const Friends = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const { groupid } = useParams<{ groupid: string }>();
    const [followingUsers, setFollowingUsers] = useState([]);
    const session = useCheckSession();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (groupid) {
                    var data = await fetchGroupData(groupid);
                    setUserInfo(data);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, [groupid, session]);

    const loadFollowingUsers = async () => {
        try {
            if (userInfo && userInfo.id) {
                const data = await fetchGroupMembers(userInfo.id);
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
            loadFollowingUsers();
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
        <div className="friendListContainer">
            {followingUsers.length > 0 ? (
                followingUsers.map((user, index) => (
                    <UserCardLarge
                        key={index}
                        userID={user}
                        fetchSuggestUser={loadFollowingUsers}
                    />
                ))
            ) : (
                <div className="no-following-users">
                    This user has no following users.
                </div>
            )}
        </div>
    );
};

export default Friends;
