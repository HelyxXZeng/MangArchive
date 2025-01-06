import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./profile.scss";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import UpdateProfileModal from "../../../components/modal/updateProfileModal/UpdateProfileModal";
import useCheckSession from "../../../hooks/session";
import {
  blockUser,
  checkIsFollowingUser,
  checkIsUserBlocked,
  fetchProfileCountData,
  fetchUserIdByEmail,
  fetchUserInfoByUsername,
  fetchUserProfileImages,
  unblockUser,
} from "../../../api/userAPI";
import { followUserById, unfollowUserById } from "../../../api/scocialAPI";
import { phraseImageUrl } from "../../../utils/imageLinkPhraser";
import { useTranslation } from "react-i18next";
import BlockUserModal from "../../../components/modal/blockUserModal/BlockUserModal";

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const session = useCheckSession();
  const handleBack = () => navigate(-1);
  const [isFollowed, setIsFollowed] = useState(false);
  const handleFollowUser = () => {
    if (isFollowed) {
      unfollowUser();
    } else {
      followUser();
    }
  };
  const [isBlocked, setIsBlocked] = useState(false);
  const handleBlockUser = async () => {
    try {
      if (isBlocked) {
        await unblockUser(userID, userInfo.id);
        setIsBlocked(false);
      } else {
        await blockUser(userID, userInfo.id);
        setIsBlocked(true);
        setIsFollowed(false); // Reset follow state when user is blocked
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userID, setUserID] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<{
    avatar: string;
    background: string;
  } | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [friendCount, setFriendCount] = useState(0);
  const { t } = useTranslation("", { keyPrefix: "profile" });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalType, setModalType] = useState<"block" | "report" | null>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = (type: "block" | "report") => {
    setModalType(type);
    handleMenuClose();
  };

  const handleCloseModal = () => {
    setModalType(null);
  };
  useEffect(() => {
    const getUserID = async () => {
      if (session && session.user) {
        try {
          const userId = await fetchUserIdByEmail(session.user.email);
          setUserID(userId);
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    getUserID();
  }, [session]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (username && session?.user!) {
          const data = await fetchUserInfoByUsername(username);
          setUserInfo(data[0]);
          setIsCurrentUser(data[0].email === session?.user?.email);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [username, session]);

  const followUser = async () => {
    try {
      await followUserById(userID, userInfo.id);
      setIsFollowed(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async () => {
    try {
      await unfollowUserById(userID, userInfo.id);
      setIsFollowed(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    const checkIfBlocked = async () => {
      try {
        const isUserBlocked = await checkIsUserBlocked(userID, userInfo.id);
        setIsBlocked(isUserBlocked);
        // console.log(userInfo.username, isUserBlocked, isBlocked);
      } catch (error) {
        console.error("Error checking block status:", error);
      }
    };
    const checkIfFollowed = async () => {
      try {
        const isFollowing = await checkIsFollowingUser(userID, userInfo.id);
        setIsFollowed(isFollowing);
      } catch (error) {
        throw error;

        // console.error("Error checking follow status:", error);
      }
    };
    if (userID && userInfo && !isCurrentUser) {
      checkIfBlocked();
      // console.log(userID, userInfo, isCurrentUser);
      if (!isBlocked) checkIfFollowed();
    }
  }, [userID, userInfo, isCurrentUser, isBlocked, isFollowed]);

  //đếm bài đăng và following
  useEffect(() => {
    const fetchCountData = async () => {
      if (userInfo?.id) {
        try {
          const { postCount, groupCount, friendCount } =
            await fetchProfileCountData(userInfo.id);
          setPostCount(postCount);
          setGroupCount(groupCount);
          setFriendCount(friendCount);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchCountData();
  }, [userInfo]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        if (userInfo?.id) {
          const { data, error } = await fetchUserProfileImages(userInfo.id);
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
  }, [userInfo]);

  useEffect(() => {
    // Reset profile-related states when the username changes
    setUserInfo(null);
    setProfileImages(null);
    setIsCurrentUser(false);
  }, [username]);

  const handleOpenProfile = () => setIsModalOpen(true);
  const handleCloseProfile = () => setIsModalOpen(false);

  const routes = [
    `/profile/${username}`,
    `/profile/${username}/media`,
    `/profile/${username}/friends`,
    `/profile/${username}/groups`,
  ];

  function useRouteMatch(patterns: readonly string[]) {
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

  const routeMatch = useRouteMatch(routes);
  const currentTab = routeMatch?.pattern?.path;
  const level = !isNaN(Math.floor(userInfo?.level / 100))
    ? Math.floor(userInfo?.level / 100)
    : 0;

  return (
    <div className="profileFrame">
      <div className="main">
        <section className="headernav">
          <button className="backbutton" onClick={handleBack} title={t("back")}>
            <img src="/icons/arrow-left.svg" alt="" />
          </button>
          <div className="headerInfo">
            <div className="name">{userInfo?.name || username}</div>
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
            {isCurrentUser ? (
              <div className="profile">
                <Button
                  className="textwhite"
                  onClick={handleOpenProfile}
                  variant="contained"
                  sx={{ borderRadius: "24px" }}
                >
                  {t("editProfile")}
                </Button>
                <UpdateProfileModal
                  open={isModalOpen}
                  handleClose={handleCloseProfile}
                  user={userInfo}
                />
              </div>
            ) : (
              <div className="rightOption">
                {isBlocked ? (
                  <Button
                    className="textred"
                    onClick={handleBlockUser}
                    variant="contained"
                    sx={{ borderRadius: "24px" }}
                  >
                    Unblock
                  </Button>
                ) : (
                  <Button
                    className={!isFollowed ? "textblack" : "textwhite"}
                    onClick={handleFollowUser}
                    variant="contained"
                    sx={{ borderRadius: "24px" }}
                  >
                    {isFollowed ? t("unfollow") : t("follow")}
                  </Button>
                )}

                <IconButton
                  className="directMessage"
                  onClick={() => {
                    navigate(`/chat/${userInfo.id!}`);
                  }}
                >
                  <img src="/icons/direct-message.svg" alt="DM Button" />
                </IconButton>

                <IconButton className="more-circle" onClick={handleMenuOpen}>
                  <img src="/icons/more-circle.svg" alt="DM Button" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor: "#242526", // Màu nền của Menu
                      color: "#e7e9ea", // Màu chữ
                    },
                  }}
                >
                  {!isBlocked && (
                    <MenuItem
                      onClick={() => handleOpenModal("block")}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#3a3b3c", // Màu khi hover
                        },
                      }}
                    >
                      Block User
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => handleOpenModal("report")}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#3a3b3c", // Màu khi hover
                      },
                    }}
                  >
                    Report User
                  </MenuItem>
                </Menu>
                {modalType === "block" && (
                  <BlockUserModal
                    open={true}
                    handleClose={handleCloseModal}
                    currentUID={userID}
                    targetName={username!}
                    targetUID={userInfo.id!}
                    handleBlock={handleBlockUser}
                  />
                )}
              </div>
            )}
          </div>
          <div className="userNameInfo">
            <div className="userNameChild">
              <span className="Name">{userInfo?.username}</span>
              <span className="level">
                {t("level")}
                <span
                  className={`textHighlight ${
                    level < 4
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
            <span className="userName">@{userInfo?.username}</span>
          </div>
          <div className="profileDescrition">
            <span>{userInfo?.bio}</span>
            <div className="linkNPromotion">
              <a href={userInfo?.link} className="link">
                <img src="/icons/link.svg" alt="" />
                <span>{userInfo?.link}</span>
              </a>
              <div className="joinDate">
                <img src="/icons/calendar.svg" alt="" />
                <span>
                  {t("joinedIn")}{" "}
                  <span className="textHighlight">
                    {new Date(userInfo?.join_date).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>
            </div>
            {friendCount > 0 && (
              <div className="friendCount">
                <div className="friends">
                  <span className="textHighlight">{friendCount}</span>
                  <span> {t("friends", { count: friendCount })}</span>
                </div>
              </div>
            )}
            {groupCount > 0 && (
              <div className="friendCount">
                <div className="mutual">
                  <span className="textHighlight">{groupCount}</span>
                  <span> {t("groups")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="userThings">
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
                to={`/profile/${username}`}
                value={`/profile/${username}`}
                component={Link}
              />
              <Tab
                label={t("media")}
                to={`/profile/${username}/media`}
                value={`/profile/${username}/media`}
                component={Link}
              />
              <Tab
                label={t("friends")}
                to={`/profile/${username}/friends`}
                value={`/profile/${username}/friends`}
                component={Link}
              />
              <Tab
                label={t("groups")}
                to={`/profile/${username}/groups`}
                value={`/profile/${username}/groups`}
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

export default Profile;
