export function setEventType(eventType) {
    return {
      type: 'browse/SET_EVENT_TYPE',
      eventType
    }
  }
  
  export function setPax(pax) {
    return {
      type: 'browse/SET_PAX',
      pax
    }
  }
  
  export function setBudget(budget) {
    return {
      type: 'browse/SET_BUDGET',
      budget
    }
  }

  export function setDuration(duration) {
    return {
      type: 'browse/SET_DURATION',
      duration
    }
  }