import React from "react";
import "./Table.css";

const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found",
}) => {
  if (loading) {
    return (
      <div className="table-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="common-table">

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="table-empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row._id || index}
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}

        </tbody>

      </table>
    </div>
  );
};

export default Table;