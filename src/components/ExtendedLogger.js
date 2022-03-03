import {useState} from "react";

/**
 * Parses datetime in format dd.mm.yyyy HH:MM
 * @param from {string}
 * @returns {Date}
 */
function parseDate(from) {
  let reg = /([0-9]{2}).([0-9]{2}).([0-9]{4})\s([0-9]{2}).([0-9]{2})/g;
  let array = reg.exec(from);
  if (array === null) {
    return null;
  }
  let tzOffset = -(new Date().getTimezoneOffset());
  let hrsOffset = Math.floor(tzOffset/60);
  let minutesOffset = tzOffset % 60;
  let offsetPositive = tzOffset >= 0;
  let [_, day, month, year, hours ,minutes] = array;
  let offsetString = (offsetPositive ? "+" : "-") + String(hrsOffset).padStart(2, "0") + ":" + String(minutesOffset).padStart(2, "0");
  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00.000${offsetString}`);
}

export default function ExtendedLogger(props) {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() < 9 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
  let day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  const [date, setDate] = useState(day + "." + month + "." + year);
  const [time, setTime] = useState(hours + "." + minutes);
  const [note, setNote] = useState("")
  
  function submit() {
    let dtg = parseDate(date + " " + time);
    props.completion(note, dtg);
  }
  
  return <tr>
    <td/>
    <td>
      <div className={"input-group input-group-sm"}>
        <input className={"form-control"} placeholder={"Notat"} type={"text"} id={"note"}
               value={note} onChange={event => setNote(event.target.value)}
        />
      </div>
    </td>
    <td>
      <div className={"input-group input-group-sm row"}>
        <span className="input-group-text col-2">Dato: </span>
        <input className={"form-control col-3"} placeholder="dato" maxLength={10} type={"text"} id={"date"}
               value={date} onChange={(e) => setDate(e.target.value)}/>
        <span className="input-group-text col-2">Tid: </span>
        <input className={"form-control col-3"} placeholder="time" maxLength={5} type={"text"} id={"time"}
               value={time} onChange={(e) => setTime(e.target.value)}/>
      </div>
    </td>
    <td>
      <button className={"btn btn-sm btn-primary ms-1"} onClick={() => submit()}>Lagre</button>
    </td>
  </tr>
}
