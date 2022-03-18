import Field from "./Field";
import React from "react";

export default class UserSearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: undefined,
      searching: false,
      sharedWith: props.sharedWith.map(x => x.id),
    }

    this.autocomplete = this.autocomplete.bind(this);
    console.log(props.sharedWith.map(x => x.id));
  }

  autocomplete(query) {
    if (query === "") {
      return;
    }
    console.log(this.state.searching);
    if (this.state.searching) {
      this.setState({query: query})
      return;
    }
    this.setState({searching: true});

    try {
      this.props.API.userSearch(query)
        .then((json) => {
          console.log(json);
          this.setState({query: query, searching: false, response: json.profiles});
        });
    } catch (e) { console.error(e); }
  }

  /**
   *
   * @param pk {number} PK of the user to share the list with.
   */
  shareWith(pk) {
    this.props.completion(pk);
    if (this.state.sharedWith.findIndex(x => x === pk) === -1) {
      this.setState({sharedWith: [...this.state.sharedWith, pk]})
    }
  }

  render() {
    const search_prompt = <p className={"text-center"}><i>Tast inn ei epostadresse</i></p>;
    const searching_message = <p className={"text-center"}>Søker…</p>;
    const empty_results = <p className={"text-center"}>Ingen brukarar funne</p>;

    let results;
    if (this.state.response === undefined) {
      results = this.state.searching ? searching_message : search_prompt;
    } else {
      results = this.state.response.length > 0 ? <>
        {this.state.response.map(x => <li className={"dropdown-item"}>
          <div className="row">
            <div className="col">
              <a href={"#"} onClick={() => this.shareWith(x.id)}>
                {x.name}
              </a>
            </div>
            { (this.state.sharedWith.filter(y => y === x.id).length > 0) &&
              <div className="col text-end">
                <i className="bi bi-check-circle"/>
              </div>
            }
          </div>
        </li>)}
      </> : empty_results;
    }

    return <>
      <Field placeholder={"epost"} onChange={this.autocomplete}/>
      <hr className={"dropdown-divider"}/>
      {results}
    </>;
  }
}
