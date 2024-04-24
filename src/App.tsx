import { createBrowserRouter, RouterProvider, Route, Outlet } from "react-router-dom";
import Homepage from './pages/homepage/Homepage';

import "./App.css";
import AuthPage from "./pages/authpage/Authpage";

function App() {

  // const Layout = () => {
  //   return (
  //     // đang tạo
  //   );
  // }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
      children: []
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
