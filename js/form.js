'use strict';

(function () {
  const FILTER_PREFIX = `effects__preview--`;

  const SCALE_DEFAULT_VALUE = 100;
  const MIN_SCALE_VALUE = 25;
  const MAX_SCALE_VALUE = 100;
  const SCALE_GAP = 25;

  const ESCAPE_KEY = `Escape`;

  const DEFAULT_HASHTAG_ERROR_MSG = `Something wrong in tags!`;

  const DEFAULT_LEVEL_VALUE = 100;
  const MIN_PIN_VALUE = 0;
  const MAX_PIN_VALUE = 100;

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
  const effectLevelLine = uploadForm.querySelector(`.effect-level__line`);
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

    effectLevelPin.addEventListener(`mousedown`, onEffectLevelPinMouseDown);

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

    effectLevelPin.removeEventListener(`mousedown`, onEffectLevelPinMouseDown);

    textHashtags.setCustomValidity(``);
    textHashtags.removeEventListener(`input`, onTextHashtagsInput);
    uploadForm.removeEventListener(`submit`, onUploadFormSubmit);
  }

  function resetImageFilter() {
    imgPreview.className = ``;
    imgPreview.style.filter = ``;
    effectNoneFilterInput.checked = true;
    effectLevel.style.display = `none`;
  }

  function onUploadFileInputChange() {
    openEditForm();
  }

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

  function setFilter() {
    const levelValue = effectLevelValue.value;
    const currentFilter = imgPreview.className.split(`\-\-`)[1];
    imgPreview.style.filter = filter[currentFilter](levelValue);
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
      return `blur(${level / 33}px)`;
    },
    heat(level) {
      return `brightness(${1 + level / 50})`;
    }
  };

  function onEffectLevelPinMouseDown(evt) {
    evt.preventDefault();

    document.addEventListener(`mousemove`, onDocumentMove);
    document.addEventListener(`mouseup`, onDocumentMouseUp);

    function onDocumentMove(moveEvt) {
      moveEvt.preventDefault();

      const shiftInPx = moveEvt.movementX;
      const shiftInRelativeNumber = shiftInPx / effectLevelLine.offsetWidth * 100;
      const oldValue = effectLevelValue.value;
      let newValue = parseFloat(oldValue) + shiftInRelativeNumber;

      let isViolationBorder = false;
      if (newValue > MAX_PIN_VALUE || newValue < MIN_PIN_VALUE) {
        isViolationBorder = true;
        newValue = newValue > MAX_PIN_VALUE ? MAX_PIN_VALUE : MIN_PIN_VALUE;
      }

      setPin(newValue);
      setFilter();

      if (isViolationBorder) {
        document.dispatchEvent(new CustomEvent(`mouseup`));
      }
    }

    function onDocumentMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener(`mousemove`, onDocumentMove);
      document.removeEventListener(`mouseup`, onDocumentMouseUp);
    }
  }

  function onTextHashtagsInput() {
    const hashInputValue = textHashtags.value.trim();
    const isHashTagCorrect = !window.hashTagChecker.checkHashTags(hashInputValue);

    if (isHashTagCorrect) {
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

  function run() {
    uploadFileInput.addEventListener(`change`, onUploadFileInputChange);
  }

  window.form = {
    run
  };
})();
