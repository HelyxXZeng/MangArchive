// import { useEffect, useState } from "react"
// import { Link, Outlet, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
// import "./profile.scss"
// import { Avatar, Button, Tab, Tabs } from "@mui/material";
// import UpdateProfileModal from "../../../components/modal/updateProfileModal/UpdateProfileModal";
// import { supabase } from "../../../utils/supabase";
// import useCheckSession from "../../../hooks/session";



// const Profile = () => {
//   const navigate = useNavigate();

//   const { username } = useParams<{ username: string }>();
//   const session = useCheckSession();
//   const handleBack = () => navigate(-1);
//   const handleFollowUser = () => { console.log("Follow him!") }
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userID, setUserID] = useState(null);

//   useEffect(() => {
//     const fetchUserId = async () => {
//       if (session !== null) {
//         try {
//           const { user } = session;
//           if (user) {
//             let { data, error } = await supabase.rpc("get_user_id_by_email", {
//               p_email: session.user.email,
//             });
//             if (error) console.error(error);
//             else {
//               setUserID(data);
//               console.log("User ID: ", data);
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching username:", error);
//         }
//       }
//     };

//     fetchUserId();
//   }, [session]);
//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         if (userID) {
//           const { data, error } = await supabase.rpc("get_user_info", { this_user_id: userID });
//           console.log(data)
//           if (error) console.error(error);
//         }
//       } catch (error) {

//       }
//     }
//     fetchUserInfo();
//   }, [userID]);
//   // console.log(userID);
//   const handleOpenProfile = () => setIsModalOpen(true);
//   const handleCloseProfile = () => setIsModalOpen(false);
//   const routes = [`/profile/${username}`, `/profile/${username}/media`, `/profile/${username}/friends`, `/profile/${username}/groups`]
//   function useRouteMatch(patterns: readonly string[]) {
//     const { pathname } = useLocation();
//     for (let i = 0; i < patterns.length; i += 1) {
//       const pattern = patterns[i];
//       const possibleMatch = matchPath(pattern, pathname);
//       if (possibleMatch !== null) {
//         return possibleMatch;
//       }
//     }
//     return null;
//   }
//   const routeMatch = useRouteMatch(routes)
//   const currentTab = routeMatch?.pattern?.path;
//   const [name, setName] = useState<any>(username);
//   const [postcount, setPostcount] = useState(0);
//   const [level, setLevel] = useState(3);
//   return (
//     <div className="profileFrame">
//       <div className="main">
//         <section className="headernav">
//           <button className="backbutton" onClick={handleBack} title="back">
//             <img src="/icons/arrow-left.svg" alt="" />
//           </button>
//           <div className="headerInfo">
//             <div className="name">
//               {name}
//             </div>
//             <div className="postCount">
//               {postcount} bài đăng
//             </div>
//           </div>
//         </section>
//         <div className="profileInfoFrame">
//           <img className="background" src="https://cdn.donmai.us/original/ba/da/__robin_honkai_and_1_more_drawn_by_rsef__badad19e219a773536c434f47d03463f.jpg" alt="" />
//           <div className="info">
//             <Avatar
//               className="Avatar"
//               src="https://cdn.donmai.us/original/5f/ea/__firefly_honkai_and_1_more_drawn_by_baba_ba_ba_mb__5feaaa99527187a3db0e437380ec3932.jpg"
//               alt="avatar"
//               sx={{ width: "128px", height: "128px", border: "4px solid #1F1F1F" }} />
//             {true ?
//               <div className="profile">
//                 <Button
//                   className="textwhite"
//                   onClick={handleOpenProfile}
//                   variant="contained"
//                   sx={{ borderRadius: "24px" }}
//                 >Edit Profile</Button>
//                 <UpdateProfileModal open={isModalOpen} handleClose={handleCloseProfile} uid />
//               </div>
//               :
//               <Button
//                 className={true ? "textblack" : "textwhite"}
//                 onClick={handleFollowUser}
//                 variant="contained"
//                 sx={{ borderRadius: "24px" }}
//               >{true ? "Follow" : "Unfollow"}</Button>
//             }
//           </div>
//           <div className="userNameInfo">
//             <div className="userNameChild">
//               <span className="Name">{name}</span>
//               <span className="level">LV<span className="textHighlightBlue">{level}</span></span>
//             </div>
//             <span className="userName">@{name}</span>
//           </div>
//           <div className="profileDescrition">
//             <span>崩壊したスターレールの位置</span>
//             <div className="linkNPromotion">
//               <a href="https://www.pixiv.net/users/66526024" className="link">
//                 <img src="/icons/link.svg" alt="" />
//                 <span>pixiv.net/users/66526024</span>
//               </a>
//               <div className="joinDate">
//                 <img src="/icons/calendar.svg" alt="" />
//                 <span>Joined in <span className="textHighlight">August 2024</span></span>
//               </div>
//             </div>
//             <div className="friendCount">
//               <div className="friends">
//                 <span className="textHighlight">69</span>
//                 <span> Friends</span>
//               </div>
//               <div className="mutural">
//                 <span className="textHighlight">69</span>
//                 <span> Mutural</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="userThings">
//           <div className="optionbar">
//             <Tabs
//               value={currentTab}
//               className="tabstest"
//               aria-label="nav tabs example"
//               role="navigation"
//               scrollButtons="auto"
//               // onChange={handleChange}
//               sx={{
//                 '& .MuiTab-root': {
//                   color: "#E7E9EA",
//                   fontWeight: 700,
//                   fontFamily: '"Lato", sans-serif',
//                   padding: '0 16px',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   minWidth: 80,
//                   maxWidth: 160,
//                 },
//                 '& .MuiTabs-indicator': {
//                   backgroundColor: "#4296cf",
//                 },
//                 '& .Mui-selected': {
//                   color: "#4296cf !important",
//                 }
//               }}
//             >
//               <Tab label="Post" to={`/profile/${username}`} value={`/profile/${username}`} component={Link} />
//               <Tab label="Media" to={`/profile/${username}/media`} value={`/profile/${username}/media`} component={Link} />
//               <Tab label="Friends" to={`/profile/${username}/friends`} value={`/profile/${username}/friends`} component={Link} />
//               <Tab label="Groups" to={`/profile/${username}/groups`} value={`/profile/${username}/groups`} component={Link} />
//             </Tabs>

