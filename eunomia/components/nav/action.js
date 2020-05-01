export function setRegisterDialog(registerOpen) {
  return {
    type: 'navbar/TOGGLE_REGISTER',
    registerOpen: registerOpen
  }
}

export function setLoginDialog(loginOpen) {
  return {
    type: 'navbar/TOGGLE_LOGIN',
    loginOpen: loginOpen
  }
}
