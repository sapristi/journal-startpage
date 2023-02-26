import React, {Fragment} from 'react';
import {MenuItem , Divider, Stack} from '@mui/material';
import { DataGrid,  GridColumnMenuContainer, GridFooter } from '@mui/x-data-grid';
import { getTimestamp, mapObject, filterObject} from 'utils'
import {ActionInput, Button, IconButton} from "components/base"
import {SaveIcon, AddIcon, DeleteIcon, IconColumnInsertRight } from 'icons';

const RenameColumnInput = ({currentValue, renameColumn}) => {
  return <ActionInput
           currentValue={currentValue}
           action={(value) => renameColumn(currentValue, value)}
           Icon={SaveIcon}
           label="Rename column"
           textFieldProps={{size: "small", color: "primary"}}
         />
}

const CustomMenu = ({hideMenu, currentColumn, renameColumn, removeColumn,  ...other}) => {
  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      {...other}
    >
      <MenuItem >
        <Button
          variant="outlined"
          endIcon={<DeleteIcon/>}
          onClick={() => removeColumn(currentColumn.field)}>Remove column</Button>
      </MenuItem>
      <MenuItem>
        <RenameColumnInput currentValue={currentColumn.field} renameColumn={renameColumn} />
      </MenuItem>
    </GridColumnMenuContainer>
  )
}

const renderActionsColumn = ({params, removeRow}) => {
  const onClick = (e) => {
    e.stopPropagation(); // don't select this row after clicking
    removeRow(params.id)
  };

  return <IconButton onClick={onClick}><DeleteIcon/></IconButton>;
}


const CustomFooter = (props) => {
  console.log("Footer", props)
  return <GridFooter/>
}

export const TabularNoteBody = ({entryKey, state, setEntry, handleDelete}) => {
  const { columns, rows} = state

  const removeRow = (rowId) => {
    setEntry(entryKey, {
      ...state,
      rows: rows.filter(row => row.id !== rowId)
    })
  }
  const cols = columns.map((name) => ({
    field: name, headerName: name, editable: true,
    flex: 1
  }))
  const deleteButtonCol = {
    field: "action",
    headerName: "Actions",
    sortable: false,
    renderCell: (params) => renderActionsColumn({params, removeRow})
  }
  const addRow = () => setEntry(entryKey, {...state, rows: [...state.rows, {
    id: getTimestamp(),
  }]})
  const addColumn = (colName) => setEntry(entryKey, {...state, columns: [...state.columns, colName]})

  const renameColumn = (colName, newColName) => {
    const rename = value => (value === colName)? newColName: value
    const newColumns = columns.map(rename)
    const newRows = rows.map(
      row => mapObject(row, ([key, value]) => ([rename(key), value]))
    )
    setEntry(entryKey, {
      ...state,
      rows: newRows,
      columns: newColumns,
    })

  }
  const removeColumn = (colName) => {
    const newColumns = columns.filter(col => col !== colName)
    const newRows = rows.map(
      row => filterObject(row, (key, value) => key !== colName)
    )
    setEntry(entryKey, {
      ...state,
      rows: newRows,
      columns: newColumns,
    })
  }
  const processRowUpdate = (data) => {
    setEntry(entryKey, {...state, rows:
      state.rows.map(row => {
        if (row.id === data.id) {return data}
        else {return row}
      })
    })
    return data
  }
  return (

    <Fragment>
      <Stack direction="row">
        <Button onClick={addRow}>Add Row</Button>
        <ActionInput
          currentValue=""
          action={addColumn}
          Icon={AddIcon}
          label="Add column"
          textFieldProps={{color: "primary"}}
        />

        {/* <InputButton label="Add column" placeholder="column name" action={addColumn}/> */}
      </Stack>
      <Divider/>
        <DataGrid
          columns={[...cols, deleteButtonCol]}
          rows={rows}
          components={{
            ColumnMenu: CustomMenu,
            Footer: CustomFooter
          }}
          componentsProps={{
            columnMenu: {
              renameColumn,
              removeColumn
            }
          }}
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={console.log}
          autoHeight
        />
    </Fragment>
  )
}
