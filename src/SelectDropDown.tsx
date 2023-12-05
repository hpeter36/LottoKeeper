import React, { useState } from "react";

type SelectDropDownInputs = {
  options: string[];
  selectEvent?: (selected: string) => void;
};

const SelectDropDown = ({ options, selectEvent }: SelectDropDownInputs) => {
  const [selected, setSelected] = useState("");

  const selectionChangedEvent = (event: React.ChangeEvent<HTMLSelectElement>) => {

    setSelected(event.target.value);

    if (selectEvent) selectEvent(event.target.value);
  };

  return (
    <div className="w-[200px]">
      <select value={selected} onChange={selectionChangedEvent}>
        {options.map((d, i) => (
          <option key={i} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDropDown;
