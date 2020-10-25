'use strict';

const ACTIVE_BUTTON_CLASS = `img-filters__button--active`;
const MAX_RANDOM_PHOTO = 10;
const DEBOUNCE_INTERVAL = 500;

const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`a.picture`);
const pictureSection = document.querySelector(`.pictures`);

const imgFilter = document.querySelector(`.img-filters`);

const filter = {
  [`filter-default`](left, right) {
    return left.id - right.id;
  },
  [`filter-random`]() {
    return Math.random() - 0.5;
  },
  [`filter-discussed`](left, right) {
    return right.comments.length - left.comments.length;
  },
};

let pictures = [];

let timeout;

function onImageFilterClick(evt) {
  if (timeout) {
    window.clearTimeout(timeout);
  }
  let target = evt.target;
  if (!target.matches(`.${ACTIVE_BUTTON_CLASS}`) && target.matches(`button`)) {
    evt.preventDefault();
    imgFilter.querySelector(`.${ACTIVE_BUTTON_CLASS}`).classList.toggle(ACTIVE_BUTTON_CLASS, false);
    target.classList.toggle(ACTIVE_BUTTON_CLASS, true);
    timeout = setTimeout(function () {
      const maxSize = target.id === `filter-random` ? MAX_RANDOM_PHOTO : undefined;
      updatePictures(filter[target.id], maxSize);
    }, DEBOUNCE_INTERVAL);
  }
}

imgFilter.addEventListener(`click`, onImageFilterClick);

function createPicture(pictureData, orderNumber) {
  const picture = pictureTemplate.cloneNode(true);

  picture.dataset.id = pictureData.id;
  picture.dataset.orderNumber = orderNumber;
  picture.querySelector(`.picture__img`).src = pictureData.url;
  picture.querySelector(`.picture__likes`).textContent = pictureData.likes;
  picture.querySelector(`.picture__comments`).textContent = pictureData.comments.length.toString();

  return picture;
}

function updatePictures(comparator, maxSize) {
  const fragment = document.createDocumentFragment();
  if (comparator) {
    pictures.sort(comparator);
  }
  const exitCondition = maxSize || pictures.length;
  for (let i = 0; i < exitCondition; i++) {
    let pictureData = pictures[i];
    fragment.appendChild(createPicture(pictureData, i + 1));
  }

  pictureSection.querySelectorAll(`.picture`).forEach((e) => e.remove());
  pictureSection.appendChild(fragment);
}

function createPictures(picturesData) {
  pictures.length = 0;
  for (let i = 0; i < picturesData.length; i++) {
    picturesData[i].id = i + 1;
  }
  pictures.push(...picturesData);
  imgFilter.classList.toggle(`img-filters--inactive`, false);
  updatePictures();
  window.addListenersToPreview();
}

window.picture = {
  data: pictures,
  section: pictureSection,
  fill: createPictures,
};
