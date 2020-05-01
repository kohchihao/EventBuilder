import CuratedEventAPI from "./curated_event";
import AuthAPI from "./auth";
import EventTypesAPI from "./event_types";
import ServicesAPI from "./services";
import EventAPI from "./event";
import UserAPI from "./user";

class API {
  curated_event = new CuratedEventAPI();
  auth = new AuthAPI();
  event_types = new EventTypesAPI();
  services = new ServicesAPI();
  event = new EventAPI();
  user = new UserAPI();

  setAuthorizationHeader(token) {
    this.curated_event.setAuthorizationToken(token);
    this.auth.setAuthorizationToken(token);
    this.event_types.setAuthorizationToken(token);
    this.services.setAuthorizationToken(token);
    this.event.setAuthorizationToken(token);
    this.user.setAuthorizationToken(token);
  }

  unsetAuthorizationHeader() {
    this.curated_event.unsetAuthorizationToken();
    this.auth.unsetAuthorizationToken();
    this.event_types.unsetAuthorizationToken();
    this.services.unsetAuthorizationToken();
    this.event.unsetAuthorizationToken();
    this.user.unsetAuthorizationToken();
  }
}

const api = new API();

export default api;
