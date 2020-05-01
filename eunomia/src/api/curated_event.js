import BaseAPI from "./base";

class CuratedEventAPI extends BaseAPI {
  retrieve(id) {
    return this.getClient().get(`${this.getUrl()}/${id}/`);
  }

  list() {
    return this.getClient().get(`${this.getUrl()}/`);
  }

  search(countryCode, eventType, eventPax, eventBudget, eventDuration) {
    return this.getClient().get(
      `${this.getUrl()}/?country_code=${countryCode}&pax=${eventPax}&event_type=${eventType}&duration=${eventDuration}&budget=${eventBudget}&is_past_event=0`
    );
  }

  listPastEvents() {
    return this.getClient().get(
      `${this.getUrl()}/?country_code=sg&pax=*&event_type=*&duration=*&budget=*&is_past_event=1`
    );
  }

  getUrl() {
    return "/curated_events";
  }
}

export default CuratedEventAPI;
