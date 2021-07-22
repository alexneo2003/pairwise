import React from 'react';
import { useTable } from 'react-table';
import BTable from 'react-bootstrap/Table';
import { PlusLg } from 'react-bootstrap-icons';

const Table = () => {
  const data = React.useMemo(
    () => [
      {
        col1: 'Hello',
        col2: 'World',
      },
      {
        col1: 'react-table',
        col2: 'rocks',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Column 1',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Column 2',
        accessor: 'col2',
      },
    ],
    []
  );

  const onPlusClick = (type) => {
    switch (type) {
      case 'column':
        console.log('column');
        break;

      case 'row':
        console.log('row');

        break;

      case 'columnRow':
        console.log('columnRow');

        break;

      default:
        break;
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <BTable {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.headers}>
            {headerGroup.headers.map((column, index) => (
              <th key={index} {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
            <th>
              <PlusLg onClick={() => onPlusClick('column')} />
            </th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.index}>
              {row.cells.map((cell) => {
                return (
                  <td key={cell.value} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
              <td>
                <PlusLg onClick={() => onPlusClick('column')} />
              </td>
            </tr>
          );
        })}
        <tr>
          {rows[0].cells.map((cell) => {
            return (
              <td>
                <PlusLg onClick={() => onPlusClick('row')} />
              </td>
            );
          })}
          <td>
            <PlusLg onClick={() => onPlusClick('columnRow')} />
          </td>
        </tr>
      </tbody>
    </BTable>
  );
};

export default Table;
