import style from "./LayoutHeader.module.scss";
import logo from "../../assets/logo.png";
import AppButton from "../AppButton/AppButton";
import { useEffect } from "react";

function LayoutHeader({ showForm, setShowForm }) {
  useEffect(() => {}, [showForm]);
  return (
    <header className={style.header}>
      <img className={style.header__logo} src={logo} alt="Logo" />

      <div className={style.header__buttonBox}>
        <AppButton
          className={style.header__button}
          onClick={setShowForm}
          disabled={showForm}
          label={"Cadastrar novo usuário"}
        />
        <AppButton
          className={style.header__button}
          onClick={setShowForm}
          disabled={!showForm}
          label={"Listar usuários"}
        />
      </div>
    </header>
  );
}
export default LayoutHeader;