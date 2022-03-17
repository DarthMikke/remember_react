import React, {Component} from 'react';
import Navbar from './components/navbar.js';
import RegisterView from './components/register.js';
import MainView from './components/main_view.js';
import Sidebar from "./components/sidebar.js";
import './App.css';
import getCookie, {setCookie} from "./cookie.js";
import API from "./API.js";

class App extends Component {
  constructor(props) {
    super(props);

    let token = getCookie("token");
    let username = getCookie("username");
    
    console.log(`Found token ${token} for username ${username}.`);
    this.state = {
      /**
       * @param {string|null}
       */
      token: (token === undefined || token === "") ? null : token,
      /**
       * @param {string|null}
       */
      username: username === undefined ? null : username,
      /**
       * @param {[object]}
       */
      lists: [],
      /**
       * @param {object|null}
       */
      selected_list: null,
    }

    this.base_url = window.location.hostname === "localhost" ? "http://localhost:8000" : document.location.origin
    this.API = new API(this.base_url, null, token);

    // this.csrftoken = getCookie('csrftoken') // Don't need the CSRF token anymore.

    this.login = this.login.bind(this);
    this.selectList = this.selectList.bind(this);
    this.getLists = this.getLists.bind(this);
    this.addList = this.addList.bind(this);
    this.getList = this.getList.bind(this);
  }

  login(username, token) {
    setCookie('username', username, 30);
    setCookie('token', token, 30);
    this.setState({username: username, token: token});
    console.log(`Logged in as ${username}`);
    this.getLists();
  }

  async selectList(pk) {
    let checklist = await this.getList(pk);
    console.log(checklist);
    this.setState({ selected_list: checklist });
  }

  // API calls
  async getLists() {
    let json;
    try {
      json = await this.API.checklists();
      console.log(json);
    } catch (e) {
      if (e.status === 401) {
        setCookie("token", "", -1);
        setCookie("username", getCookie('username'), -1)
      } else {
        console.log(e.status);
      }
    }
    this.setState({lists: json['checklists']});
  }

  async addList(name) {
    try {
      await this.API.addChecklist(name);
    } catch (e) {
      return;
    }
    await this.getLists();
  }

  async getList(pk) {
    try {
      return await this.API.checklist(pk);
    } catch (e) {
      console.log(e.status)
    }
  }

  async updateList(pk, name) {
    try {
      await this.API.updateChecklist(pk, name);
    } catch (e) {
      console.log(e.status, e.error);
    }
    await this.selectList(pk);
    await this.getLists();
  }

  async deleteList(pk) {
    try {
      await this.API.deleteChecklist(pk)
    } catch (e) {
      return;
    }
    this.setState({selected_list: null});
    await this.getLists();
  }

  async getTask(pk) {
    let json;
    try {
      json = await this.API.task(pk)
    } catch (e) {
      return {status: e.status, message: e.message};
    }
    return json;
  }

  async addTask(name, frequency, checklist_pk) {
    console.log(`Adding ${name} to checklist ${checklist_pk}...`);
    let newItem;
    try {
      newItem = await this.API.addTask(name, frequency, checklist_pk);
    } catch (e) {
      console.log('An error has occured.');
      return false;
    }

    console.log('Adding', newItem, 'to the local list.');
    let newList = {
      ...this.state.selected_list,
      items: [...this.state.selected_list.items, newItem]
    };
    this.setState({selected_list: newList});
    console.log('Added.');
    return true;
  }

  async updateChore(pk, name, frequency) {
    console.log(`Updating chore ${pk} to name ${name} and freq. of ${frequency} days...`);
    let json;
    try {
      json = this.API.updateTask(pk, name, frequency);
    } catch (e) {
      return e;
    }
    await this.selectList(this.state.selected_list.id);
    return json;
  }

  /**
   *
   * @param pk {number}
   * @param note {string}
   * @param date {Date|null}
   * @returns {Promise<Object>}
   */
  async logTask(pk, note="", date=null) {
    if (date === null) {
      console.log(`Logging chore ${pk} with note ${note} now...`);
      date = new Date();
    } else {
      console.log(`Logging chore ${pk} with note ${note} at ${date.toJSON()}...`);
    }
    return await this.API.logTask(pk, note, date);
  }

  async deleteTask(pk) {
    console.log(`Deleting task ${pk}...`);
    let json;
    try {
      json = await this.API.deleteTask(pk);
    } catch (e) {
      console.log(`An error occured during deleting task ${pk}.`);
      return;
    }

    console.log(`Deleting task ${pk} from the local list.`);
    let newList = {
      ...this.state.selected_list,
      items: [...this.state.selected_list.items.filter(x => x.id !== pk)]
    };

    this.setState({selected_list: newList});
    console.log(`Deleted.`);
    return json;
  }
  
  async deleteLog(pk) {
    console.log(`Deleting log ${pk}`);
    let json;
    try {
      json = await this.API.deleteLog(pk);
    } catch (e) {
      return;
    }
    console.log(`Deleted.`);
    return json;
  }

  async userSearch(query) {
    let json;
    try {
      json = await this.API.userSearch(query);
    } catch (e) {
      return e;
    }
    return json;
  }

  // React methods
  async componentDidMount() {
    if (this.state.token === null) {
      return;
    }
    this.login(this.state.username, this.state.token);
  }

  render() {
    let main_view_list = this.state.selected_list === null
      ? null
      : this.state.lists.filter(x => x.id === this.state.selected_list_id)[0];
    return <>
        <Navbar
          username={this.state.username}
          logout={() => {
            setCookie("username", "", -1);
            setCookie("token", "", -1);
            this.setState({username: null, token: null});
          }}
        />
        <div className="row m-0">
        { this.state.token === null
          ?
          <RegisterView
            base_url={this.base_url}
            login_completion={(a, b) => this.login(a, b)}
            API={this.API}
          />
          : <>
            <Sidebar
              lists={this.state.lists}
              select={(pk) => this.selectList(pk)}
              addList={(name) => this.addList(name)}/>
            <MainView
              API={this.API}
              updateName={(name) => this.updateList(this.state.selected_list.id, name)}
              deleteList={() => this.deleteList(this.state.selected_list.id)}
              addTask={(name, frequency) => this.addTask(name, frequency, this.state.selected_list.id)}
              getChore={(pk) => this.getTask(pk)}
              updateTask={(pk, name, frequency) => this.updateChore(pk, name, frequency)}
              logChore={(pk, note, dtg) => this.logTask(pk, note, dtg)}
              deleteTask={pk => this.deleteTask(pk)}
              deleteLog={pk => this.deleteLog(pk)}
              userSearch={(query) => this.userSearch(query)}
              list={this.state.selected_list}/>
          </> }
        </div>
    </>;
  }
}

export default App;
