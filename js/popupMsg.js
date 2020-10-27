'use strict';

const errorLoadPopup = document.querySelector(`.error-popup`);
const errorLoadMsg = errorLoadPopup.querySelector(`.error-popup--msg`);
const errorLoadButton = errorLoadPopup.querySelector(`.error-popup--button`);

const main = document.querySelector(`main`);
const errorSendTemplate = document.querySelector(`#error`);
let errorSendPopup;
let errorSendButton;
const successSendTemplate = document.querySelector(`#success`);
let successSendPopup;
let successSendButton;

function onLoadErrorButtonClick() {
  errorLoadPopup.classList.add(`error-popup--hidden`);
  errorLoadButton.removeEventListener(`click`, onLoadErrorButtonClick);
}

function onLoadError(errorMessage) {
  errorLoadMsg.textContent = errorMessage;
  errorLoadPopup.classList.remove(`error-popup--hidden`);
  errorLoadButton.addEventListener(`click`, onLoadErrorButtonClick);
}

function closeErrorPopup() {
  main.removeChild(main.querySelector(`.error`));
  errorSendButton.removeEventListener(`click`, onSendErrorButtonClick);
  document.removeEventListener(`click`, onErrorWindowEscKeyDown);
  document.removeEventListener(`click`, onErrorDocumentClick);
}

function onSendErrorButtonClick() {
  closeErrorPopup();
}

function onErrorWindowEscKeyDown(evt) {
  evt.preventDefault();
  if (evt.key === `Escape`) {
    closeErrorPopup();
  }
}

function onErrorDocumentClick(evt) {
  if (evt.target.matches(`.error`)) {
    closeErrorPopup();
  }
}

function onSuccessWindowEscKeyDown(evt) {
  evt.preventDefault();
  if (evt.key === `Escape`) {
    closeSuccessPopup();
  }
}

function onSuccessDocumentClick(evt) {
  if (evt.target.matches(`.success`)) {
    closeSuccessPopup();
  }
}

function closeSuccessPopup() {
  main.removeChild(main.querySelector(`.success`));
  successSendButton.removeEventListener(`click`, onSendSuccessButtonClick);
  document.removeEventListener(`keydown`, onSuccessWindowEscKeyDown);
  document.removeEventListener(`click`, onSuccessDocumentClick);
}

function onSendSuccessButtonClick() {
  closeSuccessPopup();
}

function onSendError() {
  errorSendPopup = errorSendTemplate.content.cloneNode(true);
  errorSendButton = errorSendPopup.querySelector(`.error__button`);
  main.appendChild(errorSendPopup);
  errorSendButton.addEventListener(`click`, onSendErrorButtonClick);
  document.addEventListener(`keydown`, onErrorWindowEscKeyDown);
  document.addEventListener(`click`, onErrorDocumentClick);
}

function onSendSuccess() {
  successSendPopup = successSendTemplate.content.cloneNode(true);
  successSendButton = successSendPopup.querySelector(`.success__button`);
  main.appendChild(successSendPopup);
  successSendButton.addEventListener(`click`, onSendSuccessButtonClick);
  document.addEventListener(`keydown`, onSuccessWindowEscKeyDown);
  document.addEventListener(`click`, onSuccessDocumentClick);
}

window.popupMsg = {
  onLoadError,
  onSendError,
  onSendSuccess
};
