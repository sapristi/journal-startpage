import ff from 'utils/feature_flags'

const getPermissionssApi = () => {
  if (ff.MOCK_BROWSER_APIS) {
    return {
      request: async () => {},
      contains: async () => {}
    }
  } else  if (navigator.userAgent.match(/chrome|chromium|crios/i)){
    /* eslint-disable */
    return chrome.permissions
    /* eslint-enable */
  } else if (navigator.userAgent.match(/firefox|fxios/i)){
    /* eslint-disable */
    return browser.permissions
    /* eslint-enable */
  }
}

export const permissionsAPI = getPermissionssApi()

const urlRe = /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$/
export const requestUrlPermission = async (url) => {
  if (!url) {return false}
  if (urlRe.test(url)) {
    return await permissionsAPI.request({origins: [url]});
  } else {
    console.warn("Cannot request permission for invalid url", url)
    return false
  }
}

export const checkUrlPermission = async (url) => {
  if (urlRe.test(url)) {
    return await permissionsAPI.contains({origins: [url]});
  } else {
    console.warn("Cannot check permission for invalid url", url)
    return false
  }
}
