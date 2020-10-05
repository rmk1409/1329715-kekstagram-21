'use strict';

(function () {
  const AVATAR_SIZE = 35;

  const bigPicture = document.querySelector(`.big-picture`);

  const bigPictureImg = bigPicture.querySelector(`.big-picture__img img`);
  const bigPictureLikeCount = bigPicture.querySelector(`.likes-count`);
  const bigPictureCommentCount = bigPicture.querySelector(`.comments-count`);
  const socialCommentsList = bigPicture.querySelector(`.social__comments`);
  const bigPictureCaption = bigPicture.querySelector(`.social__caption`);
  const bigPictureSocialCommentCount = bigPicture.querySelector(`.social__comment-count`);
  const bigPictureLoaderButton = bigPicture.querySelector(`.comments-loader`);
  const closeBigPictureButton = bigPicture.querySelector(`.big-picture__cancel`);

  function openBigPicture(pictureData) {
    const fragment = document.createDocumentFragment();

    document.body.classList.add(`modal-open`);
    bigPicture.classList.remove(`hidden`);
    bigPictureSocialCommentCount.classList.add(`hidden`);
    bigPictureLoaderButton.classList.add(`hidden`);

    bigPictureImg.src = pictureData.url;
    bigPictureLikeCount.textContent = pictureData.likes;
    bigPictureCommentCount.textContent = pictureData.comments.length.toString();
    bigPictureCaption.textContent = pictureData.description;
    socialCommentsList.innerHTML = ``;

    for (let comment of pictureData.comments) {
      fragment.appendChild(makeCommentElement(comment));
    }
    socialCommentsList.appendChild(fragment);

    closeBigPictureButton.addEventListener(`click`, onCloseBigPictureButton);
    document.addEventListener(`keydown`, onDocumentEscBigPictureKeydown);
  }

  function closeBigPicture() {
    bigPicture.classList.add(`hidden`);
    document.body.classList.remove(`modal-open`);

    closeBigPictureButton.removeEventListener(`click`, onCloseBigPictureButton);
    document.removeEventListener(`keydown`, onDocumentEscBigPictureKeydown);
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
      openBigPicture(window.data.generatedPictures[picture.dataset.id - 1]);
    }
  }

  function onPicturesContainerKeydownEnter(evt) {
    const picture = evt.target;
    if (evt.key === `Enter` && picture.matches(`.picture`)) {
      openBigPicture(window.data.generatedPictures[picture.dataset.id - 1]);
    }
  }

  function run() {
    window.picture.pictureSection.addEventListener(`click`, onPicturesContainerClick);
    window.picture.pictureSection.addEventListener(`keydown`, onPicturesContainerKeydownEnter);
    window.picture.pictureSection.addEventListener(`click`, onPicturesContainerClick);
    window.picture.pictureSection.addEventListener(`keydown`, onPicturesContainerKeydownEnter);
  }

  window.preview = {
    run
  };
})();
