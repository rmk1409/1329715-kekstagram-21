'use strict';

(function () {
  let generatedPictures = [];

  function fillGallery(photoCount) {
    generatedPictures.push(...window.data.generatePictures(photoCount));
    window.picture.createPictures(generatedPictures);
  }

  window.gallery = {
    generatedPictures,
    fillGallery
  };
})();
