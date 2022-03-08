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
  const [chore, setChore] = useState(props.chore);
  const [name, setName] = useState(props.chore.name);
  const [frequency, setFrequency] = useState(props.chore.frequency);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (props.editing) {
    return <div className={"row border-top justify-content-between my-1 py-1"} key={`chore_${chore.id}`}>
      <div className={"col-auto"}>
        <input type="text" placeholder={"Oppgåve"} id="task-edit-name"
               className="form-control form-control-sm" value={name}
               onChange={event => setName(event.target.value)}
        />
      </div>
      <div className={"col-auto"}>
        <div className={"input-group input-group-sm"}>
          <label htmlFor={"task-edit-frequency"}
                 className={"input-group-text input-group-text-sm"}
          >Utfør kvar</label>
          <input type={"number"} id={"task-edit-frequency"}
                 className={"form-control form-control-sm"} value={frequency}
                 onChange={event => setFrequency(Number(event.target.value))}
          />
          <span className={"input-group-text input-group-text-sm"}>. dag</span>
        </div>
      </div>
      <div className={"col-auto"}>
        <Button caption={"Lagre"} visible={true}
                classNames={"btn-sm btn-primary"}
                icon={"check-circle"}
                completion={() => props.updateCompletion()}/>
        <Button classNames={"btn-sm btn-warning"}
                icon={"x-circle"}
                caption={"Avbryt"} visible={false}
                completion={() => props.editCompletion()}
        />
      </div>
    </div>
  }

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
    <div className={"col-4 col-sm-7 col-lg-8"}>
      <div className={"row justify-content-between"}>
        <div className={"col-auto"}>{name}</div>
        <div className={"col-auto"}>{chore.last_logged === null
          ? <i>Enno ikkje loggført</i>
          : verboseDaysSince(chore.last_logged)}
        </div>
      </div>
    </div>
    <div className={"col-auto"}>
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
              completion={() => setShowDeleteModal(true)}
      />
    </div>
    { showDeleteModal
      ? <div className="modal fade show" style={{display: "block"}}>
        <div className={"modal-dialog"}>
          <div className="modal-content">
          <p>Er du sikker på at du vil slette { name }? Det vil også slette alle loggar på denne oppgåva.</p>
          </div>
          <div className="modal-footer">
            <Button caption={"Nei"} visible={"true"}
                    classNames={"btn-primary"}
                    completion={() => setShowDeleteModal(false)}
            />
            <Button caption={"Ja, slett"} visible={"true"}
                    classNames={"btn-danger"} icon={"trash3"}
                    completion={() => setShowDeleteModal(false)}
            />
          </div>
        </div>
      </div>
      : null }

  </div>
  
}
