'use strict';

(function () {
  const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`a.picture`);
  const pictureSection = document.querySelector(`.pictures`);

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

  window.picture = {
    pictureSection,
    createPictures
  };
})();
