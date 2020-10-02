'use strict';

const MESSAGE_TEMPLATES = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
];
const NAME_TEMPLATES = [
  `Оля`,
  `Даша`,
  `Катя`,
  `Георгий`
];
const PHOTO_COUNT = 25;
const MIN_LIKE_COUNT = 15;
const SHIFT_LIKE_COUNT = 185;
const MAX_COMMENT_COUNT = 3;
const AVATAR_COUNT = 6;
const AVATAR_SIZE = 35;

const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`a.picture`);
const pictureSection = document.querySelector(`.pictures`);
const bigPicture = document.querySelector(`.big-picture`);
const bigPictureImg = bigPicture.querySelector(`.big-picture__img img`);
const bigPictureLikeCount = bigPicture.querySelector(`.likes-count`);
const bigPictureCommentCount = bigPicture.querySelector(`.comments-count`);
const socialCommentsList = bigPicture.querySelector(`.social__comments`);
const bigPictureCaption = bigPicture.querySelector(`.social__caption`);
const bigPictureSocialCommentCount = bigPicture.querySelector(`.social__comment-count`);
const bigPictureLoaderButton = bigPicture.querySelector(`.comments-loader`);

const picturesContainer = document.querySelector(`.pictures`);
const closeBigPictureButton = bigPicture.querySelector(`.big-picture__cancel`);

function generateComments() {
  const comments = [];
  const commentCount = Math.ceil(Math.random() * MAX_COMMENT_COUNT);
  for (let i = 0; i < commentCount; i++) {
    const generatedAvatarValue = `img/avatar-${Math.ceil(Math.random() * AVATAR_COUNT)}.svg`;
    const generatedMessageValue = MESSAGE_TEMPLATES[Math.floor(Math.random() * MESSAGE_TEMPLATES.length)];
    const generatedNameValue = NAME_TEMPLATES[Math.floor(Math.random() * NAME_TEMPLATES.length)];
    comments.push({
      avatar: generatedAvatarValue,
      message: generatedMessageValue,
      name: generatedNameValue
    });
  }
  return comments;
}

function generatePictures(count) {
  const pictures = [];
  for (let i = 0; i < count; i++) {
    const generatedUrlValue = `photos/${i + 1}.jpg`;
    const generatedDescriptionValue = `descr - ${i + 1}`;
    const generatedLikesValue = Math.floor(MIN_LIKE_COUNT + Math.random() * SHIFT_LIKE_COUNT);
    pictures.push({
      id: (i + 1),
      url: generatedUrlValue,
      description: generatedDescriptionValue,
      likes: generatedLikesValue,
      comments: generateComments()
    });
  }
  return pictures;
}

function createPicture(pictureData) {
  const picture = pictureTemplate.cloneNode(true);
  picture.dataset.id = pictureData.id;
  picture.querySelector(`.picture__img`).src = pictureData.url;
  picture.querySelector(`.picture__likes`).textContent = pictureData.likes;
  picture.querySelector(`.picture__comments`).textContent = pictureData.comments.length.toString();
  return picture;
}

function createPictures(pictures) {
  const fragment = document.createDocumentFragment();
  for (let picture of pictures) {
    fragment.appendChild(createPicture(picture));
  }
  pictureSection.appendChild(fragment);
}

const generatedPictures = generatePictures(PHOTO_COUNT);
createPictures(generatedPictures);

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
  comment.appendChild(avatar);
  msg.classList.add(`social__text`);
  msg.textContent = commentData.message;
  comment.appendChild(msg);
  return comment;
}

function openBigPicture(pictureData) {
  const fragment = document.createDocumentFragment();
  bigPicture.classList.remove(`hidden`);
  document.body.classList.add(`modal-open`);
  bigPictureImg.src = pictureData.url;
  bigPictureLikeCount.textContent = pictureData.likes;
  bigPictureCommentCount.textContent = pictureData.comments.length.toString();
  bigPictureCaption.textContent = pictureData.description;
  bigPictureSocialCommentCount.classList.add(`hidden`);
  bigPictureLoaderButton.classList.add(`hidden`);
  socialCommentsList.innerHTML = ``;
  for (let comment of pictureData.comments) {
    fragment.appendChild(makeCommentElement(comment));
  }
  socialCommentsList.appendChild(fragment);

  picturesContainer.removeEventListener(`click`, onPicturesContainerClick);
  picturesContainer.removeEventListener(`keydown`, onPicturesContainerKeydownEnter);

  closeBigPictureButton.addEventListener(`click`, onCloseBigPictureButton);
  document.addEventListener(`keydown`, onDocumentEscBigPictureKeydown);
}

function closeBigPicture() {
  bigPicture.classList.add(`hidden`);
  document.body.classList.remove(`modal-open`);

  picturesContainer.addEventListener(`click`, onPicturesContainerClick);
  picturesContainer.addEventListener(`keydown`, onPicturesContainerKeydownEnter);

  closeBigPictureButton.removeEventListener(`click`, onCloseBigPictureButton);
  document.removeEventListener(`keydown`, onDocumentEscBigPictureKeydown);
}

function onPicturesContainerClick(evt) {
  if (evt.target.matches(`.picture__img`)) {
    evt.preventDefault();
  }
  const pathElement = evt.path[1];
  if (pathElement.matches(`.picture`)) {
    openBigPicture(generatedPictures[pathElement.dataset.id - 1]);
  }
}

picturesContainer.addEventListener(`click`, onPicturesContainerClick);

function onPicturesContainerKeydownEnter(evt) {
  const pathElement = evt.path[0];
  if (evt.key === `Enter` && pathElement.matches(`.picture`)) {
    openBigPicture(generatedPictures[pathElement.dataset.id - 1]);
  }
}

picturesContainer.addEventListener(`keydown`, onPicturesContainerKeydownEnter);

function onCloseBigPictureButton() {
  closeBigPicture();
}

function onDocumentEscBigPictureKeydown(evt) {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    closeBigPicture();
  }
}
