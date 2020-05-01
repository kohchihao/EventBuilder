function getLocalState(state) {
  return state.session;
}

export function getUserDetails(state) {
  return getLocalState(state).user;
}