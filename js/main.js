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
const PICTURE_TEMPLATE = document.querySelector(`#picture`).content.querySelector(`a.picture`);
const PICTURES = document.querySelector(`.pictures`);

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

createPictures(generatePictures(PHOTO_COUNT));
