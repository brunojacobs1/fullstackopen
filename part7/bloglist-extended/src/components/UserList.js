import React from 'react';
import { Link } from 'react-router-dom';

const User = ({ user }) => {
  const blogsCreated = user.blogs.length;
  return (
    <tbody>
      <tr>
        <td>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </td>
        <td>{blogsCreated}</td>
      </tr>
    </tbody>
  );
};

export const UserInfo = ({ user }) => {
  if (!user) {
    return null;
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

const UserList = ({ users }) => {
  const rightAlign = {
    textAlign: 'right',
  };

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th style={rightAlign}>blogs created</th>
          </tr>
        </tbody>
        {users.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </table>
    </div>
  );
};

export default UserList;
