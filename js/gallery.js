'use strict';

(function () {
  function fillGallery(picturesData) {
    for (let i = 0; i < picturesData.length; i++) {
      picturesData[i].id = i + 1;
    }

    window.picture.createPictures(picturesData);
    window.data.generatedPictures.push(...picturesData);
    window.preview.run();
  }

  window.gallery = {
    fillGallery
  };
})();
