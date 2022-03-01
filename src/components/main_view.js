import React, {Component} from 'react';

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {addTask: false}
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.props.list)
  }

  render() {
    let noListSelected = this.props.list === null ? "Du har ikkje valt noka liste" : null;
    let table = this.props.list !== null ?
      this.props.list.items.length === 0
      ? "Her er det ingen oppgåver. Prøv å leggje til ei."
      : this.props.list.items.map(x => <tr>
        <td>{ x.name }</td>
        <td>{ x.last }</td>
        <td><a className={"btn btn-sm btn-primary"}><i className="bi bi-check-circle"></i></a></td>
      </tr>)
      : null
    let newTask = this.state.addTask ? <tr>
        <td><input type="text" id="chore-input" className="form-control"/></td>
      </tr> : null;
    let main = this.props.list === null
      ? null
      : <>
        <h3>{ this.props.list.name }</h3>
        <a className={"btn btn-sm btn-primary"}><i className="bi bi-circle-plus"></i> Ny oppgåve</a>
        <table className={"table"}>
          <tbody>
            { table }
          </tbody>
        </table>
      </>;

    return <div className="col-md-9 col-lg-10">{noListSelected} { main }</div>;
  }
}