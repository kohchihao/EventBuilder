import BaseAPI from "./base";

class EventAPI extends BaseAPI {
  retrieve(eventId) {
    return this.getClient().get(`${this.getUrl()}/${eventId}/`);
  }

  create(type, attendees, date, notes, services, curatedEventId, duration, name, parent) {
    return this.getClient().post(`${this.getUrl()}/`, {
      type: type,
      attendees: attendees,
      date: date,
      note: notes,
      services: services,
      curated_event: curatedEventId,
      duration: duration,
      parent: parent,
      name: name,
    });
  }

  update(type, attendees, date, notes, services, curatedEventId, duration, name, parent) {
    return this.getClient().post(`${this.getUrl()}/update/`, {
      type: type,
      attendees: attendees,
      date: date,
      note: notes,
      services: services,
      curated_event: curatedEventId,
      duration: duration,
      parent: parent,
      name: name,
    })
  }

  update_basic_info(id, name) {
    return this.getClient().post(`${this.getUrl()}/edit_basic_info/${id}/`, {
      name: name
    })
  }

  retrieveAll() {
    return this.getClient().get(`${this.getUrl()}/`);
  }

  download_quotation(id, isSigned) {
    return this.getClient().get(`${this.getUrl()}/${id}/download_quotation/?signed=${isSigned ? 1 : 0}`, {
      header: {
        'Accept': 'application/pdf'
      },
      responseType: 'blob',
      transformResponse: [function (data) {
        let blob = new window.Blob([data], { type: 'application/pdf' });
        return window.URL.createObjectURL(blob)
      }]
    })
  }

  upload_quotation(id, data) {
    return this.getClient().post(`${this.getUrl()}/${id}/upload_quotation/?signed=1`, data, {
      headers: {
        'content-type': 'multipart/form-data',
      }
    })
  }

  getUrl() {
    return "/events";
  }
}


export function b64toBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: "application/pdf" });
}

export default EventAPI;
