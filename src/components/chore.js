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
  return <tr key={`chore_${props.chore.id}`}>
    <td>
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
    </td>
    <td>{props.chore.name}</td>
    <td>{props.chore.last_logged === null
      ? <i>Enno ikkje loggført</i>
      : verboseDaysSince(props.chore.last_logged)}</td>
    <td>
      <Button classNames={"btn-sm btn-primary"}
              icon={"search"}
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
    </td>
  </tr>
}
