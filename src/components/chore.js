import Button from "./Button";
import React, {useState} from "react";
import {verboseDaysSince} from "../date-utils";

/**
 *
 * @param props:
 *  - chore
 *  - logCompletion
 *  - detailsCompletion
 *  - deleteCompletion
 *  - editCompletion
 * @returns {JSX.Element}
 * @constructor
 */
export default function Chore(props) {
  const [chore, setChore] = useState(props.chore)
  
  return <div className={"row border-top justify-content-between my-1 py-1"} key={`chore_${chore.id}`}>
    <div className={"col-auto"}>
      <Button classNames={"btn-sm btn-primary"}
                icon={"check-circle"}
                caption={"Logg"} visible={false}
                completion={() => props.logCompletion()}
      />
      <Button classNames={"btn-sm btn-primary"}
              icon={"clock-history"}
              caption={"Logg i fortida"} visible={false}
              completion={() => props.extendedLogCompletion()}
      />
    </div>
    <div className={"col-6 col-sm-7 col-lg-8"}>
      <div className={"row justify-content-between"}>
        <div className={"col-auto"}>{chore.name}</div>
        <div className={"col-auto"}>{chore.last_logged === null
          ? <i>Enno ikkje loggført</i>
          : verboseDaysSince(chore.last_logged)}
        </div>
      </div>
    </div>
    <div className={"col"}>
      <Button classNames={"btn-sm btn-primary"}
              icon={"list-check"}
              caption={"Detaljar"} visible={false}
              completion={() => props.detailsCompletion()}
      />
      <Button classNames={"btn-sm btn-primary"}
              icon={"pencil"}
              caption={"Rediger"} visible={false}
              completion={() => props.editCompletion()}
      />
      <Button classNames={"btn-sm btn-danger"}
              icon={"trash3"}
              caption={"Slett"} visible={false}
              completion={() => props.deleteCompletion()}
      />
    </div>
  </div>
  
}
