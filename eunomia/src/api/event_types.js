import BaseAPI from "./base";

class EventTypesAPI extends BaseAPI {

  retrieve(id) {
    return this.getClient().get(`${this.getUrl()}/${id}/`);
  }

  list() {
    return this.getClient().get(`${this.getUrl()}/`);
  }

  listWithCountryCode() {
    return this.getClient().get(`/${country_code}${this.getUrl()}/`);
  }

  listServiceTypes(id) {
    return this.getClient().get(`${this.getUrl()}/${id}/service_types/`)
  }

  getUrl() {
    return "/event_types";
  }
}

export default EventTypesAPI;
