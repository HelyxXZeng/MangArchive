import { useParams } from "react-router-dom";
import Login from "../../components/login/Login";
import Signup from "../../components/signup/Signup";
import "./authpage.scss"

const AuthPage = () => {
  const { action } = useParams<{ action: string }>();

  return (
    <div className="homepage-login">
        <AuthContainer action={action} />
      <img
        className="wallpaper-icon"
        loading="lazy"
        alt=""
        src="/wallpaper/wallpaper_test.jpg"
      />
    </div>
  );
};

export default AuthPage;

const AuthContainer = ({ action }: { action: string }) => {
  return (
    <div className="auth-container">
      {action === "login" && <Login />}
      {action === "signup" && <Signup />}
    </div>
  );
};