import React, {Component} from 'react';
import EmptyLog from "./empty_log";
import SingleLog from "./single_log";
import Button from "./Button";
import Chore from "./chore";
import NewTask from "./NewTask";
import TextFieldForm from "./TextFieldForm";
import ExtendedLogger from "./ExtendedLogger";

export default class MainView extends Component {
  constructor(props) {
    super(props);
    
    let listItems = props.list === null ? [] : props.list.items
    
    this.state = {
      editName: false,
      addTask: false,
      selectedChore: null,
      choreDetails: {logs: []},
      extendedLogger: null,
      listItems: listItems,
    };

    this.toggleNewTask = this.toggleNewTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.logChore = this.logChore.bind(this);
    this.choreDetails = this.choreDetails.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.updateName = this.updateName.bind(this);
  }

  toggleEditing() {
    this.setState({editName: !this.state.editName});
  }

  updateName(name) {
    console.log(name);
    this.props.updateName(name);
    this.toggleEditing();
  }

  addTask() {
    let taskName = document.querySelector("#chore-input").value;
    this.props.addTask(taskName);
    this.toggleNewTask();
  }

  toggleNewTask() {
    this.setState({addTask: !this.state.addTask});
  }
  
  toggleExtendedLogger(pk) {
    if (this.state.extendedLogger === pk) {
      this.setState({extendedLogger: null});
      return;
    }
    this.setState({extendedLogger: pk});
  }

  async logChore(pk, note="", dtg=null) {
    let json = await this.props.logChore(pk, note, dtg);
    let choreDetails = this.state.selectedChore === pk ? json : this.state.choreDetails;
    let extendedLogger = this.state.extendedLogger === pk ? null : this.state.extendedLogger;
    let listItemsCopy = this.state.listItems.filter(x => {
      if (x.id === pk) {
        x.last_logged = dtg === null ? (new Date()).toJSON() : dtg.toJSON();
      }
      return x;
    })
    this.setState(
      {
        extendedLogger: extendedLogger,
        choreDetails: choreDetails,
        listItems: listItemsCopy
      }
    )
  }

  deleteChore(pk) {
    this.props.deleteChore(pk);
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
  
  async deleteLog(pk) {
    let json = await this.props.deleteLog(pk);
    this.setState({choreDetails: json});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.props.list);
    if (prevProps.list !== this.props.list) {
      let listItems = this.props.list === null ? [] : this.props.list.items;
      this.setState({listItems: listItems})
    }
  }
 
  render() {
    if (this.props.list === null) {
      return <div className="col-md-9 col-lg-10">Du har ikkje valt noka liste</div>;
    }
    
    let table = this.state.listItems.length === 0
      ? <span>Her er det ingen oppgåver. Prøv å leggje til ei.</span>
      : this.state.listItems.map(x => {
        let details = null;
        if(this.state.selectedChore === x.id) {
          if (this.state.choreDetails.logs.length === 0) {
            details = <EmptyLog/>
          } else {
            console.log(this.state.choreDetails);
            details = this.state.choreDetails.logs.map(y =>
              <SingleLog chore_id={x.id} log={y} deleteCompletion={() => {this.deleteLog(y.id)}}/>
            );
          }
        }
        let extendedLogger = this.state.extendedLogger === x.id
          ? <ExtendedLogger completion={(note, dtg) => this.logChore(x.id, note, dtg)}/>
          : null;
        
        return <>
          <Chore chore={x} logCompletion={() => this.logChore(x.id)}
                 detailsCompletion={() => this.choreDetails(x.id)}
                 deleteCompletion={() => this.deleteChore(x.id)}
                 updateCompletion={() => {}}
                 extendedLogCompletion={() => this.toggleExtendedLogger(x.id)}
          />
          {extendedLogger}
          {details}
        </>
        })

    return <div className="col-md-9 col-lg-10">
      { !this.state.editName
        ? <h3>{ this.props.list.name }</h3>
        : <TextFieldForm value={this.props.list.name} completion={(name) => {this.updateName(name)}}
                         id={"list-name"} caption={"Lagre"}
          /> }
      <Button key={"new-chore"}
              icon={"plus-circle"} caption={"Ny oppgåve"}
              completion={() => this.toggleNewTask()}
              classNames={"btn-primary"}
      />
      <Button key={"edit-list"}
              icon={"pencil"} caption={"Rediger"}
              completion={() => {this.toggleEditing()}}
              classNames={"btn-primary"}
      />
      <Button key={"delete-list"}
              icon={"trash3"} caption={"Slett lista"}
              completion={() => {this.props.deleteList()}}
              classNames={"btn-danger"}
      />
      <table className={"table"}>
        <tbody>
        { this.state.addTask ? <NewTask completion={() => this.addTask()}/> : null }
        { table }
        </tbody>
      </table>
    </div>;
  }
}