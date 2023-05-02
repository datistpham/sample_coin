import {
  PATH_DASHBOARD
} from './routes/paths';
import listSite from './sites/configs.json';

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 92,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};

const ID_SITE = 1;

export const RECAPTCHA_SITEKEY = '6LeLIbAUAAAAAAUWRivfGI6pn3Se7YpBWnUuhoR6';

const listHostnameFound = [];

export const getInfoSite = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      const findSite = listSite.find((a) => a.id === ID_SITE);
      listHostnameFound.push(findSite);

      return findSite;
    }

    listSite.forEach((site) => {
      if (listHostnameFound.length < 1) {
        if (site.hostname.find((a) => a.indexOf(window.location.hostname) > -1)) {
          listHostnameFound.push(site);
        }
      }
    });

    const findSite = listHostnameFound && listHostnameFound.length > 0 ? listHostnameFound[0] : false;

    if (findSite) return findSite;

    return listSite.find((a) => a.id === ID_SITE);
  }


  return listSite.find((a) => a.id === ID_SITE);

};

export const INFO_SITE = getInfoSite();

export const HOST_API = `https://api.money-ai.io`;

// export const HOST_WEB_API = `https://web.${INFO_SITE.hostname[0].replace('www.', '').replace(".api", "")}`;

export const HOST_WEB_API = `https://web.money-ai.io`;

console.log(HOST_API, HOST_WEB_API);

export const SYSTEM_ID = INFO_SITE.system_id;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.app; // as '/dashboard/app'

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,

  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

// SETTINGS
// Please remove `localStorage` when you set settings.
// ----------------------------------------------------------------------

export const defaultSettings = {
  themeMode: 'dark',
  themeDirection: 'ltr',
  themeColorPresets: INFO_SITE.themeColorPresets,
  themeLayout: 'horizontal',
  themeStretch: false,
};
