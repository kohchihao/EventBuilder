let baseUrl = "";
let firebaseEmailActionSetting = "";

if (process.env.NODE_ENV === "development") {
  baseUrl = "https://event-tomato.appspot.com/api/v1";
  // baseUrl = "http://127.0.0.1:8000/api/v1";
  firebaseEmailActionSetting = "http://localhost:3000/";
} else {
  baseUrl = "https://event-tomato.appspot.com/api/v1";
  firebaseEmailActionSetting = "http://eventbuilder-customer.herokuapp.com";
}

export { baseUrl, firebaseEmailActionSetting }
