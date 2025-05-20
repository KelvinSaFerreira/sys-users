import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userFormData: {
    name: "",
    email: "",
    cpf: "",
    phone: "",
  },
  usersList: [],
  loadingUserData: false,
  errorUserData: false,
  loadingUsersList: false,
  errorUsersList: false,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUserFormData(state, action) {
      const { name, value } = action.payload;
      state.userFormData = {
        ...state.userFormData,
        [name]: value,
      };
    },
    clearUserFormData(state) {
      state.userFormData = { name: "", email: "", cpf: "", phone: "" };
    },
    setUsersList(state, action) {
      state.usersList = action.payload;
    },
    addUser(state, action) {
      state.usersList.push(action.payload);
    },
    removeUser(state, action) {
      state.usersList = state.usersList.filter(
        ({ cpf }) => cpf !== action.payload
      );
    },
  },
});

export const {
  updateUserFormData,
  clearUserFormData,
  setUsersList,
  addUser,
  removeUser,
} = usersSlice.actions;

export default usersSlice.reducer;
