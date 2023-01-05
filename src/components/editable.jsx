import React, {useState} from 'react';

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

  return [curValue, handleChange, commitChange, handleClick]
}

export const EditableInput = ({value, onChange}) => {
  const [active, setActive] = useState(false)
  const [curValue, setCurValue] = useState(value)

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

  if (active) {
    return <input
             className="input"
             value={curValue}
             onChange={handleChange}
             onBlur={commitChange}
             autoFocus
           />
  } else {
    return <span onClick={handleClick}>{value}</span>
  }
}



export const EditableArea = ({value, onChange}) => {
  const [active, setActive] = useState(false)
  const [curValue, setCurValue] = useState(value)

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

  if (active) {
    return <textarea
               className="textarea"
               value={curValue}
               onChange={handleChange}
               onBlur={commitChange}
               autoFocus
             />
  } else {
    return <div
             className="content"
             onClick={handleClick}
             style={{whiteSpace: "pre-wrap", textAlign: "left"}}
           >
             {value}
           </div>
  }
}

