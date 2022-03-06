import {useEffect, useState} from "react";
import {parseDate} from "../date-utils";

export default function ExtendedLogger(props) {
  let now = new Date();
  let year = now.getFullYear();
  let month = String(now.getMonth() < 9 + 1) ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
  let day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  const [date, setDate] = useState(day + "." + month + "." + year);
  const [time, setTime] = useState(hours + "." + minutes);
  const [note, setNote] = useState("")
  const [invalidDt, setInvalidDt] = useState("");
  
  function validate() {
    let dtg = parseDate(date + " " + time);
    if (dtg===null) {
      setInvalidDt("is-invalid");
      return;
    }
    setInvalidDt("is-valid");
  }
  
  useEffect(validate);
  
  function submit() {
    let dtg = parseDate(date + " " + time);
    // Parse datetime
    if (dtg===null) {
      setInvalidDt("is-invalid");
      return;
    }
    
    console.log(`Parsed ${date} ${time} as ${dtg.toJSON()}`)
    props.completion(note, dtg);
  }
  
  return <div className={"row justify-content-between gy-1"}>
    <div className={"col-xs-12 col-sm"}>
      <div className={"input-group input-group-sm"}>
        <input className={"form-control"} placeholder={"Notat"} type={"text"} id={"note"}
               value={note} onChange={event => setNote(event.target.value)}
        />
      </div>
    </div>
    <div className={"col-xs-12 col-sm"}>
      <div className={"input-group input-group-sm"}>
        <span className="input-group-text col-2">Dato: </span>
        <input className={ (invalidDt) + " form-control col-3" }
               placeholder="date" maxLength={10} type={"text"} id={"date"}
               value={date} onChange={(e) => setDate(e.target.value)}/>
        <span className="input-group-text col-2">Tid: </span>
        <input className={ (invalidDt) + " form-control col-3" }
               placeholder="time" maxLength={5} type={"text"} id={"time"}
               value={time} onChange={(e) => setTime(e.target.value)}/>
      </div>
    </div>
    <div className={"col-xs-12 col-sm text-end"}>
      <button className={"btn btn-sm btn-primary ms-1"} onClick={() => submit()}>Lagre</button>
    </div>
  </div>
}
