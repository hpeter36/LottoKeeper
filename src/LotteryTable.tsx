import React from "react";

const LotteryTable = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* lottery table */}
      <div className="flex w-[500px] flex-wrap">
        {Array.from({ length: 39 }, (_, index) => index + 1).map((i) => (
          <div className="text-center p-2" style={{ minWidth: "60px" }}>
            {i}
          </div>
        ))}
      </div>
      {/* send ticket button */}
      <div>
        <button>Send ticket</button>
      </div>
    </div>
  );
};

export default LotteryTable;
