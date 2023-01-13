import React, {useState} from 'react';
import { marked } from 'marked';
import {TextareaAutosize, Link} from '@mui/material';

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
  const cancelChange = () => {
    setCurValue(initial);
    setActive(false);
  }
  return {curValue, active, handleChange, commitChange, cancelChange, handleClick}
}

export const EditableInput = ({value, onChange}) => {
  const {curValue, active, handleChange, commitChange, handleClick} = useEditableState(value, onChange)
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


/*
Adds MUI Link CSS classes to links.
A <Link/> needs to be present in the app for
the CSS classes to be available.
 */
const renderer = {
  link(href, title, text) {
    return `
            <a href="${href}" class="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineAlways css-8ofoxr-MuiTypography-root-MuiLink-root"  target="_blank">
${text}
            </a>`;
  }
};
marked.use({ renderer });
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
    return <TextareaAutosize
             style={{width: "100%"}}
               value={curValue}
               onChange={handleChange}
               onBlur={commitChange}
               autoFocus
               onKeyPress={handleKeyPress}
             onKeyUp={handleKeyUp}
             />
  } else {
    const html = {__html: marked.parse(value)}
    return <div
             onDoubleClick={handleClick}
             style={{flexGrow: 1}}
             dangerouslySetInnerHTML={html}
           >
             {/* <ReactMarkdown>{value}</ReactMarkdown> */}
           </div>
  }
}

