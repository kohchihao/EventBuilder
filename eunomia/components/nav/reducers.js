
const initialState = {
  registerDialogOpen: false,
  loginDialogOpen: false
};

const navbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'navbar/TOGGLE_REGISTER':
      return {
        ...state,
        registerDialogOpen: action.registerOpen
      };
    case 'navbar/TOGGLE_LOGIN':
      return {
        ...state,
        loginDialogOpen: action.loginOpen
      };

    default:
      return state;
  }
};

export default navbarReducer; 
