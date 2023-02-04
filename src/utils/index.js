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

export const nonEmpty = (obj) => (obj && Object.keys(obj).length > 0)



