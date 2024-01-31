import React, { useState, useContext } from "react";
import { AppContext, LotteryNumbers } from "./ContextProvider";
import { getRangeArrWithLen } from "./helpers";
import { motion } from "framer-motion";

type LotteryTableInputs = {
  setInfoText: (text: string) => void;
};

const LotteryTable = ({ setInfoText }: LotteryTableInputs) => {
  const {
    tickets,
    setTickets,
    draws,
    playerData,
    setPlayerData,
    adminData,
    setAdminData,
    lotteryMeta,
  } = useContext(AppContext);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [lastClickedNumber, setLastClickedNumber] = useState(-1);
  const [lastHoveredNumber, setLastHoveredNumber] = useState(-1);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const maxNumbersSelected = selectedNumbers.length === 5;

  const handleNumberSelection = (num: number) => {
    setLastClickedNumber(num);

    const isAdd = selectedNumbers.indexOf(num) === -1;

    // unselect
    if (!isAdd) {
      setSelectedNumbers((prev) => prev.filter((n) => n !== num));
      setInfoText!(`${num} is unselected`);
    }

    // maximum allowed selection
    if (selectedNumbers.length === 5) {
      setInfoText!("Maximum 5 numbers can be selected");
      return;
    }

    // select
    if (isAdd) {
      setSelectedNumbers((prev) => [...prev, num]);
      setInfoText!(`${num} is selected`);
    }
  };

  const handleSendTicket = () => {
    setButtonClicked(true);

    // check for player balance
    if (playerData.balance < lotteryMeta.ticketPrice) {
      setInfoText!(
        `Player does not have enough money to send tickets, one ticket costs ${lotteryMeta.ticketPrice} akcse`
      );
      return;
    }

    setPlayerData!((prev) => {
      return { ...prev, balance: prev.balance - lotteryMeta.ticketPrice };
    });
    setTickets!([
      ...tickets,
      {
        id: tickets.length,
        date: new Date(),
        drawID: draws.find((d) => !d.numbers)!.id,
        player: "Player",
        numbers: selectedNumbers as LotteryNumbers,
        numbersHit: undefined,
        hits: undefined,
        reward: 0,
      },
    ]);
    setAdminData!({
      ...adminData,
      balance: adminData.balance + lotteryMeta.ticketPrice,
    });
    setSelectedNumbers([]);
    setInfoText!(`Ticket is sent with id#: ${tickets.length}`);
  };

  const cellAnimVariants = {
    hover: { scale: 1.1 },
    unhover: { scale: 1.0 },
    click: { scale: [0.9, 1.1] },
  };

  const buttonAnimVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    unhover: { scale: 1.0 },
    click: { scale: [0.9, 1.1] },
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* lottery table */}
      <div className="flex gap-1 justify-center max-w-[500px] flex-wrap bg-green-500 bg-opacity-70 text-slate-100 my-5 py-5 backdrop-blur-md">
        {
          // generate each cell
          getRangeArrWithLen(lotteryMeta.totalNumberCount).map((i) => (
            <motion.div
              key={i}
              className={`flex justify-center items-center border-green-700 border-[1px] p-2 hover:bg-green-700 ${
                selectedNumbers.indexOf(i) !== -1 &&
                " bg-green-700 text-red-500 font-bold"
              }`}
              style={{ minWidth: "60px", minHeight: "60px" }}
              onMouseOver={() => setLastHoveredNumber(i)}
              onMouseOut={() => setLastHoveredNumber(-1)}
              onClick={() => handleNumberSelection(i)}
              variants={cellAnimVariants}
              animate={
                lastClickedNumber === i
                  ? "click"
                  : lastHoveredNumber === i
                  ? "hover"
                  : "unhover"
              }
              onAnimationComplete={(definition) => {
                if (definition.toString() === "click") setLastClickedNumber(-1);
              }}
            >
              <span className="font-semibold">{i}</span>
            </motion.div>
          ))
        }
      </div>
      {/* send ticket button */}
      <div>
        <motion.button
          className={`bg-green-500 ${
            maxNumbersSelected
              ? "hover:bg-green-700 hover:text-white opacity-100"
              : "opacity-50"
          }`}
          disabled={maxNumbersSelected ? false : true}
          onClick={handleSendTicket}
          onMouseOver={() => setButtonHovered(true)}
          onMouseOut={() => setButtonHovered(false)}
          variants={buttonAnimVariants}
          animate={
            buttonClicked && maxNumbersSelected ? "click" : buttonHovered && maxNumbersSelected ? "hover" : "unhover"
          }
          onAnimationComplete={(definition) => {
            if (definition.toString() === "click") setButtonClicked(false);
          }}
        >
          Send ticket
        </motion.button>
      </div>
    </div>
  );
};

export default LotteryTable;
