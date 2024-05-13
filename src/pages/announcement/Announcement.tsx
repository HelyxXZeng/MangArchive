import { NavLink, useNavigate } from 'react-router-dom';
import './announcement.scss'

const Announcement = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);
  return (
    <div className="announFrame">
      <div className="headernav">
        <button className="backbutton" onClick={handleBack}>
          <img src="/icons/arrow-left.svg" alt="" />
        </button>
        <div className="headerInfo">
          <h2>Announcement</h2>
        </div>
      </div>
      <div className="content">
        <span>Current progress: Make Group, Feed. Improve UI</span>
      </div>
      <div className="nothingmore">
        <span>Nothing more, you could read manga, manhua, manhwa or read post now</span>
        <br />
        <NavLink className={"textblue"} to={"/"}>
          <span><br />Go to Home to read what you want</span>
        </NavLink>
        <br />
        <NavLink className={"textred"} to={"/feed"}>
          <span><br />Or do you want to go to Feed? (Need Login)</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Announcement