import React, { useState } from "react";
import { getRangeArrWithLen } from "./helpers";
import { FaAngleUp, FaAngleDown, FaArrowsAltV } from "react-icons/fa";
import { motion } from "framer-motion";

type DataTableCellData = {
  id: string,
  value: string | number | Date
}

type DataTableColumnData = {
  headerName: string;
  sortable: boolean;
  values: DataTableCellData[];
  formatData?: ((dataElement: any) => JSX.Element) | undefined;
};

export type DataTableData = {
  tableHeader: string;
  tableId: string;
  tableColumnsData: DataTableColumnData[];
};

type TableColSortOrder = "" | "asc" | "desc";

const DataTable = (tableData: DataTableData) => {
  const [orderedCol, setOrderedCol] = useState("");
  const [orderedDir, setOrderedDir] = useState<TableColSortOrder>("");
  const [lastHoveredCol, setLastHoveredCol] = useState("");
  const [lastUnHoveredCol, setLastUnHoveredCol] = useState("");
  

  const defaultFormatData = (dataElement: any) => <span>{dataElement}</span>;

  const setOrder = (colName: string, sortable: boolean) => {
    if (!sortable) return;

    setOrderedCol(colName);
    const oDir = orderedDir === "" ? "asc" : orderedDir === "asc" ? "desc" : "";
    setOrderedDir(oDir);
  };

  const getSortedData = (
    dataArr: any[],
    sortColName: string,
    sortOrder: TableColSortOrder
  ) => {
    if (orderedCol === "") return dataArr;
    if (orderedDir === "") return dataArr;

    // transform data
    let transformedArr: any[] = [];
    for (let rowIdx = 0; rowIdx < dataArr[0].values.length; rowIdx++) {
      const d = dataArr.map((d) => d.values[rowIdx]);
      transformedArr.push(d);
    }

    // sorted col -> index
    const sortedColIdx = dataArr.findIndex((d) => d.headerName === sortColName);

    // sort transformed array
    const dataToCheck = transformedArr[0][sortedColIdx];

    // ordered column is number
    if (typeof dataToCheck === "number") {
      if (sortOrder === "asc")
        transformedArr = transformedArr.sort(
          (d1, d2) => d1[sortedColIdx] - d2[sortedColIdx]
        );
      else if (sortOrder === "desc")
        transformedArr = transformedArr.sort(
          (d1, d2) => d2[sortedColIdx] - d1[sortedColIdx]
        );
    }

    // ordered column is string
    if (typeof dataToCheck === "string") {
      if (sortOrder === "asc") transformedArr = transformedArr.sort();
      else if (sortOrder === "desc")
        transformedArr = transformedArr.sort((d1, d2) =>
          d2[sortedColIdx].localeCompare(d1[sortedColIdx])
        );
    }

    // ordered column is Date type
    if (
      typeof dataToCheck === "object" &&
      Object.prototype.toString.call(dataToCheck) === "[object Date]"
    ) {
      if (sortOrder === "asc")
        transformedArr = transformedArr.sort(
          (d1, d2) => d1[sortedColIdx].getDate() - d2[sortedColIdx].getDate()
        );
      else if (sortOrder === "desc")
        transformedArr = transformedArr.sort(
          (d1, d2) => d2[sortedColIdx].getDate() - d1[sortedColIdx].getDate()
        );
    }

    // transform back sorted array
    const copyedArr = [...dataArr];
    return copyedArr.map((colObj, colIdx) => {
      return {
        ...colObj,
        values: transformedArr.map((rowArr: any[]) => rowArr[colIdx]),
      };
    });
  };

  const sortedData = getSortedData(
    tableData.tableColumnsData,
    orderedCol,
    orderedDir
  );

  // console.log(sortedData)

  const tableHeaderVariants = {
    hover: { translateY: [0,-5], transition: { duration: 0.3, } },
    unhover:{ translateY: [-5,0], transition: { duration: 0.3 } },
  };

  return (
    <div className="my-5">
      <h2 className="text-xl font-bold">{tableData.tableHeader}</h2>
      <table className="sm:min-w-[500px] mt-3 overflow-hidden font-sans border-collapse rounded-lg shadow-sm">
        {/* table header */}
        <thead className="text-white bg-opacity-50 bg-emerald-400 backdrop-blur-md">
          <tr>
            {tableData.tableColumnsData.map((d, i) => {
              // console.log(`header ${d.headerName}`)
              return (
              <th
                key={d.headerName}
                className={`px-5 py-3 text-left ${
                  d.sortable && "hover:text-red-500"
                }`}
                onClick={(e) => setOrder(d.headerName, d.sortable)}
                onMouseOver={() => d.sortable && setLastHoveredCol(d.headerName)}
                onMouseOut={() => {if(d.sortable){setLastHoveredCol(""); setLastUnHoveredCol(d.headerName)}}}
              >
                <motion.div className="flex items-center justify-center"  
                variants={tableHeaderVariants}
                animate={d.sortable && lastHoveredCol === d.headerName ? "hover" : d.sortable && lastUnHoveredCol === d.headerName && "unhover" }
                  >
                  <span>
                    {d.headerName}
                  </span>
                  {d.sortable && orderedCol !== d.headerName && (
                    <FaArrowsAltV />
                  )}
                  {d.sortable &&
                    orderedCol === d.headerName &&
                    (orderedDir === "asc" ? (
                      <FaAngleDown />
                    ) : orderedDir === "desc" ? (
                      <FaAngleUp />
                    ) : (
                      <FaArrowsAltV />
                    ))}
                </motion.div>
              </th>
            )})}
          </tr>
        </thead>
        <tbody className="[&>*:nth-child(odd)]:bg-slate-200 [&>*:nth-child(even)]:bg-slate-300 [&>*:last-of-type]:border-b-4 [&>*:last-of-type]:border-b-emerald-400">
          {/* 0 rows */}
          {tableData.tableColumnsData[0].values.length === 0 && (
            <tr>
              <td
                colSpan={tableData.tableColumnsData.length}
                className="px-5 py-3 text-center"
              >
                There is no any data to show
              </td>
            </tr>
          )}
          {/* table data */}
          {/* each row */}
          {getRangeArrWithLen(sortedData[0].values.length).map((i, rowIdx) => (
            <tr key={`${tableData.tableId}_r_${rowIdx}`}
            >
              {/* each col */}
              {sortedData.map((actCol, colIdx) => {
                //console.log(rowIdx * sortedData.length + colIdx)
                // console.log(`${tableData.tableId}_r_${rowIdx}`)
                //console.log(actCol.values[rowIdx].id)
                return (
                  <td key={`${tableData.tableId}_${actCol.values[rowIdx].id}`}
                    className="px-5 py-3 text-left"
                  >
                    {actCol.formatData
                      ? actCol.formatData(actCol.values[rowIdx].value)
                      : defaultFormatData(actCol.values[rowIdx].value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
