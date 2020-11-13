const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return action.message;
    case 'REMOVE':
      return null;
    default:
      return state;
  }
};

var cancel;

export const setNotification = (message, timeout) => {
  if (cancel) {
    clearTimeout(cancel);
  }
  return async (dispatch) => {
    dispatch(activateNotification(message));
    cancel = setTimeout(() => {
      dispatch(removeNotification());
    }, timeout * 1000);
  };
};

export const activateNotification = (message) => {
  return {
    type: 'SET_MESSAGE',
    message,
  };
};

export const removeNotification = () => {
  return {
    type: 'REMOVE',
  };
};

export default notificationReducer;
