import { createBrowserRouter, RouterProvider, Route, Outlet } from "react-router-dom";
import Homepage from './pages/homepage/homepage';
import Login from './pages/authpage/Authpage';
import Signup from './components/signup/Signup';
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
