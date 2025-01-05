import { useEffect, useState } from "react";
import {
    Link,
    Outlet,
    matchPath,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import "../../SocialPage/profile/profile.scss";
import { Avatar, Button, IconButton, Tab, Tabs } from "@mui/material";
import { supabase } from "../../../utils/supabase";
import useCheckSession from "../../../hooks/session";
import {
    fetchGroupData,
    fetchProfileCountData, // test
    fetchGroupProfileImages, // test
} from "../../../api/groupApi";
import {
    followGroupById,
    joinGroupById,
    unfollowGroupById,
    unjoinGroupById
} from "../../../api/scocialAPI";
import { phraseImageUrl } from "../../../utils/imageLinkPhraser";
import { useTranslation } from "react-i18next";
import UpdateGroupProfileModal from "../../../components/modal/updateGroupProfileModal/updateGroupProfileModal";
import { fetchUserIdByEmail } from "../../../api/userAPI";

const GroupProfile = () => {
    const navigate = useNavigate();
    const { groupid } = useParams<{ groupid: string }>();
    const session = useCheckSession();
    const handleBack = () => navigate(-1);
    const [isFollowed, setIsFollowed] = useState(false);
    const handleFollowGroup = () => {
        if (isFollowed) {
            unfollowGroup();
        } else {
            followGroup();
        }
    };
    const handleJoinGroup = () => {
        if (isJoined) {
            unjoinGroup();
        } else {
            joinGroup();
        }
    };
    const [userId, setUserId] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [GroupInfo, setGroupInfo] = useState<any>(null);
    const [profileImages, setProfileImages] = useState<{
        avatar: string;
        background: string;
    } | null>(null);
    const [isJoined, setIsJoined] = useState(false);

    const [postCount, setPostCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [memberCount, setMemberCount] = useState(0);
    const { t } = useTranslation("", { keyPrefix: "profile" });

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                if (groupid) {
                    var data = await fetchGroupData(groupid);
                    setGroupInfo(data);
                }
            } catch (error) {
                console.error("Error fetching Group info:", error);
            }
        };

        fetchGroupInfo();
    }, [groupid, session]);

    const followGroup = async () => {
        if (session && session.user) {
            try {
                await followGroupById(userId, GroupInfo.id);
                setIsFollowed(true);
            } catch (error) {
                console.error("Error following Group:", error);
            }
        }
        else {

        }
    };

    const unfollowGroup = async () => {
        if (session && session.user) {
            try {
                await unfollowGroupById(userId, GroupInfo.id);
                setIsFollowed(false);
            } catch (error) {
                console.error("Error unfollowing Group:", error);
            }
        }
        else {

        }
    };

    const joinGroup = async () => {
        if (session && session.user) {
            try {
                await joinGroupById(userId, GroupInfo.id);
                setIsJoined(true);
            } catch (error) {
                console.error("Error following Group:", error);
            }
        }
        else {

        }
    };

    const unjoinGroup = async () => {
        if (session && session.user) {
            try {
                await unjoinGroupById(userId, GroupInfo.id);
                setIsJoined(false);
            } catch (error) {
                console.error("Error following Group:", error);
            }
        }
        else {

        }
    };

    const checkIfFollowed = async () => {
        if (session && session.user) {
            try {
                var thisUserId = await fetchUserIdByEmail(session.user.email);
                setUserId(thisUserId);
                const { data, error } = await supabase
                    .from("GroupFollowing")
                    .select("*")
                    .eq("user", thisUserId)
                    .eq("follow", GroupInfo.id)
                    .single();

                if (error && error.code !== "PGRST116") {
                    throw error;
                    // console.error("Error checking follow status:", error);
                } else {
                    setIsFollowed(!!data);
                }
            } catch (error) {
                throw error;
            }
        }
        else setIsFollowed(false);
    };

    const checkIfJoined = async () => {
        if (session && session.user) {
            try {
                var thisUserId = await fetchUserIdByEmail(session.user.email);
                setUserId(thisUserId);
                const { data, error } = await supabase
                    .from("GroupMembers")
                    .select("*")
                    .eq("user_id", thisUserId)
                    .eq("group_id", GroupInfo.id)
                    .single();

                if (error && error.code !== "PGRST116") {
                    throw error;
                    // console.error("Error checking follow status:", error);
                } else {
                    setIsJoined(!!data);
                }
            } catch (error) {
                throw error;
            }
        }
        else setIsJoined(false);
    };

    useEffect(() => {
        if (groupid && GroupInfo) {
            checkIfFollowed();
            checkIfJoined();
        }
    }, [groupid, GroupInfo]);

    //đếm bài đăng và following
    useEffect(() => {
        const fetchCountData = async () => {
            if (GroupInfo?.id) {
                try {
                    const { postCount, memberCount, followerCount } =
                        await fetchProfileCountData(GroupInfo.id);
                    setPostCount(postCount);
                    setFollowerCount(followerCount);
                    setMemberCount(memberCount);
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                }
            }
        };

        fetchCountData();
    }, [GroupInfo]);

    useEffect(() => {
        const fetchProfileImages = async () => {
            try {
                if (GroupInfo?.id) {
                    const { data, error } = await fetchGroupProfileImages(GroupInfo.id);
                    if (error) console.error(error);
                    else {
                        if (data[0]) {
                            const avatarLink = phraseImageUrl(data[0].avatar_link);
                            const backgroundLink = phraseImageUrl(data[0].background_link);

                            setProfileImages({
                                avatar: avatarLink || "",
                                background: backgroundLink || "",
                            });
                        }
                    }
                } else {
                    setProfileImages({ avatar: "", background: "" });
                }
            } catch (error) {
                console.error("Error fetching profile images:", error);
            }
        };

        fetchProfileImages();
    }, [GroupInfo]);

    useEffect(() => {
        // Reset profile-related states when the GroupId changes
        setGroupInfo(null);
        setProfileImages(null);
    }, [groupid]);

    const handleOpenProfile = () => setIsModalOpen(true);
    const handleCloseProfile = () => setIsModalOpen(false);

    const routes = [
        `/group/${groupid}`,
        `/group/${groupid}/media`,
        `/group/${groupid}/friends`,
        `/group/${groupid}/groups`,
        `/group/${groupid}/grouptranslation`,
    ];

    function GroupouteMatch(patterns: readonly string[]) {
        const { pathname } = useLocation();
        for (let i = 0; i < patterns.length; i += 1) {
            const pattern = patterns[i];
            const possibleMatch = matchPath(pattern, pathname);
            if (possibleMatch !== null) {
                return possibleMatch;
            }
        }
        return null;
    }

    const routeMatch = GroupouteMatch(routes);
    const currentTab = routeMatch?.pattern?.path;
    const level = !isNaN(Math.floor(GroupInfo?.level / 100))
        ? Math.floor(GroupInfo?.level / 100)
        : 0;

    return (
        <div className="profileFrame">
            <div className="main">
                <section className="headernav">
                    <button className="backbutton" onClick={handleBack} title={t("back")}>
                        <img src="/icons/arrow-left.svg" alt="" />
                    </button>
                    <div className="headerInfo">
                        <div className="name">{GroupInfo?.name || groupid}</div>
                        <div className="postCount">
                            {postCount || 0} {t("post", { count: postCount })}
                        </div>
                    </div>
                </section>
                <div className="profileInfoFrame">
                    {profileImages?.background ? (
                        <img
                            className="background"
                            src={profileImages?.background}
                            alt=""
                        />
                    ) : (
                        <div className="backgroundPlaceholder"></div>
                    )}
                    <div className="info">
                        <Avatar
                            className="Avatar"
                            src={profileImages?.avatar || ""}
                            alt="avatar"
                            sx={{
                                width: "128px",
                                height: "128px",
                                border: "4px solid #1F1F1F",
                            }}
                        />
                        <div className="rightOption">
                            {isJoined ? (
                                <div className="profile">
                                    <Button
                                        className="textwhite"
                                        onClick={handleOpenProfile}
                                        variant="contained"
                                        sx={{ borderRadius: "24px" }}
                                    >
                                        {t("editProfile")}
                                    </Button>
                                    <UpdateGroupProfileModal
                                        open={isModalOpen}
                                        handleClose={handleCloseProfile}
                                        group={GroupInfo}
                                    />
                                </div>
                            ) : (
                                <div className="profile">
                                    <Button
                                        className={!isFollowed ? "textblack" : "textwhite"}
                                        onClick={handleFollowGroup}
                                        variant="contained"
                                        sx={{ borderRadius: "24px" }}
                                    >
                                        {isFollowed ? t("unfollow") : t("follow")}
                                    </Button>
                                    <Button
                                        className={"textwhite"}
                                        onClick={handleJoinGroup}
                                        variant="contained"
                                        sx={{ borderRadius: "24px" }}
                                    >
                                        {isJoined ? t("unjoin") : t("join")}
                                    </Button>
                                </div>
                            )}
                            <IconButton
                                className="directMessage"
                                onClick={() => console.log("DM", GroupInfo?.name_id)}
                            >
                                <img src="/icons/direct-message.svg" alt="DM Button" />
                            </IconButton>

                            <IconButton
                                className="more-circle"
                                onClick={() =>
                                    console.log("More about this Group:", GroupInfo?.name_id)
                                }
                            >
                                <img src="/icons/more-circle.svg" alt="DM Button" />
                            </IconButton>
                        </div>
                    </div>
                    <div className="userNameInfo">
                        <div className="userNameChild">
                            <span className="Name">{GroupInfo?.name}</span>
                            <span className="level">
                                {t("level")}
                                <span
                                    className={`textHighlight ${level < 4
                                        ? "bluetext"
                                        : level < 7
                                            ? "yellowtext"
                                            : "redtext"
                                        }`}
                                >
                                    {level}
                                </span>
                            </span>
                        </div>
                        <span className="GroupId">@{GroupInfo?.name_id}</span>
                    </div>
                    <div className="profileDescrition">
                        <span>{GroupInfo?.description}</span>
                        <div className="linkNPromotion">
                            <a href={GroupInfo?.link} className="link">
                                <img src="/icons/link.svg" alt="" />
                                <span>{GroupInfo?.link}</span>
                            </a>
                            <div className="joinDate">
                                <img src="/icons/calendar.svg" alt="" />
                                <span>
                                    {t("joinedIn")}{" "}
                                    <span className="textHighlight">
                                        {new Date(GroupInfo?.created_at).toLocaleString("default", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </span>
                            </div>
                        </div>
                        {memberCount > 0 && (
                            <div className="friendCount">
                                <div className="friends">
                                    <span className="textHighlight">{memberCount}</span>
                                    <span> {t("members", { count: memberCount })}</span>
                                </div>
                            </div>
                        )}
                        {followerCount > 0 && (
                            <div className="friendCount">
                                <div className="mutual">
                                    <span className="textHighlight">{followerCount}</span>
                                    <span> {t("followers")}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="GroupThings">
                    <div className="optionbar">
                        <Tabs
                            value={currentTab}
                            className="tabstest"
                            aria-label="nav tabs example"
                            role="navigation"
                            scrollButtons="auto"
                            sx={{
                                "& .MuiTab-root": {
                                    color: "#E7E9EA",
                                    fontWeight: 700,
                                    fontFamily: '"Lato", sans-serif',
                                    padding: "0 16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minWidth: 80,
                                    maxWidth: 160,
                                },
                                "& .MuiTabs-indicator": {
                                    backgroundColor: "#4296cf",
                                },
                                "& .Mui-selected": {
                                    color: "#4296cf !important",
                                },
                            }}
                        >
                            <Tab
                                label={t("post")}
                                to={`/group/${groupid}`}
                                value={`/group/${groupid}`}
                                component={Link}
                            />
                            <Tab
                                label={t("media")}
                                to={`/group/${groupid}/media`}
                                value={`/group/${groupid}/media`}
                                component={Link}
                            />
                            <Tab
                                label={t("members")}
                                to={`/group/${groupid}/members`}
                                value={`/group/${groupid}/members`}
                                component={Link}
                            />
                            <Tab
                                label={t("translation")}
                                to={`/group/${groupid}/grouptranslation`}
                                value={`/group/${groupid}/grouptranslation`}
                                component={Link}
                            />
                        </Tabs>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default GroupProfile;
