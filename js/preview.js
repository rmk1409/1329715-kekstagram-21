'use strict';

const AVATAR_SIZE = 35;
const DEFAULT_COMMENT_COUNT = 5;
const COMMENT_EXTRA_PORTION_COUNT = 5;

const bigPicture = document.querySelector(`.big-picture`);

const bigPictureImg = bigPicture.querySelector(`.big-picture__img img`);
const bigPictureLikeCount = bigPicture.querySelector(`.likes-count`);
const bigPictureCommentCount = bigPicture.querySelector(`.comments-count`);
const bigPictureCurrentCommentCount = bigPicture.querySelector(`.comments-current-count`);
const socialCommentsList = bigPicture.querySelector(`.social__comments`);
const bigPictureCaption = bigPicture.querySelector(`.social__caption`);
const bigPictureSocialCommentCount = bigPicture.querySelector(`.social__comment-count`);
const bigPictureLoaderButton = bigPicture.querySelector(`.comments-loader`);
const closeBigPictureButton = bigPicture.querySelector(`.big-picture__cancel`);

function addComments(pictureData) {
  const fragment = document.createDocumentFragment();
  const commentCount = pictureData.comments.length;

  let initialCommentCount = DEFAULT_COMMENT_COUNT;
  if (commentCount <= DEFAULT_COMMENT_COUNT) {
    bigPictureSocialCommentCount.classList.add(`hidden`);
    bigPictureLoaderButton.classList.add(`hidden`);
    initialCommentCount = commentCount;
  } else {
    bigPictureSocialCommentCount.classList.remove(`hidden`);
    bigPictureLoaderButton.classList.remove(`hidden`);
    bigPictureCurrentCommentCount.textContent = initialCommentCount.toString();
    bigPictureCommentCount.textContent = commentCount.toString();
  }

  for (let i = 0; i < initialCommentCount; i++) {
    const comment = pictureData.comments[i];
    fragment.appendChild(makeCommentElement(comment));
  }
  socialCommentsList.appendChild(fragment);
}

function onLoadMoreButtonClick(evt) {
  const fragment = document.createDocumentFragment();
  const orderNumber = evt.target.closest(`.big-picture`).dataset.orderNumber;
  const currentPictureData = window.picture.data[orderNumber - 1];
  const totalCommentCount = currentPictureData.comments.length;

  let currentCommentCount = parseInt(bigPictureCurrentCommentCount.textContent, 10);
  let exitCondition = totalCommentCount;

  if (totalCommentCount > (currentCommentCount + COMMENT_EXTRA_PORTION_COUNT)) {
    bigPictureSocialCommentCount.classList.remove(`hidden`);
    bigPictureLoaderButton.classList.remove(`hidden`);
    exitCondition = (currentCommentCount + COMMENT_EXTRA_PORTION_COUNT);
    bigPictureCurrentCommentCount.textContent = exitCondition.toString();
  } else {
    bigPictureSocialCommentCount.classList.add(`hidden`);
    bigPictureLoaderButton.classList.add(`hidden`);
  }

  for (; currentCommentCount < exitCondition; currentCommentCount++) {
    const comment = currentPictureData.comments[currentCommentCount];
    fragment.appendChild(makeCommentElement(comment));
  }

  socialCommentsList.appendChild(fragment);
}

function openBigPicture(pictureData, orderNumber) {
  document.body.classList.add(`modal-open`);
  bigPicture.classList.remove(`hidden`);
  bigPicture.dataset.orderNumber = orderNumber;

  bigPictureImg.src = pictureData.url;
  bigPictureLikeCount.textContent = pictureData.likes;
  bigPictureCaption.textContent = pictureData.description;
  socialCommentsList.innerHTML = ``;
  addComments(pictureData);

  closeBigPictureButton.addEventListener(`click`, onCloseBigPictureButton);
  document.addEventListener(`keydown`, onDocumentEscBigPictureKeydown);
  bigPictureLoaderButton.addEventListener(`click`, onLoadMoreButtonClick);
}

function closeBigPicture() {
  bigPicture.classList.add(`hidden`);
  document.body.classList.remove(`modal-open`);

  closeBigPictureButton.removeEventListener(`click`, onCloseBigPictureButton);
  document.removeEventListener(`keydown`, onDocumentEscBigPictureKeydown);
  bigPictureLoaderButton.removeEventListener(`click`, onLoadMoreButtonClick);
}

function onCloseBigPictureButton() {
  closeBigPicture();
}

function onDocumentEscBigPictureKeydown(evt) {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    closeBigPicture();
  }
}

function makeCommentElement(commentData) {
  const comment = document.createElement(`li`);
  const avatar = document.createElement(`img`);
  const msg = document.createElement(`p`);
  comment.classList.add(`social__comment`);
  avatar.classList.add(`social__picture`);
  avatar.src = commentData.avatar;
  avatar.alt = commentData.name;
  avatar.width = AVATAR_SIZE;
  avatar.height = AVATAR_SIZE;
  msg.classList.add(`social__text`);
  msg.textContent = commentData.message;
  comment.appendChild(avatar);
  comment.appendChild(msg);
  return comment;
}

function onPicturesContainerClick(evt) {
  const picture = evt.target.closest(`.picture`);

  if (picture) {
    evt.preventDefault();
    const clickedPictureData = window.picture.data[picture.dataset.orderNumber - 1];
    openBigPicture(clickedPictureData, picture.dataset.orderNumber);
  }
}

function onPicturesContainerKeydownEnter(evt) {
  const target = evt.target;

  if (evt.key === `Enter` && target.matches(`.picture`)) {
    const clickedPictureData = window.picture.data[target.dataset.orderNumber - 1];
    openBigPicture(clickedPictureData, target.dataset.orderNumber);
  }
}

function addListeners() {
  window.picture.section.addEventListener(`click`, onPicturesContainerClick);
  window.picture.section.addEventListener(`keydown`, onPicturesContainerKeydownEnter);
}

window.addListenersToPreview = addListeners;
