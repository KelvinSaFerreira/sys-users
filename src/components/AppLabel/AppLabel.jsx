import style from './AppLabel.module.scss'
import React from 'react';
function AppLabel({ label, htmlFor }) {
    return (
        <label className={style.label} htmlFor={htmlFor}>{ label }</label>
    )
}

export default AppLabel