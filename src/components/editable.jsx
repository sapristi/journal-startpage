import React, {useState} from 'react';
import ReactMarkdown from 'react-markdown'
import {TextareaAutosize} from '@mui/material';

const useEditableState = (initial, onChange) => {
  const [active, setActive] = useState(false)
  const [curValue, setCurValue] = useState(initial)

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

  return [curValue, active, handleChange, commitChange, handleClick]
}

export const EditableInput = ({value, onChange}) => {
  const [curValue, active, handleChange, commitChange, handleClick] = useEditableState(value, onChange)
  if (active) {
    return <input type="text"
             value={curValue}
             onChange={handleChange}
             onBlur={commitChange}
             autoFocus
           />
  } else {
    return <div onClick={handleClick}><span>{value}</span></div>
  }
}



export const EditableMarkdown = ({value, onChange}) => {
  const [curValue, active, handleChange, commitChange, handleClick] = useEditableState(value, onChange)

  if (active) {
    return <TextareaAutosize
             style={{width: "100%"}}
               value={curValue}
               onChange={handleChange}
               onBlur={commitChange}
               autoFocus
             />
  } else {
    return <div
             onDoubleClick={handleClick}
           >
             <ReactMarkdown>{value}</ReactMarkdown>
           </div>
  }
}

