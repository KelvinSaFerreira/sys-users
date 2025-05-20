import localStorageMiddleware from "./usersMiddleware";

describe("localStorageMiddleware", () => {
  let store, next, action;

  beforeEach(() => {
    store = {
      getState: jest.fn(() => ({
        users: { usersList: [{ id: 1, name: "Maria" }] }
      }))
    };
    next = jest.fn((a) => a);

    jest.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(jest.fn());
    jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(jest.fn());
    jest.spyOn(window.localStorage.__proto__, "removeItem").mockImplementation(jest.fn());
    jest.spyOn(window.localStorage.__proto__, "clear").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("chama next(action) e salva no localStorage para addUser", () => {
    action = { type: "users/addUser" };
    localStorageMiddleware(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "usersList",
      JSON.stringify(store.getState().users.usersList)
    );
  });

  it("chama next(action) e salva no localStorage para removeUser", () => {
    action = { type: "users/removeUser" };
    localStorageMiddleware(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "usersList",
      JSON.stringify(store.getState().users.usersList)
    );
  });

  it("chama next(action) e salva no localStorage para setUsersList", () => {
    action = { type: "users/setUsersList" };
    localStorageMiddleware(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "usersList",
      JSON.stringify(store.getState().users.usersList)
    );
  });

  it("não salva no localStorage para outros tipos de ação", () => {
    action = { type: "users/otherAction" };
    localStorageMiddleware(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("propaga erro do localStorage.setItem", () => {
    action = { type: "users/addUser" };
    localStorage.setItem.mockImplementation(() => { throw new Error("Falha no localStorage"); });
    expect(() => localStorageMiddleware(store)(next)(action)).toThrow("Falha no localStorage");
    expect(next).toHaveBeenCalledWith(action);
  });

  it("propaga erro do store.getState", () => {
    action = { type: "users/addUser" };
    store.getState = jest.fn(() => { throw new Error("Erro no getState"); });
    expect(() => localStorageMiddleware(store)(next)(action)).toThrow("Erro no getState");
    expect(next).toHaveBeenCalledWith(action);
  });
});