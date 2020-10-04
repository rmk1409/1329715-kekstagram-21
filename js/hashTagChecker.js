'use strict';

(function () {
  const MAX_TAG_COUNT = 5;
  const HASHTAG_MAX_LENGTH = 19;

  function startWithHash(hashes) {
    return hashes.every((hash) => hash.startsWith(`#`));
  }

  function checkRegEx(hashes) {
    const regEx = RegExp(`^#(\\w){1,${HASHTAG_MAX_LENGTH}}$`);
    return hashes.every((hash) => regEx.test(hash));
  }

  function checkDuplicatesAbsence(hashes) {
    return hashes.length === new Set(hashes.map((el) => el.toUpperCase())).size;
  }

  function checkTagMaxCount(hashes) {
    return hashes.length <= MAX_TAG_COUNT;
  }

  function checkAbsenceTags(hashInputValue) {
    return hashInputValue === ``;
  }

  function checkHashTags(hashInputValue) {
    const hashes = hashInputValue.split(` `).filter((el) => el.length > 0);

    return checkAbsenceTags(hashInputValue)
      || (startWithHash(hashes) && checkRegEx(hashes) && checkDuplicatesAbsence(hashes) && checkTagMaxCount(hashes));
  }

  window.hashTagChecker = {
    checkHashTags
  };
})();
