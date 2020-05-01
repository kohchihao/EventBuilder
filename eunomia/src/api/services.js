import BaseAPI from "./base";

class ServicesAPI extends BaseAPI {

  retrieve(id) {
    return this.getClient().get(`${this.getUrl()}/${id}/`);
  }

  list() {
    return this.getClient().get(`${this.getUrl()}/`);
  }

  listWithCountryCode() {
    return this.getClient().get(`/${country_code}${this.getUrl()}/`);
  }

  listbyServiceTypeAndCountry(country_code, service_type_id) {
    return this.getClient().get(`/${country_code}/service_types/${service_type_id}/services/`);
  }

  getUrl() {
    return "/services";
  }
}

export default ServicesAPI;
