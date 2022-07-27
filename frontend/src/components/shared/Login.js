import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginFactory } from './ReactToolbox';
import { toastOnError } from '../../utils/Utils';
import axios from '../../utils/Axios';

export const {
  // Login component
  Login,
  useAuth,
  authReducer,
  // Hook to get all redux actions that can be directly dispatched by calling them
  useLogin,
  // All redux actions that require dispatch
  login,
  getCurrentUser,
  setCurrentUser,
  setToken,
  unsetCurrentUser,
  logout,
} = loginFactory({
  passwordResetUrl: `${axios.defaults.baseURL}/accounts/password/reset/`,
  authenticatedComponent: () => <Navigate to='/' />,
  axios: axios,
  onError: toastOnError,
  onLogout: () => toast.success('Logout successful.'),
  loginUrl: '/api/token/login/',
  getUserUrl: '/api/users/me/',
  logoutUrl: '/api/token/logout/',
  localStoragePrefix: 'proefritaanhuis',
})