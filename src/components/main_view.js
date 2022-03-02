import React, {Component} from 'react';

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

  /**
   * @param {Date|string} date
   * @returns {string}
   */
  formatDate(date) {
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
            details = <tr key={`chore_${x.id}_details`}>
              <td/>
              <td colSpan={2}><i>Denne oppgåva har ikkje vorte loggført enno.</i></td>
              <td/>
            </tr>
          } else {
            console.log(this.state.choreDetails);
            details = this.state.choreDetails.logs.map(y => <tr key={`chore_${x.id}_details_${y.id}`}>
              <td/>
              <td>{y.note}</td>
              <td>{this.formatDate(y.timestamp)}</td>
              <td>
                <a
                  href={"#"}
                  className={"btn btn-sm btn-danger"}
                >
                  <i className={"bi bi-trash3"}/>
                  <span className={"visually-hidden"}>Slett</span>
                </a>
              </td>
            </tr>);
          }
        }
        let chore = <tr key={`chore_${x.id}`}>
          <td>
            <a
              href={"#"}
              className="btn btn-sm btn-primary"
              onClick={() => this.logChore(x.id)}
            >
              <i className="bi bi-check-circle"/>
              <span className={"visually-hidden visually-hidden-focusable"}>Logg</span>
            </a></td>
          <td>{x.name}</td>
          <td>{x.last_logged === null
            ? <i>Enno ikkje loggført</i>
            : this.verboseDaysSince(x.last_logged)}</td>
          <td>
            <a
              href={"#"}
              className="btn btn-sm btn-primary"
              onClick={() => this.choreDetails(x.id)}
            >
              <i className="bi bi-search"/>
              <span className={"visually-hidden visually-hidden-focusable"}>Detaljar</span>
            </a>
            <a
              href={"#"}
              className="ms-1 btn btn-sm btn-danger"
            >
              <i className="bi bi-trash3"/>
              <span className={"visually-hidden visually-hidden-focusable"}>Slett</span>
            </a>
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