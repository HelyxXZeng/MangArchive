import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import "./profile.scss"
import { Avatar, Button, Tab, Tabs } from "@mui/material";

function samePageLinkNavigation(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 || // ignore everything but left-click
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return false;
    }
    return true;
  }
  interface LinkTabProps {
    label?: string;
    href?: string;
    selected?: boolean;
  }
  
  function LinkTab(props: LinkTabProps) {
    return (
      <Tab
        sx={{color:"#FAFCFC"}}
        component="a"
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          // Routing libraries handle this, you can remove the onClick handle when using them.
          if (samePageLinkNavigation(event)) {
            event.preventDefault();
          }
        }}
        aria-current={props.selected && 'page'}
        {...props}
      />
    );
  }

const Profile = () => {
    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>();
    const handleBack=() => navigate(-1);
    const handleOpenProfile=()=>{console.log("open fire!")}
    const handleFollowUser=()=>{console.log("Follow him!")}
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        // event.type can be equal to focus with selectionFollowsFocus.
        if (
          event.type !== 'click' ||
          (event.type === 'click' &&
            samePageLinkNavigation(
              event as React.MouseEvent<HTMLAnchorElement, MouseEvent>,
            ))
        ) {
          setValue(newValue);
        }
      };
    
  const [name, setName] = useState<any>(username);
  const [postcount, setPostcount] = useState(0);
  const [level, setLevel] =useState(3);
  return (
    <div className="profileFrame">
        <div className="main">
            <section className="headernav">
                <button className="backbutton" onClick={handleBack}>
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
                    sx={{width:"128px",height:"128px",border:"4px solid #1F1F1F"}}/>
                    {true? <Button
                        className="textwhite"
                        onClick={handleOpenProfile}
                        variant="contained"
                        sx={{borderRadius:"24px"}}    
                    >Edit Profile</Button>
                    :
                    <Button
                        className={true?"textblack":"textwhite"}
                        onClick={handleFollowUser}
                        variant="contained"
                        sx={{borderRadius:"24px"}}    
                    >{true? "Follow":"Unfollow"}</Button>
                }
                </div>
                <div className="userNameInfo">
                    <div className="userNameChild">
                        <span className="Name">{name}</span>
                        <span className="level">LV <span className="textHighlight">{level}</span></span>
                    </div> 
                    <span className="userName">@{name}</span>
                </div>
                <div className="profileDescrition">
                    <span>崩壊したスターレールの位置</span>
                    <div className="linkNPromotion">
                        <a  href="https://www.pixiv.net/users/66526024" className="link">
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
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                    role="navigation"
                >
                    <LinkTab label="Post" href="profile/test/drafts" />
                    <LinkTab label="Media" href="/trash" />
                    <LinkTab label="Friends" href="/spam" />
                    <LinkTab label="Following Groups" href="/spam" />
                </Tabs>

                </div>
                <div className="postlist">

                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile