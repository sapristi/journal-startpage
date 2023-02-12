const parse_safe = (value) => {
  try {
    return JSON.parse(value)
  } catch  {
    return undefined
  }
}

const makeLocalStorageAdapter = () => {
  const get = (arg, callback) => {
    if (!arg) {
      callback(Object.fromEntries(
        Object.entries(localStorage).map(
          ([key, value]) => ([key, parse_safe(value)])
        ).filter(
          ([key, value]) => (value !== undefined)
        )
      ))
    } else if (typeof arg === "string") {
      callback({
        [arg]: JSON.parse(localStorage.getItem(arg))
      })} else {
        // not handling arrays or objects for now
        throw new Error(`Unsupported value ${arg}`)
      }
  }
  const callbacks = []
  const onChanged = {
    addListener: (callback) => {
      // We could also add a listener for storage events
      // See https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
      // - only usefull for multi-window
      // - slightly different interface
      callbacks.push(callback)
    }
  }
  const set = (obj) => {
    Object.entries(obj).forEach(
      ([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      }
    )
    const event = Object.entries(obj).map(
      ([key, value]) => ({
        oldValue: localStorage.getItem(key),
        newValue: value
      })
    )
    for (const callback of callbacks) {
      callback(event)
    }
  }

  const remove = (keys) => {
    keys.forEach(key => localStorage.removeItem(key))
    const event = Object.fromEntries(
      keys.map(
        (key) => [key, localStorage.getItem(key)]
      ).filter(
        ([key, value]) => value !== null
      ).map(
        ([key, value]) => ([key, {oldValue: value}])
      ))
    for (const callback of callbacks) {
      callback(event)
    }

  }

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
