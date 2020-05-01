import {isOrderIncludedInPackage, calculatePrice} from "./utils";

function getLocalState(state) {
  return state.build;
}

export function getCuratedEvent(state) {
  return getLocalState(state).curatedEvent;
}

export function getServiceTypes(state) {
  return getLocalState(state).serviceTypes;
}

export function getServices(state) {
  return getLocalState(state).services;
}

export function getService(state, serviceId) {
  return getLocalState(state).services[serviceId];
}

export function getOrderedServices(state) {
  return getLocalState(state).orders;
}

export function getOrder(state, serviceId) {
  return getOrderedServices(state)[serviceId];
}

export function isServiceSelected(state, serviceId) {
  const orders = getOrderedServices(state);
  return (serviceId in orders);
}

export function getQuantityOrdered(state, serviceId) {
  let order = getOrderedServices(state)[serviceId];
  if (order) {
    return order.quantity
  } else {
    return 0
  }
}

export function getUnitOfService(state, serviceId) {
  return getService(state, serviceId).unit;
}

// Get all the orders for a specified serviceType
export function getOrders(state, serviceTypeId) {
  const services = getServices(state);
  const allOrders = getOrderedServices(state);

  if (!services || !allOrders) {
    return [];
  }

  return Object.values(allOrders).filter((order) => {
    if (!services[order.service.id]) {
      return false;
    }
    return serviceTypeId === services[order.service.id].type.id;
  })
}

export function getIsServiceInPackage(state, serviceId) {
  return getCuratedEvent(state).curated_agreements.reduce((result, agreement) => {
    return result || (agreement.service.id === serviceId)
  }, false)
}

export function getTotalPrice(state) {
  const curatedEvent = getCuratedEvent(state);
  const curatedAgreements = curatedEvent.curated_agreements;
  const allOrders = Object.values(getOrderedServices(state));
  const services = getServices(state);

  if (!services) {
    return 0;
  }

  return curatedEvent.price + allOrders.reduce((result, order) => {
    if (isOrderIncludedInPackage(curatedAgreements, order)) {
      return result;
    } else {
      const agreement = curatedAgreements.find(a => a.service.id === order.service.id);
      return result + calculatePrice(agreement, services[order.service.id], order.quantity);
    }
  }, 0);
}

export function getNotes(state) {
  return getLocalState(state).notes;
}

export function getEventDate(state) {
  return getLocalState(state).eventDate;
}

export function getNumberAttendees(state) {
  return getLocalState(state).numberAttendees;
}

export function getDuration(state) {
  return getLocalState(state).duration;
}

export function getEvent(state) {
  return getLocalState(state).event;
}

export function hasBuiltEvent(state) {
  return !!getLocalState(state).event;
}

export function getExpandedServiceTypeId(state) {
  return getLocalState(state).expandedServiceTypeId;
}

export function getServiceTypeIdOfService(state, service) {
  return getServices(state)[service.id].type.id;
}

export function getEventParent(state) {
  const builtEvent = getEvent(state);
  return builtEvent ? builtEvent.parent : "genesis";
}

export function getEventTitle(state) {
  return getLocalState(state).eventTitle;
}

export function isEventEditable(state) {
  if (getEvent(state)) {
    return getEvent(state).status !== 'ACCEPTED' && getEvent(state).status !== 'QUOTED';
  } else {
    return true;
  }
}

export function getCuratedAgreement(state, serviceId) {
  const curatedEvent = getCuratedEvent(state);
  return curatedEvent.curated_agreements.find(a => a.service.id === serviceId);
}

export function getShowSummary(state) {
  return getLocalState(state).showSummary;
}

export function getBookOnSignIn(state) {
  return getLocalState(state).bookOnSignIn;
}

export function getIsServiceFocused(state, serviceId) {
  return getLocalState(state).focusedService === serviceId;
}
