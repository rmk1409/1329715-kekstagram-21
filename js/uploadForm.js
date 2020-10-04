'use strict';

const FILTER_PREFIX = `effects__preview--`;

const MAX_SCALE_VALUE = 100;
const MIN_SCALE_VALUE = 25;
const SCALE_GAP = 25;

const MAX_TAG_COUNT = 5;

const SCALE_DEFAULT_VALUE = 100;
const DEFAULT_LEVEL_VALUE = `100`;

const ESCAPE_KEY = `Escape`;

const HASHTAG_MAX_LENGTH = `19`;
const DEFAULT_HASHTAG_ERROR_MSG = `Something wrong in tags!`;

const uploadForm = document.querySelector(`#upload-select-image`);
const uploadFileInput = uploadForm.querySelector(`#upload-file`);
const uploadCancel = uploadForm.querySelector(`#upload-cancel`);
const editOverlay = uploadForm.querySelector(`.img-upload__overlay`);

const imgScaleFieldset = uploadForm.querySelector(`.img-upload__scale`);
const scaleValue = imgScaleFieldset.querySelector(`.scale__control--value`);
const imgPreview = uploadForm.querySelector(`.img-upload__preview img`);

const effectFieldset = uploadForm.querySelector(`.effects`);
const effectLevel = uploadForm.querySelector(`.img-upload__effect-level`);
const effectLevelPin = uploadForm.querySelector(`.effect-level__pin`);
const effectLevelValue = uploadForm.querySelector(`.effect-level__value`);
const effectLevelDepth = uploadForm.querySelector(`.effect-level__depth`);
const effectNoneFilterInput = uploadForm.querySelector(`#effect-none`);

const textHashtags = uploadForm.querySelector(`.text__hashtags`);
const comment = uploadForm.querySelector(`.text__description`);

function openEditForm() {
  document.body.classList.add(`modal-open`);
  editOverlay.classList.remove(`hidden`);

  resetImageFilter();
  setScales();

  window.addEventListener(`keydown`, onWindowEscKeydown);
  uploadCancel.addEventListener(`click`, onUploadCancelClick);

  imgScaleFieldset.addEventListener(`click`, onScaleFieldsetClick);

  effectFieldset.addEventListener(`change`, onEffectFieldsetChange);
  effectLevelPin.addEventListener(`mouseup`, onEffectLevelPinMouseUp);

  textHashtags.addEventListener(`input`, onTextHashtagsInput);
  uploadForm.addEventListener(`submit`, onUploadFormSubmit);
}

function closeEditForm() {
  document.body.classList.remove(`modal-open`);
  editOverlay.classList.add(`hidden`);

  uploadForm.reset();

  window.removeEventListener(`keydown`, onWindowEscKeydown);
  uploadCancel.removeEventListener(`click`, onUploadCancelClick);

  imgScaleFieldset.removeEventListener(`click`, onScaleFieldsetClick);

  effectFieldset.removeEventListener(`change`, onEffectFieldsetChange);
  effectLevelPin.removeEventListener(`mouseup`, onEffectLevelPinMouseUp);

  textHashtags.setCustomValidity(``);
  textHashtags.removeEventListener(`input`, onTextHashtagsInput);
  uploadForm.removeEventListener(`submit`, onUploadFormSubmit);
}

uploadFileInput.addEventListener(`change`, onUploadFileInputChange);

function resetImageFilter() {
  imgPreview.className = ``;
  imgPreview.style.filter = ``;
  effectNoneFilterInput.checked = true;
  effectLevel.style.display = `none`;
}

function onUploadFileInputChange() {
  openEditForm();
}

uploadFileInput.addEventListener(`change`, onUploadFileInputChange);

function onWindowEscKeydown(evt) {
  const activeElement = document.activeElement;
  if (evt.key === ESCAPE_KEY && !(activeElement === textHashtags || activeElement === comment)) {
    evt.preventDefault();
    closeEditForm();
  }
}

function onUploadCancelClick() {
  closeEditForm();
}

function setScales(initialScale, newScale = SCALE_DEFAULT_VALUE) {
  if (initialScale !== newScale) {
    scaleValue.value = `${newScale}%`;
    imgPreview.style.transform = `scale(${newScale / 100})`;
  }
}

function onScaleFieldsetClick(evt) {
  const target = evt.target;
  if (target.tagName === `BUTTON`) {
    const initialScale = parseInt(scaleValue.value, 10);
    let newScale;
    if (target.matches(`.scale__control--smaller`)) {
      newScale = initialScale - SCALE_GAP;
      newScale = newScale < MIN_SCALE_VALUE ? MIN_SCALE_VALUE : newScale;
    } else if (target.matches(`.scale__control--bigger`)) {
      newScale = initialScale + SCALE_GAP;
      newScale = newScale > MAX_SCALE_VALUE ? MAX_SCALE_VALUE : newScale;
    }
    setScales(initialScale, newScale);
  }
}

function setPin(value = DEFAULT_LEVEL_VALUE) {
  effectLevelValue.value = `${value}`;
  effectLevelPin.style.left = `${value}%`;
  effectLevelDepth.style.width = `${value}%`;
}

function onEffectFieldsetChange(evt) {
  const effectRadio = evt.target;
  const selectedValue = effectRadio.value;
  resetImageFilter();
  if (selectedValue !== `none`) {
    effectRadio.checked = true;
    imgPreview.classList.add(`${FILTER_PREFIX}${selectedValue}`);
    effectLevel.style.display = `block`;
    setPin();
  }
}

const filter = {
  chrome(level) {
    return `grayscale(${level / 100})`;
  },
  sepia(level) {
    return `sepia(${level / 100})`;
  },
  marvin(level) {
    return `invert(${level}%)`;
  },
  phobos(level) {
    return `blur(${Math.round(level / 33)}px)`;
  },
  heat(level) {
    return `brightness(${1 + Math.round(level / 50)})`;
  }
};

function onEffectLevelPinMouseUp() {
  const levelValue = effectLevelValue.value;
  const currentFilter = imgPreview.className.split(`\-\-`)[1];

  setPin(levelValue);
  imgPreview.style.filter = filter[currentFilter](levelValue);
}

//
// HASH TAGS VALIDATION
//
function startWithHash(hashes) {
  return hashes.every((hash) => hash.startsWith(`#`));
}

function checkRegEx(hashes) {
  const regEx = RegExp(`^#(\\w){1,${HASHTAG_MAX_LENGTH}}$`);
  return hashes.every((hash) => regEx.test(hash));
}

function checkDuplicatesAbsence(hashes) {
  return hashes.length === new Set(hashes.map((el) => el.toUpperCase())).size;
}

function checkTagMaxCount(hashes) {
  return hashes.length <= MAX_TAG_COUNT;
}

function checkAbsenceTags(hashInputValue) {
  return hashInputValue === ``;
}

function checkHashTags() {
  const hashInputValue = textHashtags.value.trim();
  const hashes = hashInputValue.split(` `).filter((el) => el.length > 0);

  return checkAbsenceTags(hashInputValue)
    || (startWithHash(hashes) && checkRegEx(hashes) && checkDuplicatesAbsence(hashes) && checkTagMaxCount(hashes));
}

function onTextHashtagsInput() {
  if (!checkHashTags()) {
    textHashtags.setCustomValidity(DEFAULT_HASHTAG_ERROR_MSG);
  } else {
    textHashtags.setCustomValidity(``);
  }
}

function onUploadFormSubmit(evt) {
  if (!textHashtags.validity.valid) {
    evt.preventDefault();
  }
}
