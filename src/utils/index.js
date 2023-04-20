export const getTimestamp = () => {
  return Date.now()
}

export const getRandomId = () => {
  return Math.random().toString(36).slice(2, 7);
}


export const makeLogger = (name) => {
  const log = (...args) => {
    if (process.env.REACT_APP_LOG === "true") {
      console.log(name, ...args)
    }
  }
  return log
}

export const isEmpty = (obj) => (!obj || Object.keys(obj).length === 0)


export const saveFile = async (filename, blob) => {
  const a = document.createElement('a');
  a.download = filename;
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};


export const filterObject = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate))
export const mapObject = (obj, mapFn) => Object.fromEntries(Object.entries(obj).map(mapFn))

export const logCall = (name, callable) => {
  const inner = (...args) => {
    const res = callable(...args)
    console.log(args, "=>", res)
    return res
  }
  return inner
}

export const helpText = `

## Features

- Task list
- Journal entries
- Notes (textual and tabular)

See [source and more](https://github.com/sapristi/journal-startpage).

## Text inputs

- Double click to edit
- Ctrl+Enter to validate (or click outside)
- Escape to cancel edition

## Shortcuts

- \`n\` to create a new entry (journal or note)
- \`t\` to create a new task
- \`s\` to switch between journal and notes
- \`e\` to edit the last entry (journal or note)
`



const matched = x => ({
  on: () => matched(x),
  otherwise: () => x,
})

const cleverEval = (fn, x) => (
  (typeof(fn) === "function")
    ? fn(x) : fn
)

export const match = (x, cmp = (a,b) => a===b) => ({
  on: (pred, fn) => (
    (typeof(pred) === "function")
      ? (pred(x) ? matched(cleverEval(fn, x)) : match(x, cmp))
      : ((cmp(x, pred)) ? matched(cleverEval(fn, x)) : match(x, cmp))
  ),
  otherwise: fn => cleverEval(fn, x),
})
