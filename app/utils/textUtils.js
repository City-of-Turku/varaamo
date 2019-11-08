import constants from 'constants/AppConstants';

/**
  * Finds named link syntax within given text and replaces found
  * strings with only the name of the link.
  * @param {string} text input text to be cleansed
  * @returns text where named links are replaced with their link names only.
  */
function cleanseNamedLinks(text) {
  const linkRegex = constants.REGEX.namedLink;
  const textSplits = text.split(linkRegex);
  const elements = textSplits.map((textSplit) => {
    // dont handle undefined splits
    if (textSplit === undefined) {
      return null;
    }

    if (textSplit.match(linkRegex)) {
      // find link name text between []
      let linkText = textSplit.match(/(\[[^[\]]*?\])/gm)[0];
      // remove []
      linkText = linkText.substring(1, linkText.length - 1);
      return linkText;
    }
    return textSplit;
  });

  return elements.join('');
}

/**
 * Creates a short snippet of given text.
 * @param {string} text input text for the snippet.
 * @param {number} maxCharacters how many characters long the snippet can be.
 */
function createTextSnippet(text, maxCharacters) {
  if (text === null) {
    return '';
  }

  if (text.length <= maxCharacters) {
    return text;
  }

  return `${text.substring(0, maxCharacters)}...`;
}

export {
  cleanseNamedLinks,
  createTextSnippet,
};
