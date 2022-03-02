import React, {Component} from 'react';
import EmptyLog from "./empty_log";
import SingleLog from "./single_log";
import Button from "./Button";
import Chore from "./chore";

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addTask: false,
      selectedChore: null,
      choreDetails: {logs: []},
      extendedLogger: false,
    };

    this.toggleNewTask = this.toggleNewTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.logChore = this.logChore.bind(this);
    this.choreDetails = this.choreDetails.bind(this);
  }

  addTask() {
    let taskName = document.querySelector("#chore-input").value;
    this.props.addTask(taskName);
    this.toggleNewTask();
  }

  toggleNewTask() {
    this.setState({addTask: !this.state.addTask});
  }

  logChore(pk, dtg=null) {
    this.props.logChore(pk, dtg);
  }

  async choreDetails(pk) {
    if (this.state.selectedChore === pk) {
      this.setState({selectedChore: null});
      return;
    }

    let chore = await this.props.getChore(pk);
    console.log(chore);
    this.setState(
      {
        selectedChore: pk,
        choreDetails: chore,
      }
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.props.list);
  }

  render() {
    let noListSelected = this.props.list === null ? "Du har ikkje valt noka liste" : null;
    let table = null;
    if (this.props.list !== null) {
      table = this.props.list.items.length === 0
      ? <span>Her er det ingen oppgåver. Prøv å leggje til ei.</span>
      : this.props.list.items.map(x => {
        let details = null;
        if(this.state.selectedChore === x.id) {
          if (this.state.choreDetails.logs.length === 0) {
            details = <EmptyLog/>
          } else {
            console.log(this.state.choreDetails);
            details = this.state.choreDetails.logs.map(y =>
              <SingleLog chore_id={x.id} log={y}/>
            );
          }
        }
        return <>
          <Chore chore={x} logCompletion={() => this.logChore(x.id)}
                 detailsCompletion={() => this.choreDetails(x.id)}
                 deleteCompletion={() => {}}
                 editCompletion={() => {}}
          />
          {details}
        </>
        })
    }

    let newTask = this.state.addTask ? <tr>
        <td/>
        <td colSpan={2}><input type="text" id="chore-input" className="form-control"/></td>
        <td>
          <Button caption={"Legg til"} visible={false}
                  classNames={"btn-sm btn-primary"}
                  icon={"plus-circle"}
                  completion={() => this.addTask()}/>
        </td>
      </tr> : null;
    let main = this.props.list === null
      ? null
      : <>
        <h3>{ this.props.list.name }</h3>
        <Button
          icon={"plus-circle"} caption={"Ny oppgåve"}
          completion={() => this.toggleNewTask()}
          classNames={"btn-primary"}
          />
        <Button
          icon={"pencil"} caption={"Rediger"}
          completion={() => {}}
          classNames={"btn-primary"}
        />
        <Button
          icon={"trash3"} caption={"Slett lista"}
          completion={() => {}}
          classNames={"btn-danger"}
        />
        <table className={"table"}>
          <tbody>
            { newTask }
            { table }
          </tbody>
        </table>
      </>;

    return <div className="col-md-9 col-lg-10">{noListSelected} { main }</div>;
  }
}