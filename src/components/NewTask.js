import Button from "./Button";
import React from "react";

export default function NewTask(props) {
  return <tr>
    <td/>
    <td colSpan={2}><input type="text" id="chore-input" className="form-control"/></td>
    <td>
      <Button caption={"Legg til"} visible={false}
              classNames={"btn-sm btn-primary"}
              icon={"plus-circle"}
              completion={() => props.completion()}/>
    </td>
  </tr>
}