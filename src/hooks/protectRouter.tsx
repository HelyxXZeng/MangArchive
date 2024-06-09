import './protectRouter.scss';
import { Outlet, useNavigate } from 'react-router-dom';
import useCheckSession from './session'; // Đảm bảo đường dẫn tới hook đúng
import { Button } from '@mui/material';

const ProtectedRoute = (children:any) => {
  const session = useCheckSession();
  const navigate = useNavigate();
  return (
    session === null ? (
      <div className='protectContainer'>
        <span>You must login or sign up to use this feature</span>
        <Button className="logIn" onClick={() => navigate('/auth/login')}>Login</Button>
        <Button className='signUp' onClick={() => navigate('/auth/signup')}>Sign Up</Button>
      </div>
    ) : (
      <Outlet />
    )
  );
};

export default ProtectedRoute;
