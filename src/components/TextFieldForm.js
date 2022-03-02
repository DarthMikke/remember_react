import {useState} from "react";

export default function TextFieldForm(props) {
  const [value, setValue] = useState(props.value === undefined ? "" : props.value);
  return <div className={"row"}><div className={"input-group col-md-4 mb-3"}>
    <input
      className={"form-control"} id={props.id} type="text" value={value}
      onChange={(e) => setValue(e.target.value)}
    />
    <button type={"button"} onClick={() => props.completion(value)}
            className={"btn btn-primary"}
    >{ props.caption }</button>
  </div></div>
}
