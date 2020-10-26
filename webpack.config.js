const path = require("path");

module.exports = {
  entry: [
    "./js/imageLoader.js",
    "./js/popupMsg.js",
    "./js/backend.js",
    "./js/picture.js",
    "./js/preview.js",
    "./js/hashTagChecker.js",
    "./js/form.js",
    "./js/main.js",
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
}
