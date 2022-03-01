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

    this.state = {
      token: token === undefined || token === "" ? null : token,
      username: username === undefined ? null : username,
      lists: [],
      selected_list_id: null,
    }

    this.base_url = window.location.hostname === "localhost" ? "http://localhost:8000" : "https://millim.no"
    this.API = new API(this.base_url, getCookie('csrftoken'), token);

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
  }

  async selectList(pk) {
    let index = this.state.lists.find(x => x.id === pk);
    let lists = this.state.lists;
    lists[index].items = await this.getList(pk);
    this.setState({selected_list_id: pk, lists: lists});
  }

  async getLists() {
    if (this.state.token === null) return;

    let response = await fetch(
      `${this.base_url}/chores/api/checklists/`,
      {headers: {'x-csrftoken': this.csrftoken, 'token': this.state.token} }
    );
    let json = await response.json();
    console.log(json);
    if (response.status === 200) {
      this.setState({lists: json['checklists']});
      return;
    } else {
      setCookie("token", "", -1)
    }
  }

  async addList(name) {
    let formData = new FormData();
    formData.append('name', name);

    let response = await fetch(
      `${this.base_url}/chores/api/checklist/add`,
      {
        method: 'post',
        headers: {'x-csrftoken': this.csrftoken, 'token': this.state.token},
        body: formData,
      }
    );
    let json = await response.json();
    this.getLists();
  }

  async getList(pk) {

  }

  updateList(pk, name) {

  }

  deleteList(pk) {

  }

  getChore(pk) {

  }

  addChore(name) {

  }

  updateChore(pk, name, checklist) {

  }

  logChore(pk, date=null) {

  }

  deleteChore(pk) {

  }

  componentDidMount() {
    if (this.state.token === null) {
      return;
    }
    this.login(this.state.username, this.state.token);
    this.getLists();
  }

  render() {
    let main_view_list = this.state.selected_list_id === null
      ? null
      : this.state.lists.filter(x => x.id === this.state.selected_list_id)[0];
    return <>
        <Navbar username={this.state.username}/>
        <div className="row m-0">
        { this.state.token === null
          ?
          <RegisterView
            base_url={this.base_url}
            login_completion={(a, b) => this.login(a, b)}/>
          : <>
            <Sidebar
              lists={this.state.lists}
              select={(x) => this.selectList(x)}
              addList={(x) => this.addList(x)}/>
            <MainView list={main_view_list}/>
          </> }
        </div>
    </>;
  }
}

export default App;
