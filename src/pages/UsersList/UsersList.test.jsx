import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UsersList from "./UsersList";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import usersReducer, { removeUser, setUsersList } from "../../features/users/usersSlice";

jest.mock("../../services/users", () => ({
  useGetUsersListQuery: jest.fn(),
}));

const { useGetUsersListQuery } = require("../../services/users");

function renderWithStore(store) {
  return render(
    <Provider store={store}>
      <UsersList />
    </Provider>
  );
}

describe("UsersList", () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      users: {
        usersList: [],
        userFormData: { name: "", email: "", cpf: "", phone: "" },
        loadingUserData: false,
        errorUserData: false,
      },
    };
    store = configureStore({
      reducer: { users: usersReducer },
      preloadedState: initialState,
    });
    jest.spyOn(store, "dispatch");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza colunas da tabela", () => {
    useGetUsersListQuery.mockReturnValue({ data: null, error: null, isLoading: false });
    renderWithStore(store);
    expect(screen.getByText(/Ações/i)).toBeInTheDocument();
    expect(screen.getByText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByText(/Telefone/i)).toBeInTheDocument();
  });

  it("exibe mensagem de carregando quando isLoading é true", () => {
    useGetUsersListQuery.mockReturnValue({ data: null, error: null, isLoading: true });
    renderWithStore(store);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it("dispara setUsersList quando recebe data", () => {
    const data = [
      { name: "Maria", email: "maria@ex.com", cpf: "12345678901", phone: "1199999999" },
    ];
    useGetUsersListQuery.mockReturnValue({ data, error: null, isLoading: false });
    renderWithStore(store);
    expect(store.dispatch).toHaveBeenCalledWith(setUsersList(data));
  });

  it("renderiza usuários formatando CPF e telefone", () => {
    useGetUsersListQuery.mockReturnValue({ data: null, error: null, isLoading: false });
    store = configureStore({
      reducer: { users: usersReducer },
      preloadedState: {
        users: {
          usersList: [
            { name: "Maria", email: "maria@ex.com", cpf: "12345678901", phone: "1199999999" },
          ],
          userFormData: { name: "", email: "", cpf: "", phone: "" },
          loadingUserData: false,
          errorUserData: false,
        },
      },
    });
    renderWithStore(store);
    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.getByText("maria@ex.com")).toBeInTheDocument();
    expect(screen.getByText("123.456.789-01")).toBeInTheDocument();
    expect(screen.getByText("(11) 9999-9999")).toBeInTheDocument();
  });

  it("chama removeUser ao clicar no ícone de deletar", () => {
    useGetUsersListQuery.mockReturnValue({ data: null, error: null, isLoading: false });
    store = configureStore({
      reducer: { users: usersReducer },
      preloadedState: {
        users: {
          usersList: [
            { name: "Maria", email: "maria@ex.com", cpf: "12345678901", phone: "1199999999" },
          ],
          userFormData: { name: "", email: "", cpf: "", phone: "" },
          loadingUserData: false,
          errorUserData: false,
        },
      },
    });
    jest.spyOn(store, "dispatch");
    renderWithStore(store);
    const deleteButton = screen.getByRole("button", { name: /Remover usuário/i });
    fireEvent.click(deleteButton);
    expect(store.dispatch).toHaveBeenCalledWith(removeUser("12345678901"));
  });

  it("não quebra se usersList estiver vazio", () => {
    useGetUsersListQuery.mockReturnValue({ data: null, error: null, isLoading: false });
    renderWithStore(store);
    expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
  });

  it("não quebra se cpf ou phone forem undefined", () => {
    useGetUsersListQuery.mockReturnValue({ data: null, error: null, isLoading: false });
    store = configureStore({
      reducer: { users: usersReducer },
      preloadedState: {
        users: {
          usersList: [
            { name: "João", email: "joao@ex.com", cpf: undefined, phone: undefined },
          ],
          userFormData: { name: "", email: "", cpf: "", phone: "" },
          loadingUserData: false,
          errorUserData: false,
        },
      },
    });
    renderWithStore(store);
    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("joao@ex.com")).toBeInTheDocument();
  });
});