function getLocalState(state) {
  return state.navbar;
}

export function getRegisterDialog(state) {
  return getLocalState(state).registerDialogOpen;
}

export function getLoginDialog(state) {
  return getLocalState(state).loginDialogOpen;
}
