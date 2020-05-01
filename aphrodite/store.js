import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {
  token: null,
  user: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_TOKEN':
      return {
        ...state,
        token: action.token
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.user
      };

    case 'LOGOUT':
      return {
        ...state,
        token: null
      };
    default:
      return state;
  }
};

export const initializeStore = (preloadedState = initialState) => {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  );
};
