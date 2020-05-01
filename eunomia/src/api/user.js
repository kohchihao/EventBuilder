import BaseAPI from "./base";

class UserAPI extends BaseAPI {

  update_profile(id, name, email, phone_number) {
    let body = {};
    if (name) {
      body['name'] = name;
    }
    if (email) {
      body['email'] = email;
    }
    if (phone_number) {
      body['phone_number'] = phone_number;
    }
    return this.getClient().patch(`${this.getUrl()}/${id}/`, body);
  }

  getUrl() {
    return "/users";
  }
}

export default UserAPI;
