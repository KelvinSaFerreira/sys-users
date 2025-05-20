const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (["users/addUser", "users/removeUser", "users/setUsersList"].includes(action.type)) {
    try {
      const state = store.getState();
      localStorage.setItem("usersList", JSON.stringify(state.users.usersList));
    } catch (e) {
      throw e;
    }
  }

  return result;
};

export default localStorageMiddleware;
