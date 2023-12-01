import React from "react";

const SentTicketsTable = () => {
  
	const dummyData = [
		{numbers: [1, 2, 3,4,5], matches: 2, reward: 200},
		{numbers: [4, 23, 30,4,10], matches: 4, reward: 2000},
		{numbers: [7, 2, 18,16,33], matches: 0, reward: 0},
		{numbers: [9, 5, 13,17,28], matches: 1, reward: 0},
	]
	
	return (
    <div>
      <h2>Sent tickets</h2>
      <table>
		{/* table header */}
        <tr>
          <th className="p-5 text-left">Ticket numbers</th>
          <th className="p-5 text-left">Match count</th>
          <th className="p-5 text-left">Reward</th>
        </tr>
		{/* table data */}
		{dummyData.map((d,i) => (<tr><td className="p-5 text-left">{d.numbers.join(" ")}</td><td className="p-5 text-left">{d.matches}</td><td className="p-5 text-left">{d.reward}</td></tr>))}

        {/* sum rewards */}
        <tr>
          <th colSpan={3} className="p-5 text-center">Sum reward</th>
        </tr>
		<tr><td colSpan={3} className="p-5 text-center"> 10000</td></tr>
      </table>
    </div>
  );
};

export default SentTicketsTable;
