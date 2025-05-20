import React, { useEffect, useState } from "react";
import AppInput from "../../components/AppInput/AppInput";
import AppButton from "../../components/AppButton/AppButton";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserFormData,
  clearUserFormData,
  addUser,
} from "../../features/users/usersSlice";

function UserForm() {
  const [loadingSave, setLoadingSave] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [nameError, setNameError] = useState("");
  const userFormData = useSelector((state) => state.users.userFormData);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "name" && nameError) setNameError("");
    dispatch(updateUserFormData({ name, value }));
  };

  const handleNameBlur = (event) => {
    const { value } = event.target;
    if (value.length < 3) {
      setNameError("Campo deve ter 3 caracteres ou mais");
    } else {
      setNameError("");
    }
  };

  const saveUser = (event) => {
    event.preventDefault();
    if (loadingSave) return;
    setLoadingSave(true);
    dispatch(addUser(userFormData));
    setTimeout(() => {
      dispatch(clearUserFormData());
      setLoadingSave(false);
    }, 1500);
  };

  useEffect(() => {
    const { name, email, cpf, phone } = userFormData;
    if (name && email && cpf && phone) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [userFormData]);

  return (
    <form onSubmit={saveUser} data-testid="user-form" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
      <AppInput
        label="Nome completo (sem abreviações)"
        name="name"
        value={userFormData.name}
        validation={nameError}
        onChange={handleChange}
        onBlur={handleNameBlur}
      />
      <AppInput
        label="E-mail"
        name="email"
        value={userFormData.email}
        onChange={handleChange}
      />
      <AppInput
        label="CPF"
        name="cpf"
        value={userFormData.cpf}
        onChange={handleChange}
        maskId="cpf"
      />
      <AppInput
        label="Telefone"
        name="phone"
        value={userFormData.phone}
        onChange={handleChange}
        maskId="phone"
      />
      <AppButton
        label={"Cadastrar"}
        loading={loadingSave}
        disabled={disableButton}
      />
    </form>
  );
}

export default UserForm;
