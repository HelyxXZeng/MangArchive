import { Link } from "react-router-dom"
import "./sideBar.scss"
const menu = [
    {
        id: 1,
        title:"MangArchive -",
        listItems: [
            {
                id:1,
                title:"Home",
                url:"/",
                icon:"/icons/home.svg",
            },
            {
                id:2,
                title:"Latest",
                url:"/latest",
                icon:"/icons/discover.svg",
            },
            {
                id:3,
                title:"Advance Search",
                url:"/auth/login",
                icon:"/icons/search.svg",
            },
        ]
    },
    {
        id: 2,
        title:"Social -",
        listItems: [
            {
                id:1,
                title:"Feed",
                url:"/",
                icon:"/icons/feed.svg",
            },
            {
                id:2,
                title:"Group",
                url:"/",
                icon:"/icons/people.svg",
            },
            {
                id:3,
                title:"Translation",
                url:"/",
                icon:"/icons/translate.svg",
            },
            {
                id:4,
                title:"Notification",
                url:"/",
                icon:"/icons/notification.svg",
            },
        ]
    },
    {
        id: 3,
        title:"General -",
        listItems: [
            {
                id:1,
                title:"Profile",
                url:"/",
                icon:"/icons/profile.svg",
            },
            {
                id:2,
                title:"Library",
                url:"/",
                icon:"/icons/save-2.svg",
            },
            {
                id:3,
                title:"Recent History",
                url:"/",
                icon:"/icons/clock.svg",
            },
        ]
    },
    {
        id: 4,
        title:"Other -",
        listItems: [
            {
                id:1,
                title:"Setting",
                url:"/",
                icon:"/icons/gift.svg",
            },
            {
                id:2,
                title:"Site Policies",
                url:"/",
                icon:"",
            },
            {
                id:3,
                title:"Announcements",
                url:"/",
                icon:"",
            },
            {
                id:4,
                title:"About Us",
                url:"/",
                icon:"",
            },
        ]
    },
]

const SideBar = () => {
  return (
    <div className="menu">
        {menu.map((item)=>(
            <div className="item" key={item.id}>
                <span className="title">{item.title}</span>
                {item.listItems.map((listItem)=>(
                    <Link to={listItem.url} className="listItem" key={listItem.id}>
                        <img src={listItem.icon} alt="" />
                        <span className="listItemTitles">{listItem.title}</span>
                    </Link>
                ))}
            </div>
        ))}
        <div className="footer">
            <hr className="line" />
            <div className="socialIcon">
                <img src="/vite.svg" alt="" />
                <img src="/vite.svg" alt="" />
                <img src="/vite.svg" alt="" />
                <img src="/vite.svg" alt="" />
            </div>
            <div className="content">
                <div className="version">v2024.4.24</div>
                <div className="copyright">© MangArchive 2024</div>
            </div>
        </div>
    </div>
  )
}

export default SideBar