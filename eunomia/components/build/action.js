export function setInitialState() {
  return {
    type: 'build/SET_INITIAL_STATE'
  }
}

export function setCuratedEvent(curatedEvent) {
  return {
    type: 'build/SET_CURATED_EVENT',
    curatedEvent
  }
}

export function setServiceTypes(serviceTypes) {
  return {
    type: 'build/SET_SERVICE_TYPES',
    serviceTypes,
  }
}

export function setServices(serviceTypeId, services) {
  return {
    type: 'build/SET_SERVICES',
    serviceTypeId,
    services,
  }
}

export function addService(serviceId) {
  return {
    type: 'build/ADD_SERVICE',
    serviceId
  }
}

export function removeService(serviceId) {
  return {
    type: 'build/REMOVE_SERVICE',
    serviceId,
  }
}

export function changeServiceQuantity(serviceId, quantity) {
  return {
    type: 'build/CHANGE_SERVICE_QUANTITY',
    quantity: +quantity,
    serviceId,
  }
}

export function changeNotes(notes) {
  return {
    type: 'build/CHANGE_NOTES',
    notes,
  }
}

export function changeEventDate(date) {
  return {
    type: 'build/CHANGE_EVENT_DATE',
    date,
  }
}

export function changeNumberOfAttendees(numberAttendees) {
  return {
    type: 'build/CHANGE_NUMBER_ATTENDEES',
    numberAttendees,
  }
}

export function changeDuration(duration) {
  return {
    type: 'build/CHANGE_DURATION',
    duration,
  }
}

export function setEvent(event) {
  return {
    type: 'build/SET_EVENT',
    event
  }
}

export function changeEventTitle(eventTitle) {
  return {
    type: 'build/CHANGE_EVENT_TITLE',
    eventTitle,
  }
}

export function setExpandedServiceTypeId(serviceTypeId) {
  return {
    type: 'build/SET_EXPANDED_SERVICE_TYPE',
    serviceTypeId
  }
}

export function sortServices(serviceTypeId) {
  return {
    type: 'build/SORT_SERVICES',
    serviceTypeId,
  }
}

export function setShowSummary(showSummary) {
  return {
    type: 'build/SET_SHOW_SUMMARY',
    showSummary
  }
}

export function setBookOnSignIn(bookOnSignIn) {
  return {
    type: 'build/SET_BOOK_ON_SIGN_IN',
    bookOnSignIn: bookOnSignIn
  }
}

export function setFocusedService(serviceId) {
  return {
    type: 'build/SET_FOCUSED_SERVICE',
    serviceId
  }
}
