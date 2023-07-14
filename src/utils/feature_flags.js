const DEV_MODE = (process.env.REACT_APP_DEV_MODE === "true")
/*
  MOCK_BROWSER_APIS and USE_LOCALSTORAGE
  need to be enabled if using the app as a regular website
  (i.e. not as an extension)
*/
const MOCK_BROWSER_APIS = (process.env.REACT_APP_MOCK_BROWSER_APIS === "true")
const USE_LOCALSTORAGE = (process.env.REACT_APP_USE_LOCALSTORAGE === "true")
const LOG  = (process.env.REACT_APP_LOG === "true" || DEV_MODE)

const feature_flags = {
  MOCK_BROWSER_APIS,
  USE_LOCALSTORAGE,
  LOG
}

export default feature_flags