//           </div>
//           <div className="postlist">
//             <Outlet />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile
import { useEffect, useState } from "react";
import { Link, Outlet, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import "./profile.scss";
import { Avatar, Button, Tab, Tabs } from "@mui/material";
import UpdateProfileModal from "../../../components/modal/updateProfileModal/UpdateProfileModal";
import { supabase } from "../../../utils/supabase";
import useCheckSession from "../../../hooks/session";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userID, setUserID] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [profileImages, setProfileImages] = useState<{ avatar: string, background: string } | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      if (session !== null) {
        try {
          const { user } = session;
          if (user) {
            let { data, error } = await supabase.rpc("get_user_id_by_email", {
              p_email: session.user.email,
            });
            if (error) console.error(error);
            else {
              setUserID(data);
            }
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };

    fetchUserId();
  }, [session]);

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
            setIsCurrentUser(data.email === session?.user?.email);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [username, session]);

  const followUser = async () => {
    try {
      const { data, error } = await supabase.rpc("follow_user", {
        this_user_id: userID,
        follow_user_id: userInfo.id,
      });
      if (error) {
        console.error("Error following user:", error);
      } else {
        setIsFollowed(true);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async () => {
    try {
      const { data, error } = await supabase.rpc("unfollow_user", {
        this_user_id: userID,
        follow_user_id: userInfo.id,
      });
      if (error) {
        console.error("Error unfollowing user:", error);
      } else {
        setIsFollowed(false);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const checkIfFollowed = async () => {
    try {
      const { data, error } = await supabase
        .from("UserFollowing")
        .select("*")
        .eq("user", userID)
        .eq("follow", userInfo.id)
        .single();
  
      if (error && error.code !== 'PGRST116') {
        throw error;
        // console.error("Error checking follow status:", error);
      } else {
        setIsFollowed(!!data);
      }
    } catch (error) {
      throw error;

      // console.error("Error checking follow status:", error);
    }
  };

  useEffect(() => {
    if (userID && userInfo && !isCurrentUser) {
      checkIfFollowed();
    }
  }, [userID, userInfo, isCurrentUser]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        if (userInfo?.id) {
          const { data, error } = await supabase.rpc("get_profile_image", { this_user_id: userInfo.id });
          if (error) console.error(error);
          else {
            if (data[0]) {
              const avatarLink = data[0].avatar_link ? JSON.parse(data[0].avatar_link).publicUrl : "";
              const backgroundLink = data[0].background_link ? JSON.parse(data[0].background_link).publicUrl : "";

              setProfileImages({ avatar: avatarLink || "", background: backgroundLink || "" });
            } else {
              setProfileImages({ avatar: "", background: "" });
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

  const routes = [`/profile/${username}`, `/profile/${username}/media`, `/profile/${username}/friends`, `/profile/${username}/groups`];

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
  const level = Math.floor(userInfo?.level / 100);

  return (
    <div className="profileFrame">
      <div className="main">
        <section className="headernav">
          <button className="backbutton" onClick={handleBack} title="back">
            <img src="/icons/arrow-left.svg" alt="" />
          </button>
          <div className="headerInfo">
            <div className="name">{userInfo?.name || username}</div>
            <div className="postCount">{userInfo?.postcount || 0} bài đăng</div>
          </div>
        </section>
        <div className="profileInfoFrame">
          {profileImages?.background ? (
            <img className="background" src={profileImages?.background} alt="" />
          ) : (
            <div className="backgroundPlaceholder"></div>
          )}
          <div className="info">
            <Avatar
              className="Avatar"
              src={profileImages?.avatar || ""}
              alt="avatar"
              sx={{ width: "128px", height: "128px", border: "4px solid #1F1F1F" }} />
            {isCurrentUser ? (
              <div className="profile">
                <Button
                  className="textwhite"
                  onClick={handleOpenProfile}
                  variant="contained"
                  sx={{ borderRadius: "24px" }}
                >Edit Profile</Button>
                <UpdateProfileModal open={isModalOpen} handleClose={handleCloseProfile} user={userInfo} />
              </div>
            ) : (
              <Button
                className={!isFollowed ? "textblack" : "textwhite"}
                onClick={handleFollowUser}
                variant="contained"
                sx={{ borderRadius: "24px" }}
              >
                {isFollowed ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
          <div className="userNameInfo">
            <div className="userNameChild">
              <span className="Name">{userInfo?.username}</span>
              <span className="level">LV<span className="textHighlightBlue">{level >= 0 ? level : ""}</span></span>
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
                <span>Joined in <span className="textHighlight">{new Date(userInfo?.join_date).toLocaleString('default', { month: 'long', year: 'numeric' })}</span></span>
              </div>
            </div>
            <div className="friendCount">
              <div className="friends">
                <span className="textHighlight">69</span>
                <span> Friends</span>
              </div>
              <div className="mutual">
                <span className="textHighlight">69</span>
                <span> Mutual</span>
              </div>
            </div>
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
                '& .MuiTab-root': {
                  color: "#E7E9EA",
                  fontWeight: 700,
                  fontFamily: '"Lato", sans-serif',
                  padding: '0 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: 80,
                  maxWidth: 160,
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: "#4296cf",
                },
                '& .Mui-selected': {
                  color: "#4296cf !important",
                }
              }}
            >
              <Tab label="Post" to={`/profile/${username}`} value={`/profile/${username}`} component={Link} />
              <Tab label="Media" to={`/profile/${username}/media`} value={`/profile/${username}/media`} component={Link} />
              <Tab label="Friends" to={`/profile/${username}/friends`} value={`/profile/${username}/friends`} component={Link} />
              <Tab label="Groups" to={`/profile/${username}/groups`} value={`/profile/${username}/groups`} component={Link} />
            </Tabs>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
