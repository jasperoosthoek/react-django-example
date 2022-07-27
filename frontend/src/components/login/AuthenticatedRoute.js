import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../shared/Login';

// https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5
const AuthenticatedRoute = ({ component: Component, dispatch, ...restProps }) => {
  const params = useParams();
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Component {...params} {...restProps} /> : <Navigate to='/login' />;
}
export default AuthenticatedRoute;
