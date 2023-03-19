const getPermissionssApi = () => {
  if (process.env.REACT_APP_MOCK_BROWSER_APIS === "true") {
    return {
      request: async () => {}
    }
  } else {
    /* eslint-disable */
    return browser.permissions
    /* eslint-enable */
  }
}

export const permissionsAPI = getPermissionssApi()
