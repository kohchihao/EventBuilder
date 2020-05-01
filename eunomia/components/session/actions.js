export function setCurrentUser(authData) {
  return {
    type: 'SET_CURRENT_USER',
    authData
  };
}

export function updateCurrentUser(userData) {
  return {
    type: 'UPDATE_CURRENT_USER',
    userData
  }
}

export function logout() {
  return {
    type: 'LOGOUT'
  }
}

export function setIsAuthenticating(isAuthenticating) {
  return {
    type: 'SET_IS_AUTHENTICATING',
    isAuthenticating
  }
}
