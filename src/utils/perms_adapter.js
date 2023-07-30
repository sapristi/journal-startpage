import ff from "utils/feature_flags";

const getPermissionssApi = () => {
  if (ff.MOCK_BROWSER_APIS) {
    return {
      request: async () => {},
      contains: async () => true,
    };
  } else if (navigator.userAgent.match(/chrome|chromium|crios/i)) {
    /* eslint-disable */
    return chrome.permissions;
    /* eslint-enable */
  } else if (navigator.userAgent.match(/firefox|fxios/i)) {
    /* eslint-disable */
    return browser.permissions;
    /* eslint-enable */
  }
};

export const permissionsAPI = getPermissionssApi();

const getUrlForPerm = (url) => {
  const URLobj = new URL(url);
  return `${URLobj.origin}/`;
};

export const requestUrlPermission = async (url) => {
  if (!url) {
    return false;
  }
  try {
    return await permissionsAPI.request({ origins: [getUrlForPerm(url)] });
  } catch (error) {
    console.warn(`Cannot request permission for invalid url (${error})`, url);
    return false;
  }
};

export const checkUrlPermission = async (url) => {
  try {
    return await permissionsAPI.contains({ origins: [getUrlForPerm(url)] });
  } catch (error) {
    console.warn(`Cannot check permission for invalid url (${error})`, url);
    return false;
  }
};
