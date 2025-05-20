import { configureStore } from "@reduxjs/toolkit";
import usersReducer, { setUsersList } from "../features/users/usersSlice";
import { usersApi } from "../services/users";
import localStorageMiddleware from "../features/users/usersMiddleware";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    [usersApi.reducerPath]: usersApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware).concat(localStorageMiddleware),
});

const storedUsers = JSON.parse(localStorage.getItem("usersList") || "[]");
if (storedUsers.length > 0) {
  store.dispatch(setUsersList(storedUsers));
}