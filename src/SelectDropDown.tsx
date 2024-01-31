import React, { useState } from "react";

interface SelectDropDownInputs extends React.HTMLAttributes<HTMLDivElement>  {
  id: string
  label: string
  options: string[];
  selectEvent?: (selected: string) => void;
};

const SelectDropDown = ({ id, label, options, selectEvent, ...rest}: SelectDropDownInputs) => {

  const [selected, setSelected] = useState("");

  const selectionChangedEvent = (event: React.ChangeEvent<HTMLSelectElement>) => {

    setSelected(event.target.value);

    if (selectEvent) selectEvent(event.target.value);
  };

  return (
    <div {...rest}>
      <label htmlFor={id} className="font-semibold ">{label}</label>
      <select className="ml-3" id={id} name={id} value={selected} onChange={selectionChangedEvent}>
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
