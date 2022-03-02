import React, {Component} from 'react';
import EmptyLog from "./empty_log";
import SingleLog from "./single_log";
import Button from "./Button";

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

  /*
   * @param {Date|string} from
   * @param {Date} to
   * @returns {number}
   * */
  daysSince(from, to=new Date()) {
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
  verboseDaysSince(from, to) {
    let days = this.daysSince(from, to);
    if (days === 0) {
      return "i dag";
    }
    else if (days === 1) {
      return "i går";
    }
    return `${days} d. sidan`;
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
        let chore = <tr key={`chore_${x.id}`}>
          <td><Button classNames={"btn-sm btn-primary"}
                    icon={"check-circle"}
                    caption={"Logg"} visible={false}
                    completion={() => this.logChore(x.id)}
            /></td>
          <td>{x.name}</td>
          <td>{x.last_logged === null
            ? <i>Enno ikkje loggført</i>
            : this.verboseDaysSince(x.last_logged)}</td>
          <td>
            <Button classNames={"btn-sm btn-primary"}
              icon={"search"}
              caption={"Detaljar"} visible={false}
              completion={() => this.choreDetails(x.id)}
            />
            <Button classNames={"btn-sm btn-danger"}
                    icon={"trash3"}
                    caption={"Slett"} visible={false}
                    completion={() => this.choreDetails(x.id)}
            />
          </td>
        </tr>;
          return <>
            {chore}
            {details}
          </>
        })
    }

    let newTask = this.state.addTask ? <tr>
        <td/>
        <td><input type="text" id="chore-input" className="form-control"/></td>
        <td>
          <a
            href={"#"}
            onClick={() => this.addTask()}
            className="btn btn-sm btn-primary">
            <i className="bi bi-plus-circle"/>
          </a>
        </td>
      </tr> : null;
    let main = this.props.list === null
      ? null
      : <>
        <h3>{ this.props.list.name }</h3>
        <a
          href={"#"}
          onClick={() => this.toggleNewTask()}
          className={"btn btn-sm btn-primary ms-1"}>
          <i className="bi bi-plus-circle"/> Ny oppgåve
        </a>
        <a
          href={"#"}
          onClick={() => {}}
          className={"btn btn-sm btn-primary ms-1"}>
          <i className="bi bi-pencil"/> Rediger
        </a>
        <a
          href={"#"}
          onClick={() => {}}
          className={"btn btn-sm btn-danger ms-1"}>
          <i className="bi bi-trash3"/> Slett lista
        </a>
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