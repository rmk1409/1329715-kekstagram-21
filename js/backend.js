'use strict';

(function () {
  const GET_DATA_URL = `https://21.javascript.pages.academy/kekstagram/data`;
  const SUCCESS_STATUS_CODE = 200;
  const TIMEOUT = 10000;

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
        onError(`There is an error, status code is - ${currentStatusCode}.`);
    }
  }

  function load(onLoad, onError) {
    const request = new XMLHttpRequest();
    request.responseType = `json`;
    request.timeout = TIMEOUT;

    request.addEventListener(`load`, () => onRequestLoad(request, onLoad, onError));
    request.addEventListener(`error`, () => onError(`There is connection error`));
    request.addEventListener(`timeout`, () => onError(`There is timeout error, passed more than ${TIMEOUT / 1000} sec.`));

    request.open(`GET`, GET_DATA_URL);
    request.send();
  }

  window.backend = {
    load
  };
})();
