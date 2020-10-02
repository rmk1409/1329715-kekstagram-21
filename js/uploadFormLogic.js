'use strict';

const FILTER_PREFIX = `effects__preview--`;
const FILTER_NAMES = [`chrome`, `sepia`, `marvin`, `phobos`, `heat`];

const MAX_SCALE_VALUE = 100;
const MIN_SCALE_VALUE = 25;
const SCALE_GAP = 25;

const MAX_TAG_COUNT = 5;

const uploadForm = document.querySelector(`#upload-select-image`);
const uploadFileInput = uploadForm.querySelector(`#upload-file`);
const uploadCancel = uploadForm.querySelector(`#upload-cancel`);
const editForm = uploadForm.querySelector(`.img-upload__overlay`);

const scaleSmaller = uploadForm.querySelector(`.scale__control--smaller`);
const scaleBigger = uploadForm.querySelector(`.scale__control--bigger`);
const scaleValue = uploadForm.querySelector(`.scale__control--value`);
const imgPreview = uploadForm.querySelector(`.img-upload__preview img`);

const effectFieldset = uploadForm.querySelector(`.effects`);
const effectLevel = uploadForm.querySelector(`.img-upload__effect-level`);
const effectLevelPin = uploadForm.querySelector(`.effect-level__pin`);
const effectLevelValue = uploadForm.querySelector(`.effect-level__value`);
const effectLevelDepth = uploadForm.querySelector(`.effect-level__depth`);
const effectNoneFilterInput = uploadForm.querySelector(`#effect-none`);

const textHashtags = uploadForm.querySelector(`.text__hashtags`);
const comment = uploadForm.querySelector(`.text__description`);

const openEditForm = () => {
  document.body.classList.add(`modal-open`);
  editForm.classList.remove(`hidden`);

  effectLevel.style.display = `none`;
  effectNoneFilterInput.checked = true;
  imgPreview.className = ``;

  uploadFileInput.removeEventListener(`change`, onUploadFileInputChange);

  window.addEventListener(`keydown`, onWindowEscKeydown);
  uploadCancel.addEventListener(`click`, onUploadCancelClick);

  scaleSmaller.addEventListener(`click`, onScaleSmallerClick);
  scaleBigger.addEventListener(`click`, onScaleBiggerClick);
  effectFieldset.addEventListener(`change`, onEffectFieldsetChange);
  effectLevelPin.addEventListener(`mouseup`, onEffectLevelPinMouseUp);

  textHashtags.addEventListener(`input`, onTextHashtagsInput);
  uploadForm.addEventListener(`submit`, onUploadFormSubmit);
};

const closeEditForm = () => {
  document.body.classList.remove(`modal-open`);
  editForm.classList.add(`hidden`);

  uploadFileInput.value = ``;
  uploadFileInput.addEventListener(`change`, onUploadFileInputChange);

  window.removeEventListener(`keydown`, onWindowEscKeydown);
  uploadCancel.removeEventListener(`click`, onUploadCancelClick);

  scaleSmaller.removeEventListener(`click`, onScaleSmallerClick);
  scaleBigger.removeEventListener(`click`, onScaleBiggerClick);
  effectFieldset.removeEventListener(`change`, onEffectFieldsetChange);
  effectLevelPin.removeEventListener(`mouseup`, onEffectLevelPinMouseUp);

  textHashtags.removeEventListener(`input`, onTextHashtagsInput);
  uploadForm.removeEventListener(`submit`, onUploadFormSubmit);
};

const onUploadFileInputChange = () => {
  openEditForm();
};
uploadFileInput.addEventListener(`change`, onUploadFileInputChange);

const onWindowEscKeydown = (evt) => {
  if (evt.key === `Escape` && !(document.activeElement === textHashtags || document.activeElement === comment)) {
    evt.preventDefault();
    closeEditForm();
  }
};

const onUploadCancelClick = () => {
  closeEditForm();
};

const checkScales = (initialScale, currentScale) => {
  if (initialScale !== currentScale) {
    scaleValue.value = `${currentScale}%`;
    imgPreview.style.transform = `scale(${currentScale / 100})`;
  }
};

const onScaleSmallerClick = () => {
  const initialScale = parseInt(scaleValue.value, 10);
  let currentScale = initialScale - SCALE_GAP;
  currentScale = currentScale < MIN_SCALE_VALUE ? MIN_SCALE_VALUE : currentScale;
  checkScales(initialScale, currentScale);
};

const onScaleBiggerClick = () => {
  const initialScale = parseInt(scaleValue.value, 10);
  let currentScale = initialScale + SCALE_GAP;
  currentScale = currentScale > MAX_SCALE_VALUE ? MAX_SCALE_VALUE : currentScale;
  checkScales(initialScale, currentScale);
};

const onEffectFieldsetChange = (evt) => {
  imgPreview.className = ``;
  imgPreview.style.filter = ``;
  const selectedValue = evt.target.value;
  if (selectedValue !== `none`) {
    imgPreview.classList.add(`${FILTER_PREFIX}${selectedValue}`);
    effectLevel.style.display = `block`;
    effectLevelValue.value = `100`;
    effectLevelPin.style.left = `100%`;
    effectLevelDepth.style.width = `100%`;
  } else {
    effectLevel.style.display = `none`;
  }
};

const onEffectLevelPinMouseUp = () => {
  const currentLevelValue = effectLevelValue.value;
  const currentFilter = imgPreview.className.split(`\-\-`)[1];
  let appliedFilter = ``;
  switch (currentFilter) {
    case FILTER_NAMES[0]:
      appliedFilter = `grayscale(${currentLevelValue / 100})`;
      break;
    case FILTER_NAMES[1]:
      appliedFilter = `sepia(${currentLevelValue / 100})`;
      break;
    case FILTER_NAMES[2]:
      appliedFilter = `invert(${currentLevelValue}%)`;
      break;
    case FILTER_NAMES[3]:
      appliedFilter = `blur(${Math.round(currentLevelValue / 33)}px)`;
      break;
    case FILTER_NAMES[4]:
      appliedFilter = `brightness(${1 + Math.round(currentLevelValue / 50)})`;
      break;
  }
  imgPreview.style.filter = appliedFilter;
};

//
// HASH TAGS VALIDATION
//
const startWithHash = (hashes) => {
  return hashes.every((hash) => hash.startsWith(`#`));
};

const checkRegEx = (hashes) => {
  const regEx = RegExp(`^#(\\w){1,19}$`);
  return hashes.every((hash) => regEx.test(hash));
};

const checkDuplicatesAbsence = (hashes) => {
  return hashes.length === new Set(hashes.map((el) => el.toUpperCase())).size;
};

const checkTagMaxCount = (hashes) => {
  return hashes.length <= MAX_TAG_COUNT;
};

const checkAbsenceTags = (hashInputValue) => {
  return hashInputValue.length === 0;
};

const checkHashTags = () => {
  const hashInputValue = textHashtags.value.trim();
  const hashes = hashInputValue.split(` `).filter((el) => el.length > 0);

  return checkAbsenceTags(hashInputValue)
    || (startWithHash(hashes) && checkRegEx(hashes) && checkDuplicatesAbsence(hashes) && checkTagMaxCount(hashes));
};

const onTextHashtagsInput = () => {
  if (!checkHashTags()) {
    textHashtags.setCustomValidity(`Something wrong in tags!`);
  } else {
    textHashtags.setCustomValidity(``);
  }
};

const onUploadFormSubmit = (evt) => {
  if (!textHashtags.validity.valid) {
    evt.preventDefault();
  }
};
