import Button from "./Button";
import React from "react";

export default function NewTask(props) {
  return <div className={"row justify-content-between m-1 p-1"}>
    <div className={"col-auto"}>
      <input type="text" placeholder={"Oppgåve"} id="chore-input" className="form-control form-control-sm"/>
    </div>
    <div className={"col-auto"}>
      <Button caption={"Legg til"} visible={true}
              classNames={"btn-sm btn-primary"}
              icon={"plus-circle"}
              completion={() => props.completion()}/>
    </div>
  </div>
}
