const initialState = {
  eventType: 4,
  pax: 0,
  budget: 0,
  duration: 0
};

const browseReducer = (state = initialState, action) => {
  switch (action.type) {
    case "browse/SET_EVENT_TYPE":
      return {
        ...state,
        eventType: action.eventType
      };
    case "browse/SET_PAX":
      return {
        ...state,
        pax: action.pax
      };
    case "browse/SET_BUDGET":
      return {
        ...state,
        budget: action.budget
      };
    case "browse/SET_DURATION":
      return {
        ...state,
        duration: action.duration
      };

    default:
      return state;
  }
};

export default browseReducer;
