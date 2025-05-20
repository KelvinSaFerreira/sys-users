import usersReducer, {
  updateUserFormData,
  clearUserFormData,
  setUsersList,
  addUser,
  removeUser,
} from "./usersSlice";

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

describe("usersSlice", () => {
  it("deve retornar o estado inicial", () => {
    expect(usersReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("updateUserFormData", () => {
    it("deve atualizar um campo específico do formulário", () => {
      const action = updateUserFormData({
        name: "email",
        value: "user@example.com",
      });
      const newState = usersReducer(initialState, action);
      expect(newState.userFormData.email).toBe("user@example.com");
    });

    it("deve manter os outros campos intactos", () => {
      const action = updateUserFormData({ name: "name", value: "João" });
      const newState = usersReducer(initialState, action);
      expect(newState.userFormData.name).toBe("João");
      expect(newState.userFormData.email).toBe("");
    });

    it("deve adicionar um novo campo se ele não existir (comportamento atual do reducer)", () => {
      const action = updateUserFormData({ name: "idade", value: "30" });
      const newState = usersReducer(initialState, action);
      expect(newState.userFormData.idade).toBe("30");
    });

    it("deve permitir atualizar campo com valor undefined", () => {
      const action = updateUserFormData({ name: "email", value: undefined });
      const newState = usersReducer(initialState, action);
      expect(newState.userFormData.email).toBeUndefined();
    });
  });

  describe("clearUserFormData", () => {
    it("deve limpar todos os campos do formulário", () => {
      const filledState = {
        ...initialState,
        userFormData: {
          name: "Maria",
          email: "maria@example.com",
          cpf: "12345678900",
          phone: "11999999999",
        },
      };
      const newState = usersReducer(filledState, clearUserFormData());
      expect(newState.userFormData).toEqual({
        name: "",
        email: "",
        cpf: "",
        phone: "",
      });
    });
    it("deve manter o formulário limpo se já estiver limpo", () => {
      const newState = usersReducer(initialState, clearUserFormData());
      expect(newState.userFormData).toEqual(initialState.userFormData);
    });
  });

  describe("setUsersList", () => {
    it("deve substituir a lista de usuários", () => {
      const newList = [
        { name: "User 1", email: "u1@test.com", cpf: "111", phone: "1111" },
        { name: "User 2", email: "u2@test.com", cpf: "222", phone: "2222" },
      ];
      const newState = usersReducer(initialState, setUsersList(newList));
      expect(newState.usersList).toEqual(newList);
    });

    it("deve aceitar uma lista vazia", () => {
      const newState = usersReducer(
        { ...initialState, usersList: [{ name: "Old", cpf: "000" }] },
        setUsersList([])
      );
      expect(newState.usersList).toEqual([]);
    });

    it("deve definir usersList como null se passado null", () => {
      const newState = usersReducer(initialState, setUsersList(null));
      expect(newState.usersList).toBeNull();
    });
  });

  describe("addUser", () => {
    it("deve adicionar um usuário à lista", () => {
      const user = {
        name: "New",
        email: "n@test.com",
        cpf: "333",
        phone: "3333",
      };
      const newState = usersReducer(initialState, addUser(user));
      expect(newState.usersList).toContainEqual(user);
    });

    it("deve manter usuários existentes", () => {
      const existingUser = { name: "Old", cpf: "000" };
      const userToAdd = { name: "New", cpf: "123" };
      const state = { ...initialState, usersList: [existingUser] };
      const newState = usersReducer(state, addUser(userToAdd));
      expect(newState.usersList).toEqual([existingUser, userToAdd]);
    });
  });

  describe("removeUser", () => {
    it("deve remover um usuário existente com base no CPF", () => {
      const state = {
        ...initialState,
        usersList: [
          { name: "User 1", cpf: "111" },
          { name: "User 2", cpf: "222" },
        ],
      };
      const newState = usersReducer(state, removeUser("111"));
      expect(newState.usersList).toEqual([{ name: "User 2", cpf: "222" }]);
    });

    it("não deve alterar a lista se o CPF não for encontrado", () => {
      const originalList = [
        { name: "User 1", cpf: "111" },
        { name: "User 2", cpf: "222" },
      ];
      const state = { ...initialState, usersList: originalList };
      const newState = usersReducer(state, removeUser("999"));
      expect(newState.usersList).toEqual(originalList);
    });

    it("deve funcionar com lista vazia", () => {
      const newState = usersReducer(initialState, removeUser("123"));
      expect(newState.usersList).toEqual([]);
    });

    it("não deve alterar a lista se o payload for undefined", () => {
      const originalList = [{ name: "User", cpf: "111" }];
      const state = { ...initialState, usersList: originalList };
      const newState = usersReducer(state, removeUser(undefined));
      expect(newState.usersList).toEqual(originalList);
    });
  });
});
