import React from "react";

const Notification = ({ message, type }) => {
  switch (type) {
    case "error":
      return <div className="error">{message}</div>;
    case "success":
      return <div className="success">{message}</div>;
    default:
      return null;
  }
};

export default Notification;
