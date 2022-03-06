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
      token: (token === undefined || token === "") ? null : token,
      username: username === undefined ? null : username,
      lists: [],
      selected_list: null,
    }

    this.base_url = window.location.hostname === "localhost" ? "http://localhost:8000" : "https://millim.no"
    this.API = null;

    this.csrftoken = getCookie('csrftoken')

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
    this.API = new API(this.base_url, getCookie('csrftoken'), token);
    this.getLists();
  }

  async selectList(pk) {
    let checklist = await this.getList(pk);
    console.log(checklist);
    this.setState({ selected_list: checklist });
  }

  // API calls
  async getLists() {
    if (this.state.token === null) return;
    let response = await this.API.get('chores/api/checklists/');
    let json = await response.json();
    console.log(json);
    if (response.status === 200) {
      this.setState({lists: json['checklists']});
      return;
    } else if (response.status === 401) {
      setCookie("token", "", -1);
      setCookie("username", getCookie('username'), -1)
    } else {
      console.log(response.status);
    }
  }

  async addList(name) {
    let response = await this.API.post('chores/api/checklist/add', {}, {'name': name});
    let json = await response.json();
    if (response.status === 200) {
      this.getLists();
      return;
    }
  }

  async getList(pk) {
    let response = await this.API.get(`chores/api/checklist/${pk}/`);
    let json = await response.json();
    console.log(json);
    if (response.status === 200) {
      return json;
    }
    return json;
  }

  async updateList(pk, name) {
    let response = await this.API.post(`chores/api/checklist/${pk}/update`, {}, {'name': name});
    let json = await response.json();
    console.log(json);
    if (response.status === 200) {
      await this.selectList(pk);
      await this.getLists();
    }
  }

  async deleteList(pk) {
    let response = await this.API.get(`chores/api/checklist/${pk}/delete`);
    let json = await response.json();
    console.log(json);
    if (response.status === 200) {
      this.setState({selected_list: null});
      await this.getLists();
    }
  }

  async getChore(pk) {
    console.log(`Getting details on chore ${pk}`);
    let response = await this.API.get(`chores/api/chore/${pk}/`);
    let json = await response.json();
    if (response.status === 200) {
      return json;
    }
    return json;
  }

  async addChore(name, checklist_pk) {
    console.log(`Adding ${name} to checklist ${checklist_pk}...`);
    this.API.post(`chores/api/checklist/${checklist_pk}/add_chore`, {}, {name: name});
    await this.selectList(this.state.selected_list.id);
  }

  updateChore(pk, name, checklist) {
  
  }

  async logChore(pk, note="", date=null) {
    if (date === null) {
      console.log(`Logging chore ${pk} with note ${note} now...`);
      date = new Date();
    } else {
      console.log(`Logging chore ${pk} with note ${note} at ${date.toJSON()}...`);
    }
    let response = await this.API.get(`chores/api/chore/${pk}/log`, {note: note, date: date.toJSON()});
    return await response.json();
  }

  deleteChore(pk) {

  }
  
  async deleteLog(pk) {
    console.log(`Deleting log ${pk}`);
    let response = await this.API.get(`chores/api/log/${pk}/delete`);
    if (response.status === 200) {
      console.log(`Deleted.`);
      let json = await response.json();
      return json;
    }
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
            login_completion={(a, b) => this.login(a, b)}/>
          : <>
            <Sidebar
              lists={this.state.lists}
              select={(pk) => this.selectList(pk)}
              addList={(name) => this.addList(name)}/>
            <MainView
              updateName={(name) => this.updateList(this.state.selected_list.id, name)}
              deleteList={() => this.deleteList(this.state.selected_list.id)}
              addTask={(name) => this.addChore(name, this.state.selected_list.id)}
              getChore={(pk) => this.getChore(pk)}
              logChore={(pk, note, dtg) => this.logChore(pk, note, dtg)}
              deleteChore={pk => this.deleteChore(pk)}
              deleteLog={pk => this.deleteLog(pk)}
              list={this.state.selected_list}/>
          </> }
        </div>
    </>;
  }
}

export default App;
