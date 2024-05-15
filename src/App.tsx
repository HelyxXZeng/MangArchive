import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Homepage from './pages/homepage/Homepage';

import "./global-styles/App.scss";
import "./global-styles/Color.scss"
import "./global-styles/Font.scss"
import AuthPage from "./pages/authpage/Authpage";
import HeaderBar from "./components/mainComponents/headerBar/HeaderBar";
import SideBar from "./components/mainComponents/sideBar/SideBar";
import MangaDetails from "./pages/mangadetails/MangaDetails";

function App() {

  const Layout = () => {
    return (
      <div className="main">
        <div className="headerWarper">
          <HeaderBar />
        </div>
        <div className="container">
          <div className="sideBarContainer">
            <SideBar />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
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
