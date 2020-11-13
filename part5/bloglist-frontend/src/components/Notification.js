/* eslint-disable indent */
import React from 'react';

const Notification = ({ message, type }) => {
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

  switch (type) {
    case 'error':
      return <div style={errorStyle}>{message}</div>;
    case 'success':
      return <div style={successStyle}>{message}</div>;
    default:
      return null;
  }
};

export default Notification;
