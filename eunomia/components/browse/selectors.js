function getLocalState(state) {
  return state.browse;
}

export function getEventType(state) {
  return getLocalState(state).eventType;
}

export function getPax(state) {
  return getLocalState(state).pax;
}

export function getBudget(state) {
  return getLocalState(state).budget;
}

export function getDuration(state) {
  return getLocalState(state).duration;
}
