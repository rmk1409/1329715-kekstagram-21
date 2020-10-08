'use strict';

(function () {
  const errorLoadPopup = document.querySelector(`.error-popup`);
  const errorLoadMsg = errorLoadPopup.querySelector(`.error-popup--msg`);
  const errorLoadButton = errorLoadPopup.querySelector(`.error-popup--button`);

  function onLoadErrorButtonClick() {
    errorLoadPopup.classList.add(`error-popup--hidden`);
    errorLoadButton.removeEventListener(`click`, onLoadErrorButtonClick);
  }

  function onLoadError(errorMessage) {
    errorLoadMsg.textContent = errorMessage;
    errorLoadPopup.classList.remove(`error-popup--hidden`);
    errorLoadButton.addEventListener(`click`, onLoadErrorButtonClick);
  }

  window.popupMsg = {
    onLoadError
  };
})();
