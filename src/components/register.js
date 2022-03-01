import React, {Component} from 'react';
import getCookie from "../cookie";

export default class RegisterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_errors: null,
      register_errors: null,
      register_passwords_matching: true,
      registered: false,
    }
    this.csrftoken = getCookie('csrftoken');

    this.login=this.login.bind(this);
    this.register=this.register.bind(this);
  }

  async login() {
    let username = document.querySelector("#login-username").value;
    let password = document.querySelector("#login-password").value;

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    let response = await fetch(
      `${this.props.base_url}/chores/api/login`,
      {
        method: 'post',
        body: formData,
        headers: {
          'x-csrftoken': this.csrftoken
        }
      })
    let json = await response.json();
    console.log(json);

    if (response.status === 200) {
      this.props.login_completion(json.username, json.access_token)
      return;
    }

    if (json.error !== undefined) {
      console.log(json.error);
      this.setState({login_errors: json.error})
    }
  }

  async register() {
    let username = document.querySelector("#register-username").value;
    let password = document.querySelector("#register-password").value;
    let password2 = document.querySelector("#register-repeat-password").value;
    let email = document.querySelector("#register-email").value;

    if (password !== password2) {
      this.setState({register_passwords_matching: false});
      console.log("Passwords not matching");
      return;
    } else {
      this.setState({register_passwords_matching: true});
    }

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);

    let response = await fetch(
      `${this.props.base_url}/chores/api/register`,
      {
        method: 'post',
        body: formData,
        headers: {
          'x-csrftoken': this.csrftoken
        }
      })
    if (response.status === 200) {
      this.setState()
      return;
    }

    let json = await response.json();
    console.log(json);
    if (json.error !== undefined) {
      console.log(json.error);
      this.setState({login_errors: json.error})
    }
  }

  render() {
    let login_errors = this.state.login_errors === null ? null : <span className="is-invalid">Innlogging mislykkast!</span>
    let register_errors = this.state.register_errors === null ? null : <span className="is-invalid">Dette brukarnamnet er opptatt.</span>
    let registered = this.state.registered ? <span>Takk, kan no logge inn i feltet til venstre.</span> : null;
    return <div className="row container">
      <div className="col-md-6">
        <h3>Logg inn</h3>
        <form>
          { login_errors }
          <div>
            <label htmlFor="login-username" className="form-label">Brukarnamn</label>
            <input type="text" className="form-control" id="login-username"/>
          </div>
          <div>
            <label htmlFor="login-password" className="form-label">Passord</label>
            <input type="password" className="form-control" id="login-password"/>
          </div>
          <div onClick={this.login} className="btn btn-primary">Logg inn!</div>
        </form>
      </div>
      <div className="col-md-6">
        <h3>Registrer ny brukar</h3>
        <form>
          { registered }
          { register_errors }
          <div>
            <label htmlFor="register-username" className="form-label">Brukarnamn</label>
            <input type="text" className="form-control" id="register-username"/>
          </div>
          <div>
            <label htmlFor="register-email" className="form-label">E-postadresse</label>
            <input type="text" className="form-control" id="register-email"/>
          </div>
          <div>
            <label htmlFor="register-password" className="form-label">Passord</label>
            <input type="password" className="form-control" id="register-password"/>
          </div>
          <div>
            <label
              htmlFor="register-repeat-password"
              className={ this.state.register_passwords_matching ? "form-label" : "form-label is-invalid" }
            >Gjenta passordet</label>
            <input
              type="password"
              className={ this.state.register_passwords_matching ? "form-control" : "form-control is-invalid" }
              id="register-repeat-password"/>
          </div>
          <div onClick={this.register} className="btn btn-primary">Registrer!</div>
        </form>
      </div>
    </div>
  }
}