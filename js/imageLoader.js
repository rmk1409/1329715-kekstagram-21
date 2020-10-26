'use strict';

const image = document.querySelector(`.img-upload__preview img`);
const file = document.querySelector(`#upload-file`);

const reader = new FileReader();

function onFileChange() {
  reader.readAsDataURL(file.files[0]);
}

function onReaderLoad() {
  image.src = reader.result;
}

function addListeners() {
  file.addEventListener(`change`, onFileChange);
  reader.addEventListener(`load`, onReaderLoad);
}

addListeners();
