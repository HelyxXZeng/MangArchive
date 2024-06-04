import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Homepage from './pages/homepage/Homepage';

import "./global-styles/App.scss";
import "./global-styles/Color.scss"
import "./global-styles/Font.scss"
import AuthPage from "./pages/authpage/Authpage";
import HeaderBar from "./components/mainComponents/headerBar/HeaderBar";
import SideBar from "./components/mainComponents/sideBar/SideBar";
import Profile from "./pages/SocialPage/profile/Profile";
import RightBar from "./components/socialComponents/rightBar/RightBar";
import RulePage from "./pages/Policies/Policies";
import AboutUs from "./pages/aboutus/AboutUs";
import Announcement from "./pages/announcement/Announcement";
import Post from "./pages/SocialPage/ProfileChild/Post/Post";
import Media from "./pages/SocialPage/ProfileChild/Media/Media";
import Setting from "./pages/setting/Setting";
import MangaDetails from "./pages/mangadetails/MangaDetails";
import Friends from "./pages/SocialPage/ProfileChild/Friends/Friends";
import Groups from "./pages/SocialPage/ProfileChild/Groups/Groups";
import Feed from "./pages/SocialPage/feed/Feed";
import SearchMangaPage from "./pages/searchmangapage/SearchMangaPage";
import ReadChapter from "./pages/readchapter/ReadChapter";
import ScrollToTop from "./hooks/useScrollToTop";
import Discorver from "./pages/SocialPage/discorver/Discorver";
import PostDetail from "./pages/SocialPage/postDetail/PostDetail";

function App() {

  const Layout = () => {
    return (
      <>
        <ScrollToTop />
        <div className="main">

          <div className="headerWarper">
            <HeaderBar />
          </div>
          <div className="container">
            <div className="sideBarContainer customScrollbar">
              <SideBar />
            </div>
            <div className="contentContainer customScrollbar">
              <Outlet />
            </div>
          </div>
        </div>
      </>
    );
  }

  const SocialLayout = () => {
    return (
      <div className="socialMain">
        <ScrollToTop />
        <div className="masterFrame">
          <Outlet />
        </div>
        <div className="suggestRightbar">
          <RightBar />
        </div>
      </div>
    );
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Homepage />
        },
        {
          path: "/manga/:manga_id",
          element: <MangaDetails />,
          children: []
        },
        {
          path: "/search",
          element: <SearchMangaPage />,
          children: []
        },
        {
          path: "/chapter/:chapter_id",
          element: <ReadChapter />,
          children: []
        },
        {
          path:"/latest",
          element:<AboutUs/>,
        },
        {
          path:"/libary",
          element:<AboutUs/>,
        },
        {
          path:"/history",
          element:<AboutUs/>,
        },
        {
          path:"/translation",
          element:<AboutUs/>,
        },
        {
          path: "/",
          element: <SocialLayout />,
          children: [
            {
              path: "profile/:username",
              element: <Profile />,
              children: [
                {
                  path: "",
                  element: <Post />
                },
                {
                  path: "media",
                  element: <Media />
                },
                {
                  path: "friends",
                  element: <Friends />
                },
                {
                  path: "groups",
                  element: <Groups />
                }
              ]
            },
            {
              path: "feed",
              element: <Feed />
            },
            {
              path: "discover/",
              element: <Discorver />
            }
          ]
        },
        {
          path:"/profile/:username/post/:id",
          element: <PostDetail/>
        },
        {
          path: "/policies",
          element: <RulePage />
        },
        {
          path: "/aboutus",
          element: <AboutUs />
        },
        {
          path: "/announcement",
          element: <Announcement />
        },
        {
          path: "/setting",
          element: <Setting />
        }
      ]
    },
    {
      path: "/auth/:action",
      element: <AuthPage />,
      children: []
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
