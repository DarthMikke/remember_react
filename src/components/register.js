import React, {Component} from 'react';
import getCookie from "../cookie";

export default class RegisterView extends Component {
  /**
   *
   * @param props {{base_url, login_completion, API}}
   */
  constructor(props) {
    super(props);
    this.state = {
      login_message: {
        display: false,
        success: false,
        message: [],
      },
      register_message: {
        display: false,
        success: false,
        messages: [],
      },
      register_passwords_matching: true,
      register_fields_valid: [true, true, true, true],
      registered: false,
    }
    // this.csrftoken = getCookie('csrftoken');

    this.API = props.API;

    this.login=this.login.bind(this);
    this.register=this.register.bind(this);

    this.alert_messages = {
      1: "Brukarnamnet eller passordet er feil.",
      2: "Takk! Du er no registrert og kan logge inn.",
      3: "Passorda er ikkje lik.",
      4: "Du må godta vilkåra for å bli registrert.",
      5: "Dette brukarnamnet er opptatt. Ville du kanskje logge inn?",
      6: "Ukjent feil. Venlegast ta kontakt med brukarstøtte.",
      7: "Du må fylle ut alle felt.",
    }
  }

  async login() {
    let username = document.querySelector("#login-username").value;
    let password = document.querySelector("#login-password").value;
  
    let json;
    
    try {
      json = await this.API.login(username, password);
    } catch (e) {
      console.log(e);
      if (e.status !== 500) {
        this.setState(
          {
            login_message: {
              display: true,
              success: false,
              messages: [1]
            }
          }
        );
        return;
      }
      this.setState(
        {
          login_message: {
            display: true,
            success: false,
            messages: [6]
          }
        }
      );
      return;
    }

    this.props.login_completion(json.username, json.access_token);
  }

  async register() {
    let username = document.querySelector("#register-username").value;
    let email = document.querySelector("#register-email").value;
    let password = document.querySelector("#register-password").value;
    let password2 = document.querySelector("#register-repeat-password").value;

    let register_fields_valid = [...new Array(this.state.register_fields_valid.length).fill(true)];
    let messages = [];

    /**
     * ## Validation
     */
    // Check if the username is empty
    if (username === "") {
      register_fields_valid[0] = false;
      messages.push(7);
    }

    // Check if the email is empty
    if (email === "") {
      register_fields_valid[1] = false;
      messages.push(7);
    }

    // Check if the password fields are empty
    if (password === "") {
      register_fields_valid[2] = false;
      messages.push(7);
    }

    if (password2 === "") {
      register_fields_valid[3] = false;
      messages.push(7);
    }

    // Check if passwords are the same.
    if (password !== password2) {
      register_fields_valid[3] = false;
      console.log("Passwords not matching");
      messages.push(3);
    }

    // Check if there are any invalid fields
    if (register_fields_valid.filter(x => x === false).length > 0) {
      this.setState(
        {
          register_fields_valid: register_fields_valid,
          register_message: {
            display: true,
            success: false,
            messages: messages.filter((x, i, array) => array.indexOf(x) === i),
          }
        }
      );
      return;
    }

    /**
     * ## Networking
     */
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);

    let response = await this.API.post(
      `chores/api/register`,
      {},
      {username: username, password: password, email: email}
    );
    if (response.status === 200) {
      this.setState(
        {
          register_passwords_matching: true,
          register_message: {
            display: true,
            success: true,
            messages: [2],
          }
        }
        );

      document.querySelector("#register-username").value = "";
      document.querySelector("#register-email").value = "";
      document.querySelector("#register-password").value = "";
      document.querySelector("#register-repeat-password").value = "";
      
      return;
    }

    let json = await response.json();
    console.log(json);
    if (json.error !== undefined) {
      console.log(json.error);
      this.setState(
        {
          register_passwords_matching: true,
          register_message: {
            display: true,
            success: false,
            messages: [5],
          }
        }
        );
      return;
    }

    this.setState(
      {
        register_passwords_matching: true,
        register_message: {
          display: true,
          success: false,
          messages: [6],
        }
      }
    )
  }

  render() {
    let login_errors = this.state.login_message.display
      ? <div className={"my-2 alert " + (this.state.login_message.success ? "alert-success" : "alert-danger")}>
        { this.state.login_message.messages.map(x =>
          <p className={"m-0"}>{ this.alert_messages[x] }</p>
        ) }
        </div>
      : null;
    let register_errors = this.state.register_message.display
      ? <div className={"my-2 alert " + (this.state.register_message.success ? "alert-success" : "alert-danger")}>
            { this.state.register_message.messages.map(x =>
            <p className={"m-0"}>{ this.alert_messages[x] }</p>
            ) }
        </div>
      : null;
    let test_message = document.location.href.split("#")[1] === "test" ?
      <div className="alert alert-primary">Vil du prøve ut Remember?
        Logg inn med <b>test</b> som brukarnamn og <b>test</b> som passord.
      </div> : null;

    return <div className="row container-fluid gy-3 m-0">
      <div className="col-sm-6">
        <h3>Logg inn</h3>
        <form>
          { login_errors }
          <div className={"my-2"}>
            <label htmlFor="login-username" className="form-label">Brukarnamn</label>
            <input type="text" className="form-control" id="login-username"/>
          </div>
          <div className={"my-2"}>
            <label htmlFor="login-password" className="form-label">Passord</label>
            <input type="password" className="form-control" id="login-password"/>
          </div>
          <div className={"my-2"}>
            <div onClick={this.login} className="btn btn-primary">Logg inn!</div>
          </div>
        </form>
        {test_message}
      </div>
      <div className="col-sm-6">
        <h3>Registrer ny brukar</h3>
        <form>
          { register_errors }
          <div className={"my-2"}>
            <label
              htmlFor="register-username"
              className={"form-label" + (this.state.register_fields_valid[0] ? "" : " is-invalid")}>
              Brukarnamn
            </label>
            <input type="text" id="register-username"
                   className={"form-control" + (this.state.register_fields_valid[0] ? "" : " is-invalid")}
            />
          </div>
          <div className={"my-2"}>
            <label htmlFor="register-email"
                   className={"form-label" + (this.state.register_fields_valid[1] ? "" : " is-invalid")}
            >E-postadresse</label>
            <input type="text" id="register-email"
                   className={"form-control" + (this.state.register_fields_valid[1] ? "" : " is-invalid")}
            />
          </div>
          <div className={"my-2"}>
            <label htmlFor="register-password"
                   className={"form-label" + (this.state.register_fields_valid[2] ? "" : " is-invalid")}
            >Passord</label>
            <input type="password" id="register-password"
                   className={"form-control" + (this.state.register_fields_valid[2] ? "" : " is-invalid")}
            />
          </div>
          <div className={"my-2"}>
            <label
              htmlFor="register-repeat-password"
              className={"form-label" + (this.state.register_fields_valid[3] ? "" : " is-invalid")}
            >Gjenta passordet</label>
            <input
              type="password"
              className={"form-control" + (this.state.register_fields_valid[3] ? "" : " is-invalid")}
              id="register-repeat-password"/>
          </div>
          <div className={"my-2"}>
            <div onClick={this.register} className="btn btn-primary">Registrer!</div>
          </div>
        </form>
      </div>
    </div>
  }
}