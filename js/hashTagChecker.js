'use strict';

const MAX_TAG_COUNT = 5;
const HASHTAG_MAX_LENGTH = 19;

const START_SYMBOL_MESSAGE = `Tag has to begin with '#' symbol`;
const REGEX_MESSAGE = `Tag can't have special symbols and size have to be between 2 and 20 symbols`;
const UNIQUE_MESSAGE = `Tags have to be unique`;
const MAX_COUNT_MESSAGE = `Tag count have to be no more than`;

function startWithHash(hashes) {
  if (!hashes.every((hash) => hash.startsWith(`#`))) {
    throw new Error(START_SYMBOL_MESSAGE);
  }
  return true;
}

function checkRegEx(hashes) {
  const regEx = RegExp(`^#(\\w){1,${HASHTAG_MAX_LENGTH}}$`);

  if (!hashes.every((hash) => regEx.test(hash))) {
    throw new Error(REGEX_MESSAGE);
  }
  return true;
}

function checkDuplicatesAbsence(hashes) {
  if (hashes.length !== new Set(hashes.map((el) => el.toUpperCase())).size) {
    throw new Error(UNIQUE_MESSAGE);
  }
  return true;
}

function checkTagMaxCount(hashes) {
  if (hashes.length > MAX_TAG_COUNT) {
    throw new Error(`${MAX_COUNT_MESSAGE} ${MAX_TAG_COUNT}`);
  }
  return true;
}

function checkHashTags(hashInputValue) {
  const hashes = hashInputValue.split(` `).filter((el) => el.trim());

  const isTagsValid = startWithHash(hashes) && checkRegEx(hashes) && checkDuplicatesAbsence(hashes) && checkTagMaxCount(hashes);
  return !hashInputValue || isTagsValid;
}

window.checkHashTags = checkHashTags;
