import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useCheckSession from './session'; // Ensure the correct path to the session hook
import { Button } from '@mui/material';
import './protectRouter.scss';

const ProtectedRoute = ({ children }) => {
  const session = useCheckSession();
  const navigate = useNavigate();
  // console.log(session)
  if (session === null) {
    return (
      <div className='protectContainer'>
        <span>You must login or sign up to use this feature</span>
        <Button className="logIn" onClick={() => navigate('/auth/login')}>Login</Button>
        <Button className='signUp' onClick={() => navigate('/auth/signup')}>Sign Up</Button>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
