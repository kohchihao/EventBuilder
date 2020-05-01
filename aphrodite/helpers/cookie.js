import cookie from 'js-cookie';

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 14,
    });
  }
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1
    });
  }
};

export const getCookie = (key, req) => {
  return getCookieFromBrowser(key);
};

const getCookieFromBrowser = key => {
  return cookie.get(key);
};
