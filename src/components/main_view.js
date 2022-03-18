import React, {Component} from 'react';
import EmptyLog from "./empty_log";
import SingleLog from "./single_log";
import Button from "./Button";
import Chore from "./chore";
import NewTask from "./NewTask";
import TextFieldForm from "./TextFieldForm";
import ExtendedLogger from "./ExtendedLogger";
import UserSearchBox from "./UserSearchBox";
import Dropdown from "./Dropdown";
import * as PropTypes from "prop-types";

export default class MainView extends Component {
  propTypes = {
    API: PropTypes.object,
    list: PropTypes.object,
  }

  constructor(props) {
    super(props);
    
    let listItems = props.list === null ? [] : props.list.items;
    let sharedWith = props.list === null ? [] : props.list.shared_with;
    
    this.state = {
      editName: false,
      addTask: {
        display: false,
        lock: false,
        error: false
      },
      sharing: {
        display: false,
        lock: false,
        error: false,
      },
      selectedChore: null,
      choreDetails: {logs: []},
      /**
       * @params {null|number}
       */
      extendedLogger: null,
      /**
       * @params {[object]}
       */
      listItems: listItems,
      sharedWith: sharedWith,
      editingTask: null,
    };

    this.toggleNewTask = this.toggleNewTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.logChore = this.logChore.bind(this);
    this.editTask = this.editTask.bind(this);
    this.updateChore = this.updateChore.bind(this);
    this.choreDetails = this.choreDetails.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.updateName = this.updateName.bind(this);
    this.shareList = this.shareList.bind(this);
    this.unshareList = this.unshareList.bind(this);
  }

  // List actions
  toggleSharing() {
    let newObject = {...this.state.sharing, display: !this.state.sharing.display};
    console.log("Display sharing window:", newObject.display);
    this.setState({sharing: newObject});
  }

  /**
   *
   * @param profile {object}
   * @returns {Promise<void>}
   */
  async shareList(profile) {
    console.log(this.state.sharedWith);
    if (this.state.sharedWith.findIndex(x => x.id === profile.id) > -1) {
      console.log(`Already shared with user ${profile.id}`);
      return;
    }
    console.log(`Sharing with user ${profile.id}`);
    try {
      await this.props.API.shareChecklist(this.props.list.id, profile.id);
    } catch (e) {
      console.error(e);
      return;
    }
    this.setState({sharedWith: [...this.state.sharedWith, profile]})
  }

  async unshareList(pk) {

  }

  toggleEditing() {
    this.setState({editName: !this.state.editName});
  }

  updateName(name) {
    console.log(name);
    this.props.updateName(name);
    this.toggleEditing();
  }

  // Task actions
  async addTask() {
    let taskName = document.querySelector("#chore-input").value;
    let frequency = document.querySelector("#chore-frequency").value;
    try {
      let success = await this.props.addTask(taskName, frequency);
      if (success) {
        this.toggleNewTask();
        return;
      }
    } catch {

    }
    this.setState({addTask: {display: true, lock: false, error: "Det oppstod ein feil. Prøv igjen."}});
  }

  toggleNewTask() {
    let addTask = {
      display: !this.state.addTask.display,
      lock: false,
      error: false,
    };
    this.setState({addTask: addTask});
  }
  
  toggleExtendedLogger(pk) {
    if (this.state.extendedLogger === pk) {
      this.setState({extendedLogger: null});
      return;
    }
    this.setState({extendedLogger: pk});
  }

