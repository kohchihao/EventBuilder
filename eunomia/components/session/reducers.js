import api from "../../src/api";

const initialState = {
  token: null,
  user: null,
  role: "",
  country: "",
  ip: "",
  need_info: false,
  isAuthenticating: true,
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      api.setAuthorizationHeader(action.authData.token);
      return {
        ...state,
        ...action.authData
      };
    case 'UPDATE_CURRENT_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.userData
        }
      };
    case 'SET_IS_AUTHENTICATING':
      return {
        ...state,
        isAuthenticating: action.isAuthenticating,
      };
    case 'LOGOUT':
      api.unsetAuthorizationHeader();
      return {
        ...initialState,
        isAuthenticating: false
      };
    default:
      return state;
  }
};

export default sessionReducer;
