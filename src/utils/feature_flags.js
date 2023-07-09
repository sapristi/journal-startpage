const MOCK_BROWSER_APIS = (process.env.REACT_APP_MOCK_BROWSER_APIS === "true")
const USE_LOCALSTORAGE = (process.env.REACT_APP_USE_LOCALSTORAGE === "true")
const CLOUD_SYNC = (process.env.REACT_APP_CLOUD_SYNC === "true")
const LOG  = (process.env.REACT_APP_LOG === "true")

const feature_flags = {
  MOCK_BROWSER_APIS,
  USE_LOCALSTORAGE,
  CLOUD_SYNC,
  LOG
 }

export default feature_flags
