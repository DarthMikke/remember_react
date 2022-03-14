import Field from "./Field";
import React from "react";

export default class UserSearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: undefined,
      searching: false,
    }

    this.autocomplete = this.autocomplete.bind(this);
  }

  autocomplete(query) {
    console.log(this.state.searching);
    if (this.state.searching) {
      this.setState({query: query})
      return;
    }
    this.setState({searching: true});
    this.props.completion(query).then((response) =>
      this.setState({query: query, searching: false, response: response})
    );
  }

  render() {
    const search_prompt = <p className={"text-center"}><i>Tast inn ei epostadresse</i></p>;
    const searching_message = <p className={"text-center"}>Søker…</p>;
    const empty_results = <p className={"text-center"}>Ingen brukarar funne</p>;

    let results;
    if (this.state.response === undefined) {
      results = this.state.searching ? searching_message : search_prompt;
    } else {
      results = this.state.response.count > 1 ? <>
        {this.state.response.map(x => <li className={"dropdown-item"}>{x.name}</li>)}
      </> : empty_results;
    }

    return <>
      <Field placeholder={"epost"} onChange={this.autocomplete}/>
      <hr className={"dropdown-divider"}/>
      {results}
    </>;
  }
}
