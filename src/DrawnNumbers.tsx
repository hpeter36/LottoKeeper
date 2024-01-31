import React, { useState, useEffect } from "react";
import { motion, stagger } from "framer-motion";

interface DrawnNumbersInputs {
  actualDrawNumbers: number[] | undefined;
}

const DrawnNumbers = ({ actualDrawNumbers }: DrawnNumbersInputs) => {
  const [numbersChanged, setNumbersChanged] = useState(false);

  useEffect(() => {
    setNumbersChanged(true);
  }, [actualDrawNumbers]);

  const ballsAnimVariants = {
    show: {
      opacity: [0, 1],
      transition: {
        staggerChildren: 0.5,
      },
    },
    hidden: { opacity: 0 },
  };

  const ballAnim = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <motion.div
      className="flex items-center justify-center py-5"
      variants={ballsAnimVariants}
      initial="hidden"
      animate={!numbersChanged && actualDrawNumbers ? "show" : numbersChanged && "hidden"}
	  onAnimationComplete={(definition) => {
		if (definition.toString() === "hidden") setNumbersChanged(false);
	  }}
    >
      {actualDrawNumbers?.map((d, i) => (
        <motion.div
          key={i}
          className="p-5 mx-3 text-white bg-red-500 rounded-full w-[64px] h-[64px] text-center border-red-700 border-[1px] shadow-md"
          variants={ballAnim}
        >
          {d}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DrawnNumbers;
