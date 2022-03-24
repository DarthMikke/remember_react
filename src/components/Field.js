/**
 *
 * @param id {string}
 * @param className {string}
 * @param label {string}
 * @param labelClass {string}
 * @param inputClass {string}
 * @param placeholder {string}
 * @param type {string}
 * @param value {string|number}
 * @param onChange {method}
 * @returns {JSX.Element}
 */
import {useState} from "react";

export default function Field({
                                id,
                                className,
                                label,
                                labelClass,
                                inputClass,
                                placeholder,
                                type,
                                value,
                                onChange }) {
  const [localValue, setLocalValue] = useState(value);

  if (type === "hidden") {
    return <input type={"hidden"} value={value}/>;
  }

  function onChangeListener(event) {
    setLocalValue(event.target.value);
    onChange(event.target.value);
  }

  if (labelClass === undefined) {
    labelClass = "input-group-text";
  }
  if (inputClass === undefined) {
    inputClass = "form-control"
  }
  if (className === undefined) {
    className = "input-group"
  }
  if (label === undefined) {
    label = null
  } else {
    label = <label className={labelClass} htmlFor={id}>{label}</label>
  }

  return <div className={className}>
    {label}
    <input className={inputClass} type={type} value={value} placeholder={placeholder}
           onChange={onChangeListener}
    />
  </div>;
}
