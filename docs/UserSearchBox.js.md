## States
Possible states are:
- `empty`: displaying a search prompt
- `can_search`: can send a request to the server
- `waiting`: the search API has not responded yet, do not send new responses

They are expressed as two variables:
- `searching {bool}`:
  - `false` if a request can be safely sent to the server;
  - `true` if a request has been sent, but no response received yet.
- `results {Array}`:
  - `undefined` if no response has been received;
  - an `Array` with a list of users matching to the query.
