import { NavLink, useLocation } from "react-router-dom";
import "./sideBar.scss";
import { useEffect, useState } from "react";
import useCheckSession from "../../../hooks/session";
import { supabase } from "../../../utils/supabase";

const menu = [
  {
    id: 1,
    title: "MangArchive -",
    listItems: [
      {
        id: 1,
        title: "Home",
        url: "/",
        icon: "/icons/home.svg",
      },
      {
        id: 2,
        title: "Latest",
        url: "/latest",
        icon: "/icons/discover.svg",
      },
      {
        id: 3,
        title: "Advance Search",
        url: "/search",
        icon: "/icons/search.svg",
      },
    ],
  },
  {
    id: 2,
    title: "Social -",
    listItems: [
      {
        id: 1,
        title: "Feed",
        url: "/feed",
        icon: "/icons/feed.svg",
      },
      {
        id: 2,
        title: "Discover",
        url: "/discover",
        icon: "/icons/people.svg",
      },
      {
        id: 3,
        title: "Translation",
        url: "/translation",
        icon: "/icons/translate.svg",
      },
      {
        id: 4,
        title: "Notification",
        url: "/nofitication",
        icon: "/icons/notification.svg",
      },
    ],
  },
  {
    id: 3,
    title: "General -",
    listItems: [
      {
        id: 1,
        title: "Profile",
        url: "/profile/",
        icon: "/icons/profile.svg",
      },
      {
        id: 2,
        title: "Library",
        url: "/libary",
        icon: "/icons/save-2.svg",
      },
      {
        id: 3,
        title: "Recent History",
        url: "/history",
        icon: "/icons/clock.svg",
      },
    ],
  },
  {
    id: 4,
    title: "Other -",
    listItems: [
      {
        id: 1,
        title: "Setting",
        url: "/setting",
        icon: "/icons/gift.svg",
      },
      {
        id: 2,
        title: "Site Policies",
        url: "/policies",
        icon: "/icons/firstline.svg",
      },
      {
        id: 3,
        title: "Announcements",
        url: "/announcement",
        icon: "/icons/lamp-charge.svg",
      },
      {
        id: 4,
        title: "About Us",
        url: "/aboutus",
        icon: "/icons/message-question.svg",
      },
    ],
  },
];

const SideBar = () => {
  const [username, setUsername] = useState(null);
  const session = useCheckSession();
  const location = useLocation(); // Get the current path

  useEffect(() => {
    const fetchUsername = async () => {
      if (session !== null) {
        try {
          const { user } = session;
          if(user){  
            const { data, error } = await supabase
              .from("User")
              .select("username")
              .eq("email", user.email)
              .single();

            if (error) {
              throw error;
            }

            if (data) {
              setUsername(data.username);
            }
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };

    fetchUsername();
  }, [session]);

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <NavLink
              to={listItem.title === "Profile" && username ? `/profile/${username}` : listItem.url}
              className={`listItem ${location.pathname === listItem.url ? 'active' : ''}`}
              key={listItem.id}
              preventScrollReset={true}
            >
              <img src={listItem.icon} alt="" />
              <span className={`listItemTitles ${listItem.title === "Announcements"? 'announ' : ''}`}>{listItem.title}</span>
            </NavLink>
          ))}
        </div>
      ))}
      <div className="footer">
        <hr className="line" />
        <div className="socialIcon">
          <img src="/icons/discord.svg" alt="" />
          <img src="/icons/xtwitter.svg" alt="" />
          <img src="/icons/facebook.svg" alt="" />
          <img src="/icons/reddit.svg" alt="" />
        </div>
        <div className="content">
          <div className="version">v2024.4.24</div>
          <div className="copyright">© MangArchive 2024</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
