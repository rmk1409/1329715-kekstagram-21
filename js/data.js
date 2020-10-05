'use strict';

(function () {
  const PHOTO_COUNT = 25;
  const MESSAGE_TEMPLATES = [
    `Всё отлично!`,
    `В целом всё неплохо. Но не всё.`,
    `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
    `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
    `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
    `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
  ];
  const NAME_TEMPLATES = [`Оля`, `Даша`, `Катя`, `Георгий`];
  const MIN_LIKE_COUNT = 15;
  const MAX_LIKE_COUNT = 200;
  const MAX_COMMENT_COUNT = 6;
  const AVATAR_MIN_COUNT = 1;
  const AVATAR_MAX_COUNT = 6;

  function generateComments() {
    const comments = [];
    const commentCount = Math.ceil(Math.random() * MAX_COMMENT_COUNT);

    for (let i = 0; i < commentCount; i++) {
      const generatedAvatarValue = `img/avatar-${window.util.getRandom(AVATAR_MIN_COUNT, AVATAR_MAX_COUNT)}.svg`;
      const generatedMessageValue = MESSAGE_TEMPLATES[window.util.getRandom(0, MESSAGE_TEMPLATES.length - 1)];
      const generatedNameValue = NAME_TEMPLATES[window.util.getRandom(0, NAME_TEMPLATES.length - 1)];

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
      const generatedLikesValue = window.util.getRandom(MIN_LIKE_COUNT, MAX_LIKE_COUNT);

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

  const generatedPictures = [];

  function run() {
    generatedPictures.push(...generatePictures(PHOTO_COUNT));
  }

  window.data = {
    generatedPictures,
    run
  };
})();
