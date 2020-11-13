import React, { useEffect, useRef } from 'react';
import BlogList, { BlogInfo } from './components/BlogList';
import Login from './components/Login';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import UserList, { UserInfo } from './components/UserList';
import { initializeBlogs } from './reducers/blogReducer';
import { initializeUser, logout } from './reducers/userReducer';
import { initializeUsers } from './reducers/usersReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import { useStyles } from './theme';

const App = () => {
  const dispatch = useDispatch();
  const blogFormRef = useRef();
  const user = useSelector((state) => state.currentUser);
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);
  const classes = useStyles();

  const userMatch = useRouteMatch('/users/:id');
  const userInfo = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null;
  const blogMatch = useRouteMatch('/blogs/:id');
  const blogInfo = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null;

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUser());
    dispatch(initializeUsers());
  }, [dispatch]);

  return (
    <div>
      <AppBar position="static">
        <ToolBar>
          <Button
            className={classes.title}
            color="inherit"
            component={Link}
            to="/"
          >
            blogs
          </Button>
          <Box flexGrow={1}>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
          </Box>
          {user ? (
            <div>
              <Box component="span" className={classes.title}>
                {user.name} logged in
              </Box>
              <Button onClick={() => dispatch(logout())} color="inherit">
                logout
              </Button>
            </div>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
        </ToolBar>
      </AppBar>
      <Container>
        <h1>Blogs</h1>
        <Switch>
          <Route path="/users/:id">
            <UserInfo user={userInfo} />
          </Route>
          <Route path="/blogs/:id">
            <Notification />
            <BlogInfo blog={blogInfo} user={user} />
          </Route>
          <Route path="/users">
            <UserList users={users} />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Notification />
            <BlogList />
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm forwardRef={blogFormRef} />
            </Togglable>
          </Route>
        </Switch>
      </Container>
    </div>
  );
};

export default App;
