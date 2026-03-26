const tokenKey = 'storepilot_token';
const userKey = 'storepilot_user';

export const getStoredToken = () => window.sessionStorage.getItem(tokenKey);
export const getStoredUser = () => {
  const rawValue = window.sessionStorage.getItem(userKey);
  return rawValue ? JSON.parse(rawValue) : null;
};

export const saveSession = ({ token, user }) => {
  window.sessionStorage.setItem(tokenKey, token);
  window.sessionStorage.setItem(userKey, JSON.stringify(user));
};

export const clearSession = () => {
  window.sessionStorage.removeItem(tokenKey);
  window.sessionStorage.removeItem(userKey);
};
