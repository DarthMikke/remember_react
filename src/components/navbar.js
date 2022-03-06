import React, {Component} from 'react';

export default class Navbar extends Component {
    render() {

        return (
<header className="navbar navbar-expand-sm navbar-light bg-light m-0">
    <div className="container-fluid m-0">
        <a className="navbar-brand" href="/">Chores</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target=".collapse" aria-controls="collapse" aria-expanded="false"
                aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <a className="nav-link" href="/remember/">Heim</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="">Personvern</a>
                </li>
            </ul>
        </div>
        { this.props.username === null || this.props.username === undefined || this.props.username === "" ? null :
          <div className={"text-end"}>
              <ul className={"navbar-nav"}>
                  <li className={"nav-item"}>
                      <a className={"nav-link"} href={"#"} onClick={() => this.props.logout()}>Logg ut</a>
                  </li>
              </ul>
          </div> }
    </div>
</header>);
    }
}

