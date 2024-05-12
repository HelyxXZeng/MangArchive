import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Homepage from './pages/homepage/Homepage';

import "./global-styles/App.scss";
import "./global-styles/Color.scss"
import "./global-styles/Font.scss"
import AuthPage from "./pages/authpage/Authpage";
import HeaderBar from "./components/mainComponents/headerBar/HeaderBar";
import SideBar from "./components/mainComponents/sideBar/SideBar";
import Profile from "./pages/profile/Profile";
import RightBar from "./components/socialComponents/rightBar/RightBar";
import RulePage from "./pages/Policies/Policies";
import AboutUs from "./pages/aboutus/AboutUs";
import Announcement from "./pages/announcement/Announcement";

function App() {

  const Layout = () => {
    return (
      <div className="main">
        <div className="headerWarper">
          <HeaderBar/>
        </div>
        <div className="container">
          <div className="sideBarContainer customScrollbar">
            <SideBar/>
          </div>
          <div className="contentContainer customScrollbar">
            <Outlet/>
          </div>
        </div>
      </div>
    );
  }

  const SocialLayout = () => {
    return (
      <div className="socialMain">
        <div className="masterFrame">
          {<Outlet/>}
        </div>
        <div className="suggestRightbar">
          <RightBar/>
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
          path:"/",
          element: <Homepage/>
        },
        {
          path:"/",
          element: <SocialLayout/>,
          children: [
            {
              path:"profile/:username",
              element: <Profile/>
            }
          ]
        },
        {
          path:"/policies",
          element:<RulePage/>
        },
        {
          path:"/aboutus",
          element:<AboutUs/>
        },
        {
          path:"/announcement",
          element:<Announcement/>
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
