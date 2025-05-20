import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserForm from "./UserForm";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import usersReducer, {
  updateUserFormData,
  addUser,
} from "../../features/users/usersSlice";

function renderWithStore(store) {
  return render(
    <Provider store={store}>
      <UserForm />
    </Provider>
  );
}

describe("UserForm", () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: { users: usersReducer },
      preloadedState: {
        users: {
          userFormData: { name: "", email: "", cpf: "", phone: "" },
          usersList: [],
          loadingUserData: false,
          errorUserData: false,
        },
      },
    });
    jest.spyOn(store, "dispatch");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza todos os campos e o botão", () => {
    renderWithStore(store);
    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it("dispara updateUserFormData ao digitar nos campos", () => {
    renderWithStore(store);
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { name: "name", value: "Maria" } });
    expect(store.dispatch).toHaveBeenCalledWith(
      updateUserFormData({ name: "name", value: "Maria" })
    );
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { name: "email", value: "maria@ex.com" } });
    expect(store.dispatch).toHaveBeenCalledWith(
      updateUserFormData({ name: "email", value: "maria@ex.com" })
    );
  });

  it("exibe mensagem de erro se o nome tiver menos de 3 caracteres ao blur", () => {
    renderWithStore(store);
    const nameInput = screen.getByLabelText(/Nome completo/i);
    fireEvent.change(nameInput, { target: { name: "name", value: "Ma" } });
    fireEvent.blur(nameInput);
    expect(screen.getByText(/3 caracteres ou mais/i)).toBeInTheDocument();
  });

  it("não permite submit se campos estiverem vazios", () => {
    renderWithStore(store);
    const button = screen.getByRole("button", { name: /Cadastrar/i });
    expect(button).toBeDisabled();
    expect(store.dispatch).not.toHaveBeenCalledWith(addUser(expect.anything()));
  });

  it("não envia se nome for inválido (menos de 3 caracteres)", () => {
    renderWithStore(store);
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { name: "name", value: "Ma" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { name: "email", value: "maria@ex.com" } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { name: "cpf", value: "12345678901" } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { name: "phone", value: "1199999999" } });
    fireEvent.blur(screen.getByLabelText(/Nome completo/i));
    const button = screen.getByRole("button", { name: /Cadastrar/i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/3 caracteres ou mais/i)).toBeInTheDocument();
    expect(store.dispatch).not.toHaveBeenCalledWith(addUser(expect.anything()));
  });

  it("envia o formulário e dispara addUser", async () => {
    renderWithStore(store);
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { name: "name", value: "Maria" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { name: "email", value: "maria@ex.com" } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { name: "cpf", value: "12345678901" } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { name: "phone", value: "1199999999" } });

    fireEvent.submit(screen.getByTestId("user-form"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: addUser.type }));
    });
  });

  it("mostra loading no botão ao submeter", async () => {
    renderWithStore(store);
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { name: "name", value: "Maria" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { name: "email", value: "maria@ex.com" } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { name: "cpf", value: "12345678901" } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { name: "phone", value: "1199999999" } });

    fireEvent.submit(screen.getByTestId("user-form"));
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});