import { useState } from "react"
import { Link, Outlet, matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import "./profile.scss"
import { Avatar, Button, Tab, Tabs } from "@mui/material";



const Profile = () => {
  const navigate = useNavigate();

  const { username } = useParams<{ username: string }>();
  
  const handleBack = () => navigate(-1);
  const handleOpenProfile = () => { console.log("open fire!") }
  const handleFollowUser = () => { console.log("Follow him!") }
  
  const routes = [`/profile/${username}`,`/profile/${username}/media`,`/profile/${username}/friends`,`/profile/${username}/groups`]
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
  const routeMatch = useRouteMatch(routes)
  const currentTab = routeMatch?.pattern?.path;
  const [name, setName] = useState<any>(username);
  const [postcount, setPostcount] = useState(0);
  const [level, setLevel] = useState(3);
  return (
    <div className="profileFrame">
      <div className="main">
        <section className="headernav">
          <button className="backbutton" onClick={handleBack} title="back">
            <img src="/icons/arrow-left.svg" alt="" />
          </button>
          <div className="headerInfo">
            <div className="name">
              {name}
            </div>
            <div className="postCount">
              {postcount} bài đăng
            </div>
          </div>
        </section>
        <div className="profileInfoFrame">
          <img className="background" src="https://cdn.donmai.us/original/ba/da/__robin_honkai_and_1_more_drawn_by_rsef__badad19e219a773536c434f47d03463f.jpg" alt="" />
          <div className="info">
            <Avatar
              className="Avatar"
              src="https://cdn.donmai.us/original/5f/ea/__firefly_honkai_and_1_more_drawn_by_baba_ba_ba_mb__5feaaa99527187a3db0e437380ec3932.jpg"
              alt="avatar"
              sx={{ width: "128px", height: "128px", border: "4px solid #1F1F1F" }} />
            {true ? <Button
              className="textwhite"
              onClick={handleOpenProfile}
              variant="contained"
              sx={{ borderRadius: "24px" }}
            >Edit Profile</Button>
              :
              <Button
                className={true ? "textblack" : "textwhite"}
                onClick={handleFollowUser}
                variant="contained"
                sx={{ borderRadius: "24px" }}
              >{true ? "Follow" : "Unfollow"}</Button>
            }
          </div>
          <div className="userNameInfo">
            <div className="userNameChild">
              <span className="Name">{name}</span>
              <span className="level">LV<span className="textHighlightBlue">{level}</span></span>
            </div>
            <span className="userName">@{name}</span>
          </div>
          <div className="profileDescrition">
            <span>崩壊したスターレールの位置</span>
            <div className="linkNPromotion">
              <a href="https://www.pixiv.net/users/66526024" className="link">
                <img src="/icons/link.svg" alt="" />
                <span>pixiv.net/users/66526024</span>
              </a>
              <div className="joinDate">
                <img src="/icons/calendar.svg" alt="" />
                <span>Joined in <span className="textHighlight">August 2024</span></span>
              </div>
            </div>
            <div className="friendCount">
              <div className="friends">
                <span className="textHighlight">69</span>
                <span> Friends</span>
              </div>
              <div className="mutural">
                <span className="textHighlight">69</span>
                <span> Mutural</span>
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
              // onChange={handleChange}
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
              <Tab label="Post" to={`/profile/${username}`} value={`/profile/${username}`} component={Link}/>
              <Tab label="Media" to={`/profile/${username}/media`} value={`/profile/${username}/media`} component={Link}/>
              <Tab label="Friends" to={`/profile/${username}/friends`} value={`/profile/${username}/friends`} component={Link}/>
              <Tab label="Groups" to={`/profile/${username}/groups`} value={`/profile/${username}/groups`} component={Link}/>
            </Tabs>

          </div>
          <div className="postlist">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile