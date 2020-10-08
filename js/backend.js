'use strict';

(function () {
  const URL = `https://21.javascript.pages.academy/kekstagram/data`;
  const TIMEOUT = 10000;
  const SUCCESS_STATUS_CODE = 200;

  const errorPopup = document.querySelector(`.error-popup`);
  const errorMsg = errorPopup.querySelector(`.error-popup--msg`);
  const errorButton = errorPopup.querySelector(`.error-popup--button`);

  function requestLoadCB(request, onLoad, onError) {
    const currentStatusCode = request.status;

    switch (currentStatusCode) {
      case SUCCESS_STATUS_CODE:
        onLoad(request.response);
        break;
      default:
        onError(`There is an error, status code is - ${currentStatusCode}.`);
    }
  }

  function requestErrorCB(onError = onLoadError) {
    onError(`There is connection error`);
  }

  function requestTimeoutCB(onError = onLoadError) {
    onError(`There is timeout error, passed more than ${TIMEOUT / 1000} sec.`);
  }

  function onErrorButtonClick() {
    errorPopup.classList.add(`error-popup--hidden`);

    errorButton.removeEventListener(`click`, onErrorButtonClick);
  }

  function onLoadError(errorMessage) {
    errorMsg.textContent = errorMessage;
    errorPopup.classList.remove(`error-popup--hidden`);

    errorButton.addEventListener(`click`, onErrorButtonClick);
  }

  function load(onLoad, onError = onLoadError) {
    const request = new XMLHttpRequest();

    request.addEventListener(`load`, requestLoadCB.bind(null, request, onLoad, onError));
    request.addEventListener(`error`, requestErrorCB.bind(null, onError));
    request.addEventListener(`timeout`, requestTimeoutCB.bind(null, onError));

    request.responseType = `json`;
    request.timeout = TIMEOUT;
    request.open(`GET`, URL);
    request.send();
  }

  window.backend = {
    load
  };
})();
