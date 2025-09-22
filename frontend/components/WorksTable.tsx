import React from "react";
import { useTable, Column } from "react-table";

import styles from "@/styles/WorksTable.module.css";

interface WorksTableProps {
  columns: Column<any>[];
  data: any[];
  getRowProps: (row: any) => any;
}

export default function WorksTable({ columns, data, getRowProps }: WorksTableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map((headerGroup) => {
          const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <tr key={key} {...restHeaderGroupProps}>
              {headerGroup.headers.map((column) => {
                const { key, ...restHeaderProps } = column.getHeaderProps();
                return (
                  <th key={key} {...restHeaderProps}>{column.render("Header")}</th>
                );
              })}
          </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const { key, ...restRowProps } = row.getRowProps(getRowProps(row));
          return (
            <tr key={key} {...restRowProps}>
              {row.cells.map((cell) => {
                const { key, ...restCellProps } = cell.getCellProps();
                return (
                  <td key={key} {...restCellProps}>{cell.render("Cell")}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}