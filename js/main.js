'use strict';

(function () {
  window.data.run();
  window.gallery.fillGallery(window.data.generatedPictures);
  window.preview.run();
  window.form.run();
})();
