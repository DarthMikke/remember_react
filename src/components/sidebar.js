import React, {Component} from 'react';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newList: false
    }

    this.addList = this.addList.bind(this);
    this.toggleNewList = this.toggleNewList.bind(this);
  }

  toggleNewList() {
    this.setState({newList: !this.state.newList})
  }

  addList() {
    this.props.addList(document.querySelector("#new_list").value);
    this.toggleNewList();
  }

  render() {
    let lists = (this.props.lists.length > 0 || this.state.newList) ?
      this.props.lists.map(x => <li className="nav-item" key={`list-${x.id}`}>
      <a href={"#"} onClick={() => this.props.select(x.id)}>{x.name}</a>
    </li>)
      :
      <i>Du har ingen lister.</i>;

    let newList = this.state.newList
      ?
      <div className="input-group flex-nowrap my-3">
        <input className="form-control" id={"new_list"} type={"text"}/>
        <a href={"#"} className={"btn-sm btn-primary"} onClick={this.addList}>Legg til</a>
      </div>
      :
      null

    return <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Lister</span>
        <a onClick={this.toggleNewList} className="link-secondary" href="#" aria-label="Add a new report">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               className="feather feather-plus-circle" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </a>
      </h6>
      <ul className="nav flex-column">
        {newList}
        {lists}
      </ul>
    </nav>
  }
}
