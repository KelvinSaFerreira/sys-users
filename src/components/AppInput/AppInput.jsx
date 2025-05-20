import React, { useState, useEffect } from "react";
import { IMaskInput } from "react-imask";
import AppLabel from "../AppLabel/AppLabel";
import styles from "./AppInput.module.scss";

function AppInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  maskId,
  onBlur,
  validation,
}) {
  const [inputValue, setInputValue] = useState(value || "");

  const maskOptions = {
    cpf: "000.000.000-00",
    phone: "(00) 00000-0000",
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    if (onChange) {
      onChange(event);
    }
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const mask = maskId ? maskOptions[maskId] : null;

  return (
    <div style={{ textAlign: "start" }}>
      <AppLabel label={label} htmlFor={name} />
      {mask ? (
        <IMaskInput
          mask={mask}
          value={inputValue}
          onAccept={(val) => handleChange({ target: { name, value: val } })}
          className={styles.input}
          type={type}
          name={name}
          id={name}
        />
      ) : (
        <input
          className={styles.input}
          type={type}
          name={name}
          id={name}
          value={inputValue}
          onChange={handleChange}
          onBlur={onBlur}
        />
      )}
      {validation && (
        <div className={styles.input__validation}>
          {validation}
        </div>
      )}
    </div>
  );
}

export default AppInput;
