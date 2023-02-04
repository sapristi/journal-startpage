const makeLocalStorageAdapter = () => {
  const get = (arg, callback) => {
    if (!arg) {
      callback(Object.fromEntries(
        Object.entries(localStorage).map(
          ([key, value]) => ([key, JSON.parse(value)])
        )))
    } else if (typeof arg === "string") {
      callback({
        [arg]: JSON.parse(localStorage.getItem(arg))
      })} else {
        // not handling arrays or objects for now
        throw new Error(`Unsupported value ${arg}`)
      }
  }
  const set = (obj) => {
    Object.entries(obj).forEach(
      ([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      }
    )
  }
  const onChanged = {
    addListener: (callback) => {
      // we can't do anything here
    }
  }

  const remove = (keys) => {keys.forEach(key => localStorage.removeItem(key))}

  return {
    get, set, onChanged, remove
  }
}


const getStorage = () => {
  /* eslint-disable */
  if (process.env.REACT_APP_USE_LOCALSTORAGE === "true") {
    // used to generate demo
    return makeLocalStorageAdapter()
  } else  if (navigator.userAgent.match(/chrome|chromium|crios/i)){
    return chrome.storage.sync
  } else if (navigator.userAgent.match(/firefox|fxios/i)){
    /* same interface for firefox than chrome */
    const get = (arg, callback) => {
      browser.storage.sync.get(arg).then(callback)
    }
    return {
      ...browser.storage.sync,
      get,
    }
  }
  /* eslint-enable */
}

export const storage = getStorage()
