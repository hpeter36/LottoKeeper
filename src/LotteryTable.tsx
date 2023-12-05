import React, { useState, useContext } from "react";
import { AppContext, LotteryNumbers } from "./ContextProvider";
import { getRangeArrWithLen } from "./helpers";

type LotteryTableInputs = {
	setInfoText: React.Dispatch<React.SetStateAction<string>>
}

const LotteryTable = ({setInfoText} : LotteryTableInputs) => {
  const { tickets, setTickets, draws, playerData, setPlayerData, adminData, setAdminData, lotteryMeta } = useContext(AppContext);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const maxNumbersSelected = selectedNumbers.length === 5;

  const handleNumberSelection = (num: number) => {

	const isAdd = selectedNumbers.indexOf(num) === -1;

	// unselect
	if(!isAdd) {
		setSelectedNumbers((prev) => prev.filter((n) => n !== num));
		setInfoText!(`${num} is unselected`)
	}

	// maximum allowed selection
	if(selectedNumbers.length === 5)
	{
		setInfoText!("Maximum 5 numbers can be selected")
		return
	}

	// select
    if (isAdd) {
      setSelectedNumbers((prev) => [...prev, num]);
	  setInfoText!(`${num} is selected`)
    } 
	
  };

  const handleSendTicket = () => {

	// check for player balance
	if(playerData.balance < lotteryMeta.ticketPrice)
	{
		setInfoText!(`Player does not have enough money to send tickets, one ticket costs ${lotteryMeta.ticketPrice} akcse`)
		return
	}

	setPlayerData!((prev) => {return {...prev, balance: prev.balance - lotteryMeta.ticketPrice}})
	setTickets!([...tickets, {
		id: tickets.length,
  		date: new Date(),
  		drawID: draws.find(d => !d.numbers)!.id,
  		player: "Player",
  		numbers: selectedNumbers as LotteryNumbers,
		numbersHit: undefined,
  		hits: undefined,
  		reward: 0,
	} ])
	setAdminData!({...adminData, balance: adminData.balance + lotteryMeta.ticketPrice})
	setSelectedNumbers([])
	setInfoText!(`Ticket is sent with id#: ${tickets.length}`)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* lottery table */}
      <div className="flex w-[500px] flex-wrap">
        {
		getRangeArrWithLen(lotteryMeta.totalNumberCount).map((i) => (
          <div key={i}
            className={`flex justify-center items-center p-2 hover:bg-slate-300 rounded-full ${
              selectedNumbers.indexOf(i) !== -1 && " bg-red-500"
            }`}
            style={{ minWidth: "60px", minHeight: "60px" }}
            onClick={() => handleNumberSelection(i)}
          >
            <span>{i}</span>
          </div>
        ))}
      </div>
      {/* send ticket button */}
      <div>
        <button className={`bg-slate-200 ${maxNumbersSelected ? "opacity-100" : "opacity-50" }`} disabled={maxNumbersSelected ? false: true } onClick={handleSendTicket}>Send ticket</button>
      </div>
    </div>
  );
};

export default LotteryTable;
