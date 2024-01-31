import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface NotifyTextInputs {
  text: string;
}

const NotifyText = ({ text }: NotifyTextInputs) => {
  const [infoText, setInfoText] = useState(text);
  const [isInfoTextShown, setIsInfoTextShown] = useState(true);

  // set text event
  useEffect(() => {
    setInfoText(text);
    setIsInfoTextShown(true);
  }, [text]);

  return (
    <motion.div
      variants={{ open: { opacity: 1 }, close: { opacity: 0 } }}
      animate={isInfoTextShown && infoText != "" ? "open" : (!isInfoTextShown || infoText == "") && "close"}
      transition={{ duration: 1 }}
      className={`absolute text-lg text-center bg-amber-200 min-w-[500px] p-2 rounded-md ${infoText == "" && "hidden"}`}
      onClick={() => setIsInfoTextShown(false)}
    >
      {infoText}
      <IoClose className="absolute right-1 top-3 hover:bg-amber-500 hover:rounded-full" />
    </motion.div>
  );
};

export default NotifyText;
