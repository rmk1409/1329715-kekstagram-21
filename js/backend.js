'use strict';

(function () {
  const GET_DATA_URL = `https://21.javascript.pages.academy/kekstagram/data`;
  const POST_DATA_URL = `https://javascript.pages.academy/kekstagram`;
  const SUCCESS_STATUS_CODE = 200;
  const TIMEOUT = 5000;

  function onRequestLoad(request, onLoad, onError) {
    const currentStatusCode = request.status;
    switch (currentStatusCode) {
      case SUCCESS_STATUS_CODE:
        if (request.responseURL === GET_DATA_URL) {
          onLoad(request.response);
        } else {
          onLoad();
        }
        break;
      default:
        if (request.responseURL === GET_DATA_URL) {
          onError(`There is an error, status code is - ${currentStatusCode}.`);
        } else {
          onError();
        }
    }
  }

  function sendRequest(methodType, onLoad, onError, url, data) {
    const request = new XMLHttpRequest();
    if (methodType === `GET`) {
      request.responseType = `json`;
      request.addEventListener(`error`, () => onError(`There is connection error`));
      request.addEventListener(`timeout`, () => onError(`There is timeout error, passed more than ${TIMEOUT / 1000} sec.`));
    } else if (methodType === `POST`) {
      request.addEventListener(`error`, onError);
      request.addEventListener(`timeout`, onError);
    }
    request.timeout = TIMEOUT;
    request.addEventListener(`load`, () => onRequestLoad(request, onLoad, onError));

    request.open(methodType, url);
    if (data) {
      request.send(data);
    } else {
      request.send();
    }
  }

  function load(onLoad, onError) {
    sendRequest(`GET`, onLoad, onError, GET_DATA_URL);
  }

  function send(onLoad, onError, data) {
    sendRequest(`POST`, onLoad, onError, POST_DATA_URL, data);
  }

  window.backend = {
    load,
    send
  };
})();
