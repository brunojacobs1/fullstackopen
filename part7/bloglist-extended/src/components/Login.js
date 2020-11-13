import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/userReducer';
import { useHistory } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory()

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(
      login({
        username,
        password,
      })
    );
    setUsername('');
    setPassword('');
    history.push('/')
  };

  return (
    <form onSubmit={handleLogin}>
      <p>username</p>
      <div>
        <input
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
        />
      </div>
      <p>password</p>
      <div>
        <input
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default Login;
