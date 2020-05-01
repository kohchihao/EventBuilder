import axios from "axios";
import { baseUrl } from '../helpers/constants';

class BaseAPI {
  constructor() {
    const headers = { Accept: "application/json" };
    const params = { format: "json" };

    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 20000,
      withCredentials: true,
      headers,
      params
    });
  }

  setAuthorizationToken(token) {
    this.getClient().defaults.headers.common[
      "Authorization"
    ] = `Token ${token}`;
  }

  unsetAuthorizationToken() {
    delete this.getClient().defaults.headers.common["Authorization"];
  }

  getClient() {
    return this.client;
  }
}

export default BaseAPI;
