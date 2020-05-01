import {calculatePrice, isOrderIncludedInPackage} from "./utils";
import moment from "moment";

function isServiceSelected(state, serviceId) {
  const orders = state.orders;
  if (orders) {
    return (serviceId in orders);
  } else {
    return false;
  }
}

function isServiceInPackage(state, serviceId) {
  return state.curatedEvent.curated_agreements.reduce((result, agreement) => {
    return result || (agreement.service.id === serviceId)
  }, false)
}

const initialState = {
  curatedEvent: null,
  orders: null, // whatever additional orders that are added onto what is defined in CuratedEvent.
  serviceTypes: null,
  services: null,
  notes: "",
  eventDate: moment().startOf('hour').add(7, 'd'),
  numberAttendees: 0,
  duration: 0,
  event: null,
  eventTitle: null,
  expandedServiceTypeId: null,
  showSummary: false, // whether to show quotation or summary.
  bookOnSignIn: false,
  focusedService: null,
};


const buildReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'build/SET_CURATED_EVENT':
      let orders;
      if (state.event) {
        orders = Object.values(state.orders).reduce((obj, order) => {
          return {
            ...obj,
            [order.service.id]: {
              ...order,
              isInPackage: isOrderIncludedInPackage(action.curatedEvent.curated_agreements, order),
            }
          }
        }, {})
      } else {
        orders = action.curatedEvent.curated_agreements.reduce((obj, order) => {
          return {
            ...obj,
            [order.service.id]: {
              ...order,
              isInPackage: true,
            },
          }
        }, {});
      }
      return {
        ...state,
        curatedEvent: {
          ...action.curatedEvent,
          price: +action.curatedEvent.price
        },
        orders: orders,
        numberAttendees: state.event ? state.numberAttendees : action.curatedEvent.pax,
        duration: state.event ? state.duration : +action.curatedEvent.duration.substr(0, 2)
      };
    case 'build/SET_SERVICE_TYPES':
      const serviceTypes = action.serviceTypes.reduce((obj, serviceType) => {
        if (serviceType.services.length === 0) {
          return obj;
        }
        // Filter out service types that are being used in this event
        if (state.event && (state.event.status === 'ACCEPTED' || state.event.status === 'QUOTED')) {
          if (Object.values(state.orders).filter(order => serviceType.services.includes(order.service.id)).length === 0) {
            return obj;
          }
        }
        return {
          ...obj,
          [serviceType.id]: serviceType
        }
      }, {});
      return {
        ...state,
        serviceTypes: serviceTypes,
      };
    case 'build/SET_SERVICES':
      const services = action.services.reduce((obj, service) => {
        // filter out services that are not being used.
        if (state.event && (state.event.status === 'ACCEPTED' || state.event.status === 'QUOTED')) {
          if (!(service.id in state.orders)) {
            return obj;
          }
        }

        return {
          ...obj,
          [service.id]: {
            ...service,
            isSelected: isServiceSelected(state, service.id),
            minQuantity: service.min_quantity,
            maxQuantity: service.max_quantity,
            cost: +service.cost
          }
        }
      }, {});
      return {
        ...state,
        services: {
          ...state.services,
          ...services
        }
      };
    case 'build/SET_EVENT':
      let eventOrders = action.event.agreements.reduce((obj, order) => {
        return {
          ...obj,
          [order.service.id]: {
            id: order.id,
            quantity: order.amount,
            price: order.price,
            service: order.service,
          }
        }
      }, {});
      return {
        ...state,
        eventTitle: action.event.name,
        event: action.event,
        orders: eventOrders,
        numberAttendees: action.event.attendees,
        eventDate: moment(action.event.date),
        duration: +action.event.duration.substr(0, 2),
        notes: action.event.note
      };
    case 'build/ADD_SERVICE':
      let service = state.services[action.serviceId];
      let serviceType = state.serviceTypes[service.type.id];
      let newQuantity = service.minQuantity;

      if (state.numberAttendees && service.unit === 'pax') {
        newQuantity = state.numberAttendees;
      }
      if (state.duration && service.unit === 'hour') {
        newQuantity = state.duration;
      }
      if (service.maxQuantity && newQuantity > service.maxQuantity) {
        newQuantity = service.maxQuantity;
      }

      if (!serviceType.allow_multiple_selection) {
        let ordersToFilterOut = Object.values(state.orders).filter((order => {
          let orderServiceType = state.serviceTypes[state.services[order.service.id].type.id];
          if (orderServiceType.id === serviceType.id) {
            delete state.orders[order.service.id];
          }
          return orderServiceType.id === serviceType.id;
        }));
        if (ordersToFilterOut.length === 1) {
          newQuantity = ordersToFilterOut[0].quantity;
        }
      }

      let newOrder = {
        quantity: newQuantity,
        price: calculatePrice(state.curatedEvent.curated_agreements.find(a => a.service.id === action.serviceId),
          service, newQuantity),
        service: {id: action.serviceId, name: service.name}
      };
      return {
        ...state,
        orders: {
          ...state.orders,
          [action.serviceId]: {
            ...newOrder,
            isInPackage: isOrderIncludedInPackage(state.curatedEvent.curated_agreements, newOrder),
          }
        },
        services: {
          ...state.services,
          [action.serviceId]: {
            ...state.services[action.serviceId],
            isSelected: true,
          }
        }
      };
    case 'build/CHANGE_SERVICE_QUANTITY':
      newOrder = {
        ...state.orders[action.serviceId],
        price: calculatePrice(state.curatedEvent.curated_agreements.find(a => a.service.id === action.serviceId),
          state.services[action.serviceId], action.quantity),
        quantity: action.quantity,
      };
      return {
        ...state,
        orders: {
          ...state.orders,
          [action.serviceId]: {
            ...newOrder,
            isInPackage: isOrderIncludedInPackage(state.curatedEvent.curated_agreements, newOrder),
          }
        }
      };
    case 'build/REMOVE_SERVICE':
      let { [action.serviceId]: toRemove, ...remaining} = state.orders;
      return {
        ...state,
        orders: remaining,
        services: {
          ...state.services,
          [action.serviceId]: {
            ...state.services[action.serviceId],
            isSelected: false,
          }
        }
      };
    case 'build/CHANGE_NOTES':
      return {
        ...state,
        notes: action.notes,
      };
    case 'build/CHANGE_EVENT_DATE':
      return {
        ...state,
        eventDate: action.date
      };
    case 'build/CHANGE_EVENT_TITLE':
      return {
        ...state,
        eventTitle: action.eventTitle
      };
    case 'build/CHANGE_NUMBER_ATTENDEES':
      return {
        ...state,
        numberAttendees: action.numberAttendees,
      };
    case 'build/CHANGE_DURATION':
      return {
        ...state,
        duration: action.duration
      };
    case 'build/SET_EXPANDED_SERVICE_TYPE':
      return {
        ...state,
        expandedServiceTypeId: action.serviceTypeId
      };
    case 'build/SORT_SERVICES':
      let sortedServices = state.serviceTypes[action.serviceTypeId].services.sort((x, y) => {
        if ((isServiceInPackage(state, x) && isServiceSelected(state, x)) && !(isServiceInPackage(state, y) && isServiceSelected(state, y))) {
          return -1;
        }
        if (!(isServiceInPackage(state, x) && isServiceSelected(state, x)) && (isServiceInPackage(state, y) && isServiceSelected(state, y))) {
          return 1;
        }


        if ((isServiceSelected(state, x) && !isServiceInPackage(state, x)) && !(isServiceSelected(state, y) && !isServiceInPackage(state, y))) {
          return -1;
        }
        if (!(isServiceSelected(state, x) && !isServiceInPackage(state, x)) && (isServiceSelected(state, y) && !isServiceInPackage(state, y))) {
          return 1;
        }

        if ((isServiceInPackage(state, x) && !isServiceSelected(state, x)) && !(isServiceInPackage(state, y) && !isServiceSelected(state, y))) {
          return -1;
        }
        if (!(isServiceInPackage(state, x) && !isServiceSelected(state, x)) && (isServiceInPackage(state, y) && !isServiceSelected(state, y))) {
          return 1;
        }
        return 0;
      });
      return {
        ...state,
        serviceTypes: {
          ...state.serviceTypes,
          [action.serviceTypeId]: {
            ...state.serviceTypes[action.serviceTypeId],
            services: sortedServices
          }
        }
      };
    case 'build/SET_SHOW_SUMMARY':
      return {
        ...state,
        showSummary: action.showSummary,
      };
    case 'build/SET_BOOK_ON_SIGN_IN':
      return {
        ...state,
        bookOnSignIn: action.bookOnSignIn,
      };
    case 'build/SET_INITIAL_STATE':
      return initialState;
    case 'navbar/TOGGLE_REGISTER':
      if (!action.registerOpen) {
        return {
          ...state,
          bookOnSignIn: false,
        }
      }
      return state;
    case 'navbar/TOGGLE_LOGIN':
      if (!action.loginOpen) {
        return {
          ...state,
          bookOnSignIn: false,
        }
      }
      return state;
    case 'build/SET_FOCUSED_SERVICE':
      return {
        ...state,
        focusedService: action.serviceId
      };
    default:
      return state;
  }
};

export default buildReducer;
