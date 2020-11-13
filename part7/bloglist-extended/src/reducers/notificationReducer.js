export const activateNotification = (message, messageType) => {
  return {
    type: 'SET_MESSAGE',
    message,
    messageType,
  };
};

export const removeNotification = () => {
  return {
    type: 'REMOVE',
  };
};

let cancel;

export const setNotification = (message, messageType, timeout) => {
  if (cancel) {
    clearTimeout(cancel);
  }
  return async (dispatch) => {
    dispatch(activateNotification(message, messageType));
    cancel = setTimeout(() => {
      dispatch(removeNotification());
    }, timeout * 1000);
  };
};

const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return {
        message: action.message,
        type: action.messageType,
      };
    case 'REMOVE':
      return null;
    default:
      return state;
  }
};

export default notificationReducer;
