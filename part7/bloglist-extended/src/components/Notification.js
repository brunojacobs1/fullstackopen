import React from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const successStyle = {
    color: 'green',
    background: 'lightgreen',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  const errorStyle = {
    color: 'red',
    background: 'lightpink',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (notification !== null) {
    switch (notification.type) {
      case 'error':
        return <div style={errorStyle}>{notification.message}</div>;
      case 'success':
        return <div style={successStyle}>{notification.message}</div>;
      default:
        return null;
    }
  } else {
    return null;
  }
};

export default Notification;
