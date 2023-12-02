import React from "react";
import { TicketData } from "./ContextProvider";

type SentTicketsTableInputs = {
  ticketData: TicketData[]
}

const SentTicketsTable = ({ticketData}: SentTicketsTableInputs) => {

  const ticketsForPlayer = ticketData.filter(d => d.player === "Player")
	
	return (
    <div>
      <h2>Sent tickets</h2>
      <table>
		{/* table header */}
        <thead>
          <tr>
          <th className="p-5 text-left">Ticket numbers</th>
          <th className="p-5 text-left">Match count</th>
          <th className="p-5 text-left">Reward</th>
          </tr>
        </thead>
        <tbody>
    {ticketsForPlayer.length === 0 && (<tr><td colSpan={3} className="p-5 text-center">There is no any ticket sent</td></tr>)}
		{/* table data */}
		{ticketsForPlayer.sort((d1, d2) => d1.date.getTime() - d2.date.getTime()).map((d,i) => (
    <tr key={i}>
      <td className="p-5 text-left">{d.numbers.join(" ")}</td>
      <td className="p-5 text-left">{d.hits ? d.hits : "-"}</td>
      <td className="p-5 text-left">{d.hits ? d.reward : "-"}</td></tr>))}

        {/* sum rewards */}
        <tr>
          <th colSpan={3} className="p-5 text-center">Sum reward</th>
        </tr>
		<tr><td colSpan={3} className="p-5 text-center">{ticketsForPlayer.map(d => d.reward).reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</td></tr></tbody>
      </table>
    </div>
  );
};

export default SentTicketsTable;
