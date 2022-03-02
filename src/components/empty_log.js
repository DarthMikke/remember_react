import React from "react";

export default function EmptyLog() {
  return <tr>{/* key={`chore_${x.id}_details`}>*/}
    <td/>
    <td colSpan={2}><i>Denne oppgåva har ikkje vorte loggført enno.</i></td>
    <td/>
  </tr>
}
