import Button from "./Button";
import React from "react";

/**
 * @param {Date|string} from
 * @param {Date} to
 * @returns {number}
 * */
function daysSince(from, to=new Date()) {
  let day = 24*3600*1000;
  if (typeof(from) === "string") {
    from = new Date(from);
  }
  let from_day = from.getTime() - from.getTime()%(day)
  let to_day = to.getTime() - to.getTime()%(day)
  let diff = to_day - from_day;
  return Math.floor(diff/(day));
}

/**
 * @param {Date|string} from
 * @param {Date} to
 * @returns {string}
 * */
function verboseDaysSince(from, to) {
  let days = daysSince(from, to);
  if (days === 0) {
    return "i dag";
  }
  else if (days === 1) {
    return "i går";
  }
  return `${days} d. sidan`;
}

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