  async logChore(pk, note="", dtg=null) {
    if (dtg === null) {
      console.log(`Logging chore ${pk} with note ${note} now...`);
      dtg = new Date();
    } else {
      console.log(`Logging chore ${pk} with note ${note} at ${dtg.toJSON()}...`);
    }
    let json = await this.props.API.logTask(pk, note, dtg);
    let choreDetails = this.state.selectedChore === pk ? json : this.state.choreDetails;
    let extendedLogger = this.state.extendedLogger === pk ? null : this.state.extendedLogger;
    let listItemsCopy = this.state.listItems.filter(x => {
      if (x.id === pk) {
        x.last_logged = json.last_logged;
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

  editTask(pk) {
    if (this.state.editingTask === pk) {
      this.setState({editingTask: null});
      return;
    }
    this.setState({editingTask: pk});
  }

  updateChore(pk) {
    let name = document.querySelector("#task-edit-name").value;
    let frequency = document.querySelector("#task-edit-frequency").value;
    this.setState({editingTask: null});
    this.props.updateTask(pk, name, frequency);
  }

  deleteChore(pk) {
    this.props.deleteTask(pk);
  }

  async choreDetails(pk) {
    if (this.state.selectedChore === pk) {
      this.setState({selectedChore: null});
      return;
    }

    let task;

    try {
      task = await this.props.API.task(pk);
    } catch (e) {
      console.error(e);
      return;
    }

    console.log(task);
    this.setState(
      {
        selectedChore: pk,
        choreDetails: task,
      }
    );
  }
  
  async deleteLog(pk) {
    let json = await this.props.API.deleteLog(pk);
    let listItemsCopy = this.state.listItems.filter(x => {
      if (x.id === json.id) {
        x.last_logged = json.last_logged;
      }
      return x;
    })
    this.setState(
      {
        choreDetails: json,
        listItems: listItemsCopy,
      }
    );
  }

  // React methods
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.props.list);
    let listItems = [];
    let sharedWith = [];
    if (this.props.list !== null) {
      if (this.props.list.items !== undefined) {
        if (prevProps.list === null || prevProps.list.items !== this.props.list.items) {
          listItems = this.props.list.items.map(x => x);
        }
      }
      if (this.props.list.shared_with !== undefined) {
        if (prevProps.list === null || prevProps.list.shared_with !== this.props.list.shared_with) {
          sharedWith = this.props.list.shared_with.map(x => x);
        }
      }
    }
    if (listItems.length > 0 || sharedWith.length > 0) {
      this.setState({
        listItems: listItems,
        sharedWith: sharedWith,
      })
    }
  }

  render() {
    if (this.props.list === null) {
      return <div className="col-md-9 col-lg-10">Du har ikkje valt noka liste</div>;
    }

    console.log(this.state.listItems);
    
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
          <Chore key={`chore_${x.id}`} chore={x} logCompletion={() => this.logChore(x.id)}
                 detailsCompletion={() => this.choreDetails(x.id)}
                 deleteCompletion={() => this.deleteChore(x.id)}
                 editCompletion={() => this.editTask(x.id)}
                 updateCompletion={() => this.updateChore(x.id)}
                 extendedLogCompletion={() => this.toggleExtendedLogger(x.id)}
                 editing={this.state.editingTask === x.id}
          />
          {extendedLogger}
          {details}
        </>
        });

    return <div className="col-md-9 col-lg-10">
      <div className={"row"}>
        <div className={"col"}>
        { !this.state.editName
          ? <h3>{this.props.list.name}</h3>
          : <TextFieldForm value={this.props.list.name}
                           completion={(name) => {this.updateName(name)}}
                           id={"list-name"} caption={"Lagre"}
            />
        }
        </div>
        <div className={"col text-end"}>
          <span className={"text-muted"}>{
            this.state.sharedWith.length > 0
              ? `Delt med ${this.state.sharedWith.length}`
              : "Ikkje delt med nokon"
          }</span>
        </div>
      </div>

      <Button key={"new-chore"}
              icon={"plus-circle"} caption={"Ny oppgåve"}
              completion={() => this.toggleNewTask()}
              classNames={"btn-primary"}
      />
      { this.props.list.owner.id === this.props.profile.id
      && <>
        <div className={"btn-group"}>
          <Button key={"share-list"}
                  icon={"box-arrow-up"} caption={"Del"}
                  completion={() => this.toggleSharing()}
                  classNames={"btn-primary rounded"}
          />
          <Dropdown visible={this.state.sharing.display}>
            <UserSearchBox API={this.props.API} completion={this.shareList}
                           sharedWith={this.state.sharedWith}/>
          </Dropdown>
        </div>
        <Button key={"edit-list"}
        icon={"pencil"} caption={"Rediger"}
        completion={() => {
        this.toggleEditing()
      }}
        classNames={"btn-primary"}
        />
        <Button key={"delete-list"}
        icon={"trash3"} caption={"Slett lista"}
        completion={() => {
        this.props.deleteList()
      }}
        classNames={"btn-danger"}
        />
        </>
      }
      <div className={"d-grid g-2"}>
        {this.state.addTask.display
          ? <NewTask state={this.state.addTask} completion={() => this.addTask()}/>
          : null}
        {table}
      </div>
    </div>;
  }
}