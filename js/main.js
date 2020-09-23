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

/**
 * Function generates array with js objects of the photo descriptions.
 * @return {[]} generated array.
 */
function generateJSObjectArray() {
  let size = 25;
  let result = [];
  for (let i = 1; i <= size; i++) {
    let obj = {};
    obj.url = `photos/${i}.jpg`;
    obj.description = `descr - ${i}`;
    obj.likes = Math.floor(15 + Math.random() * 185);
    obj.comments = [];
    for (let j = 0, likeAmount = Math.ceil(Math.random() * 3); j < likeAmount; j++) {
      let comment = {};
      comment.avatar = `img/avatar-${Math.ceil(Math.random() * 6)}.svg`;
      comment.message = MESSAGE_TEMPLATES[Math.floor(Math.random() * MESSAGE_TEMPLATES.length)];
      comment.name = NAME_TEMPLATES[Math.floor(Math.random() * NAME_TEMPLATES.length)];
      obj.comments.push(comment);
    }
    result.push(obj);
  }
  return result;
}

/**
 * Function creates DOM element based on js object.
 * @param {object} template is an html template for the DOM element
 * @param {object} data is the based js object
 * @return {ActiveX.IXMLDOMNode | Node} a ready node.
 */
function createDOMElement(template, data) {
  let result = template.cloneNode(true);
  result.querySelector(`.picture__img`).src = data.url;
  result.querySelector(`.picture__likes`).textContent = data.likes;
  result.querySelector(`.picture__comments`).textContent = data.comments.length.toString();
  return result;
}

/**
 * Function fills a fragment by the objects and it adds the fragment to the page.
 * @param {[]} dataArray is an array of the objects to fill the fragment.
 * @param {String} target is a class of the target element to add the fragment.
 */
function createDOMElements(dataArray, target) {
  let template = document.querySelector(`#picture`)
    .content
    .querySelector(`a.picture`);
  let fragment = document.createDocumentFragment();
  for (let data of dataArray) {
    fragment.appendChild(createDOMElement(template, data));
  }
  document.querySelector(target).appendChild(fragment);
}

createDOMElements(generateJSObjectArray(), `.pictures`);
