import loginService from '../services/login';
import blogService from '../services/blogs';
import { setNotification } from './notificationReducer';

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      dispatch({
        type: 'INIT_USER',
        data: user,
      });
    }
  };
};

export const login = (userObject) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(userObject);
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch({
        type: 'LOGIN',
        data: user,
      });
    } catch (exception) {
      console.log(exception);
      dispatch(setNotification('Wrong username or password', 'error', 6));
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.clear();
    dispatch({
      type: 'LOGOUT',
    });
  };
};

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'INIT_USER':
      return action.data;
    case 'LOGIN':
      return action.data;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

export default userReducer;
