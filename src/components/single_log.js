import React from 'react';
import Button from "./Button";

/**
 * @param {Date|string} date
 * @returns {string}
 */
function formatDate(date) {
  if (typeof(date) === 'string') {
    date = new Date(date);
  }
  let year = date.getFullYear();
  let month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${day}.${month}.${year} ${hours}.${minutes}`;
}

export default function SingleLog (props) {
  return <div className={"row justify-content-between my-1"} key={`chore_${props.chore_id}_details_${props.log.id}`}>
    <div className={"col-auto"}>{props.log.note}</div>
    <div className={"col-auto"}>{formatDate(props.log.timestamp)}</div>
    <div className={"col-auto"}>
      <Button classNames={"btn-sm btn-danger"}
              icon={"trash3"}
              caption={"Slett"} visible={false}
              completion={() => props.deleteCompletion()}
      />
    </div>
  </div>
}
