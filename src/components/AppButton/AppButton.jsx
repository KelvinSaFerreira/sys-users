import React from "react";
import style from "./AppButton.module.scss";
import { VscLoading } from "react-icons/vsc";

function AppButton({ label, loading, disabled, onClick, color }) {
  return (
    <button
      className={`${style.button} ${disabled ? style["button--disabled"] : ""}`}
      disabled={disabled}
      onClick={onClick}
      style={color ? { backgroundColor: color } : {}}
    >
      {loading ? <VscLoading size={28} className={style.loadingIcon} /> : label}
    </button>
  );
}

export default AppButton;
