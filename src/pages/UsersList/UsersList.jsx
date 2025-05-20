import React from "react";
import { removeUser, setUsersList } from "../../features/users/usersSlice";
import { useGetUsersListQuery } from "../../services/users";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import style from './UsersList.module.scss';

function UsersList() {
  const usersList = useSelector((state) => state.users.usersList);
  const dispatch = useDispatch()
  const { data, error, isLoading } = useGetUsersListQuery(null, { skip: usersList.length > 0 });

  if (data) {
    dispatch(setUsersList(data))
  }

  const tableColumns = [
    {
      label: "Ações",
      id: "actions",
    },
    {
      label: "Nome",
      id: "name",
    },
    {
      label: "E-mail",
      id: "email",
    },
    {
      label: "CPF",
      id: "cpf",
    },
    {
      label: "Telefone",
      id: "phone",
    },
  ];

  const deleteUser = (userCpf) => {
    dispatch(removeUser(userCpf))
  }

  function formatCPF(cpf) {
    if (!cpf) return "";
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  function formatPhone(phone) {
    if (!phone) return "";
    return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  return (
    <div>
      <table className={style.table}>
        <thead>
          <tr>
            {tableColumns.map((column) => (
              <th key={Math.random()}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={tableColumns.length} style={{ textAlign: "center" }}>
                Carregando...
              </td>
            </tr>
          ) : (
            usersList?.map((user) => (
              <tr key={user.cpf}>
                {tableColumns.map((column) => {
                  let value = user[column.id];
                  if (column.id === "cpf") value = formatCPF(user.cpf);
                  if (column.id === "phone") value = formatPhone(user.phone);
                  return column.id === "actions" ? (
                    <td key={column.id}>
                      <MdDelete
                        className={style.icon}
                        size={20}
                        role="button"
                        aria-label="Remover usuário"
                        title="Remover usuário"
                        onClick={() => deleteUser(user.cpf)}
                      />
                    </td>
                  ) : (
                    <td key={column.id}>{value}</td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
