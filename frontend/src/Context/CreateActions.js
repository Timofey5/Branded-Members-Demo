const {
  signup,
  clearError,
  login,
  logout,
  autoLogin,
  fetchUsers,
} = require("./AppActions");

export const createActions = (dispatch) => {
  return {
    signup: (userObj) => dispatch(signup(userObj)),
    login: (userObj) => dispatch(login(userObj)),
    logout: () => dispatch(logout),
    clearError: () => dispatch(clearError),
    autoLogin: () => dispatch(autoLogin),
    fetchUsers: (token, sortOrder, gt, lt) =>
      dispatch(fetchUsers(token, sortOrder, gt, lt)),
  };
};
