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
const PICTURE_TEMPLATE = document.querySelector(`#picture`).content.querySelector(`a.picture`);
const PICTURES = document.querySelector(`.pictures`);
const BIG_PICTURE = document.querySelector(`.big-picture`);
const BIG_PICTURE_IMG = BIG_PICTURE.querySelector(`.big-picture__img img`);
const BIG_PICTURE_LIKE_COUNT = BIG_PICTURE.querySelector(`.likes-count`);
const BIG_PICTURE_COMMENT_COUNT = BIG_PICTURE.querySelector(`.comments-count`);
const SOCIAL_COMMENTS = BIG_PICTURE.querySelector(`.social__comments`);
const SOCIAL_COMMENT_LIST = SOCIAL_COMMENTS.querySelectorAll(`li`);
const BIG_PICTURE_CAPTION = BIG_PICTURE.querySelector(`.social__caption`);
const BIG_PICTURE_SOCIAL_COMMENT_COUNT = BIG_PICTURE.querySelector(`.social__comment-count`);
const BIG_PICTURE_LOADER_BUTTON = BIG_PICTURE.querySelector(`.comments-loader`);

function generateComments() {
  const result = [];
  const commentCount = Math.ceil(Math.random() * MAX_COMMENT_COUNT);
  for (let i = 0; i < commentCount; i++) {
    const generatedAvatarValue = `img/avatar-${Math.ceil(Math.random() * AVATAR_COUNT)}.svg`;
    const generatedMessageValue = MESSAGE_TEMPLATES[Math.floor(Math.random() * MESSAGE_TEMPLATES.length)];
    const generatedNameValue = NAME_TEMPLATES[Math.floor(Math.random() * NAME_TEMPLATES.length)];
    result.push({
      avatar: generatedAvatarValue,
      message: generatedMessageValue,
      name: generatedNameValue
    });
  }
  return result;
}

function generatePictures(count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const generatedUrlValue = `photos/${i + 1}.jpg`;
    const generatedDescriptionValue = `descr - ${i + 1}`;
    const generatedLikesValue = Math.floor(MIN_LIKE_COUNT + Math.random() * SHIFT_LIKE_COUNT);
    result.push({
      url: generatedUrlValue,
      description: generatedDescriptionValue,
      likes: generatedLikesValue,
      comments: generateComments()
    });
  }
  return result;
}

function createPicture(data) {
  const result = PICTURE_TEMPLATE.cloneNode(true);
  result.querySelector(`.picture__img`).src = data.url;
  result.querySelector(`.picture__likes`).textContent = data.likes;
  result.querySelector(`.picture__comments`).textContent = data.comments.length.toString();
  return result;
}

function createPictures(dataArray) {
  const fragment = document.createDocumentFragment();
  for (let data of dataArray) {
    fragment.appendChild(createPicture(data));
  }
  PICTURES.appendChild(fragment);
}

let pictures = generatePictures(PHOTO_COUNT);
createPictures(pictures);

BIG_PICTURE.classList.remove(`hidden`);

function makeCommentElement(data) {
  const result = document.createElement(`li`);
  result.classList.add(`social__comment`);
  const avatarElement = document.createElement(`img`);
  avatarElement.classList.add(`social__picture`);
  avatarElement.src = data.avatar;
  avatarElement.alt = data.name;
  avatarElement.width = AVATAR_SIZE;
  avatarElement.height = AVATAR_SIZE;
  result.appendChild(avatarElement);
  const msgElement = document.createElement(`p`);
  msgElement.classList.add(`social__text`);
  msgElement.textContent = data.message;
  result.appendChild(msgElement);
  return result;
}

function setupBigPicture(element) {
  BIG_PICTURE_IMG.src = element.url;
  BIG_PICTURE_LIKE_COUNT.textContent = element.likes;
  BIG_PICTURE_COMMENT_COUNT.textContent = element.comments.length.toString();
  BIG_PICTURE_CAPTION.textContent = element.description;
  BIG_PICTURE_SOCIAL_COMMENT_COUNT.classList.add(`hidden`);
  BIG_PICTURE_LOADER_BUTTON.classList.add(`hidden`);
  document.body.classList.add(`modal-open`);
  SOCIAL_COMMENT_LIST.forEach((el) => {
    el.remove();
  });
  const fragment = document.createDocumentFragment();
  for (let comment of element.comments) {
    fragment.appendChild(makeCommentElement(comment));
  }
  SOCIAL_COMMENTS.appendChild(fragment);
}

setupBigPicture(pictures[0]);
