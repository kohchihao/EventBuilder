export function calculatePrice(curatedAgreement, service, quantity) {
  if (!service) {
    return null;
  }

  if ((service.minQuantity && service.minQuantity > quantity) ||
    (service.maxQuantity && service.maxQuantity < quantity)) {
    return null;
  }

  if (curatedAgreement) {
    quantity = quantity - curatedAgreement.quantity;
  }

  let price = service.cost * quantity;
  price *= 1 + (service.markup / 100);
  price *= 1 + (service.tax / 100);

  return price;
}

export function isOrderIncludedInPackage(curatedAgreements, order) {
  return curatedAgreements.reduce((result, agreement) => {
    return result || (agreement.service.id === order.service.id && order.quantity <= agreement.quantity)
  }, false)
}

export function isOrderValid(order) {
  return order.quantity !== "" && order.quantity > 0 && order.price !== null && order.price !== undefined;
}

export function isOrdersValid(orders) {
  return orders.reduce((result, order) => {
    return result && isOrderValid(order);
  }, true);
}

export function isPositiveWholeNumber(number) {
  return number > 0 && (number % 1 === 0);
}
