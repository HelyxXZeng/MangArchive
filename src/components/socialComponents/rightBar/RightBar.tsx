import { NavLink } from "react-router-dom";
import UserCardSmall from "../userCardSmall/UserCardSmall";
import "./rightBar.scss";

const RightBar = () => {
  return (
    <div className="rightBarContainer">
      <div className="sugesstCard">
        <h1>Who to follow</h1>
        {[1, 1, 1].map((_,index) => (
          <UserCardSmall key={index}/>
        ))}
        <NavLink to="/i/connect_people" className="seeMoreLink">
          See more
        </NavLink>
      </div>
      <div className="sugesstCard">
        <h1>Translation groups</h1>
        {[1, 1, 1].map((_,index) => (
          <UserCardSmall key={index}/>
        ))}
        <NavLink to="/i/connect_group" className="seeMoreLink">
          See more
        </NavLink>
      </div>
      <div className="trend"></div>
    </div>
  );
};

export default RightBar;
