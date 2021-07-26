/* eslint-disable no-undef */
import React, { useState } from 'react';
import { PlusLg } from 'react-bootstrap-icons';
import styled from 'styled-components';
import shortid from 'shortid';
import { useTable } from 'react-table';
import BTable from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://kanban-server.vercel.app' : 'http://localhost:3030'

const PlusLgPointer = styled(PlusLg)`
  cursor: pointer;
  ${
    '' /* fill-opacity: 0.5;
  transition-duration: 0.3s;
  $:hover {
    fill-opacity: 1;
  } */
  }
`;

const StyledInput = styled.input`
  border: none;
  height: 38px;
  min-width: 58px;
  outline: none;
  padding: 10px;
  text-align: center;
`;

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <StyledInput value={value} onChange={onChange} onBlur={onBlur} placeholder="{ your value }" />;
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

const Table = ({ columns, data, updateMyData, skipPageReset, onPlusClick }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
    defaultColumn,
    autoResetPage: !skipPageReset,
    updateMyData,
  });

  // console.log('rows', rows);
  // console.log('columnsState', columnsState);

  return (
    <BTable {...getTableProps()} bgcolor="#ffffff">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.headers}>
            {headerGroup.headers.map((column) => (
              <th key={column.id} {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
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
                <PlusLgPointer onClick={() => onPlusClick('column')} />
              </td>
            </tr>
          );
        })}
        <tr>
          {rows &&
            rows.length &&
            rows[0].cells.map((cell) => {
              return (
                <td key={cell.getCellProps().key}>
                  <PlusLgPointer onClick={() => onPlusClick('row')} />
                </td>
              );
            })}
          <td>
            <PlusLgPointer onClick={() => onPlusClick('columnRow')} />
          </td>
        </tr>
      </tbody>
    </BTable>
  );
};

const TableView = () => {
  const [initialData, setInitialData] = useState([
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
  ]);

  const [initialColumns, setInitialColumns] = useState([
    {
      Header: '',
      accessor: 'col1',
    },
  ]);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [initialData]);

  const data = initialData;
  const columns = initialColumns;

  const addColumn = () => {
    const newAccessor = shortid.generate();

    setInitialColumns((prevState) => [...prevState, { Header: '', accessor: newAccessor }]);

    setInitialData((prevState) =>
      prevState.map((row) => {
        return Object.assign(row, { [newAccessor]: '' });
      }),
    );
  };

  const addRow = () => {
    const newRow = {};

    initialColumns.forEach((col) => {
      newRow[col.accessor] = '';
    });

    setInitialData((prevState) => [...prevState, newRow]);
  };

  // console.log('initialColumns', initialColumns);
  // console.log('initialData', initialData);

  const onPlusClick = (type) => {
    switch (type) {
      case 'column':
        console.log('column');
        addColumn();
        break;

      case 'row':
        console.log('row');
        addRow();

        break;

      case 'columnRow':
        console.log('columnRow');
        addColumn();
        addRow();

        break;

      default:
        break;
    }
  };

  const updateMyData = (rowIndex, columnId, value) => {
    console.log('rowIndex, columnId, value', rowIndex, columnId, value);
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setInitialData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      }),
    );
  };

  const onSendPairwiseRequest = () => {
    axios
      .post(`${BASE_URL}/pairwise`, null, {
        responseType: 'blob',
      })
      .then((response) => {
        // eslint-disable-next-line no-undef
        const url = window.URL.createObjectURL(
          // eslint-disable-next-line no-undef
          new Blob([response.data], { type: `${response.headers['content-type']};charset=utf-8` }),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'pairwise.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  return (
    <>
      <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        onPlusClick={onPlusClick}
      />
      <Button onClick={onSendPairwiseRequest}>Get Pairwise</Button>
    </>
  );
};

export default TableView;
