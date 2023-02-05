import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import {Link,  TextField, Table, TableBody, TableCell, TableHead, TableRow, TableContainer} from '@mui/material';
import remarkGfm from 'remark-gfm'

const useEditableState = (initial, onChange) => {
  const [active, setActive] = useState(false)
  const [curValue, setCurValue] = useState(initial)

  /* update curValue if the initial value was changed externally */
  useEffect(
    () => {
      setCurValue(initial)
    },
    [initial]
  )
  const handleChange = (event) => {
    setCurValue(event.target.value)
  }
  const commitChange = () => {
    setActive(false);
    onChange(curValue);
  }

  const handleClick = () => {
    setActive(true);
  }
  const cancelChange = () => {
    setCurValue(initial);
    setActive(false);
  }
  return {curValue, active, handleChange, commitChange, cancelChange, handleClick}
}

export const EditableInput = ({value, onChange, Component, componentProps}) => {
  const {curValue, active, handleChange, commitChange, cancelChange, handleClick} = useEditableState(value, onChange)
  const handleKeyPress = (event) => {
    if (event.code === "Enter" && event.ctrlKey) {
      commitChange()
    }
  }
  const handleKeyUp = (event) => {
    if (event.code === "Escape") {
      cancelChange()
    }
  }
  if (active) {
    return <TextField type="text"
                      value={curValue}
                      onChange={handleChange}
                      onBlur={commitChange}
                      autoFocus
                      variant="standard"
                      onKeyPress={handleKeyPress}
                      onKeyUp={handleKeyUp}
                      fullWidth
           />
  } else {
    return <Component {...componentProps} onDoubleClick={handleClick}>{value}</Component>
  }
}

const mdComponents = {
  a:  (node, ...props) => <Link href={node.href} target="_blank">{node.children}</Link>,
  table: (node, ...props) => <Table sx={{width: "auto"}}>{node.children}</Table>,
  thead: (node, ...props) => <TableHead sx={{"& th": {fontSize: "1.25rem"},borderBottom: "2px solid black"}}>{node.children}</TableHead>,
  tbody: (node, ...props) => <TableBody>{node.children}</TableBody>,
  tr: (node, ...props) => <TableRow>{node.children}</TableRow>,
  td: (node, ...props) => <TableCell>{node.children}</TableCell>,
  th: (node, ...props) => <TableCell>{node.children}</TableCell>,
}

export const EditableMarkdown = ({value, onChange}) => {
  const {curValue, active, handleChange, commitChange, cancelChange, handleClick} = useEditableState(value, onChange)

  const handleKeyPress = (event) => {
    if (event.code === "Enter" && event.ctrlKey) {
      commitChange()
    }
  }
  const handleKeyUp = (event) => {
    if (event.code === "Escape") {
      cancelChange()
    }
  }
  if (active) {
    return <TextField
             sx={{width: "100%"}}
             value={curValue}
             onChange={handleChange}
             onBlur={commitChange}
             autoFocus
             onKeyPress={handleKeyPress}
             onKeyUp={handleKeyUp}
             multiline
           />
  } else {
    return (
      <div
        onDoubleClick={handleClick}
        style={{flexGrow: 1}}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={mdComponents}
        >{value}</ReactMarkdown>
      </div>)
  }
}

