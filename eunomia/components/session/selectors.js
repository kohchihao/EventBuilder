function getLocalState(state) {
  return state.session;
}

export function getCurrentUser(state) {
  return getLocalState(state).user;
}

export function getSessionData(state) {
  return getLocalState(state);
}

export function isLoggedIn(state) {
  return !!getCurrentUser(state);
}

export function isAuthenticating(state) {
  return getLocalState(state).isAuthenticating;
}
