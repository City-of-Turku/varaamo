
import PropTypes from 'prop-types';
import React from 'react';
import Linkify from 'react-linkify';

import constants from 'constants/AppConstants';

// matches content: "[text](url)"
const linkRegex = constants.REGEX.namedLink;

/**
 * If text contains [text](url), replaces those parts with:
 * <a href="url" {linkAttributes}>text</a>
 * @param {string} text
 * @param {Object} linkAttributes
 * @returns an array that contains text and link elements
 */
function parseNamedLinks(text, linkAttributes) {
  const textSplits = text.split(linkRegex);
  const elements = textSplits.map((textSplit, index) => {
    // dont handle undefined splits
    if (textSplit === undefined) {
      return null;
    }

    if (textSplit.match(linkRegex)) {
      // find link name text between []
      let linkText = textSplit.match(/(\[[^[\]]*?\])/gm)[0];
      // remove []
      linkText = linkText.substring(1, linkText.length - 1);

      // find link url text between ()
      let linkUrl = textSplit.match(/(\(.*?(?!\[\]\(\))*?\))/gm)[0];
      // remove ()
      linkUrl = linkUrl.substring(1, linkUrl.length - 1);
      return (
        <a href={linkUrl} key={index} {...linkAttributes}>
          {linkText}
        </a>
      );
    }
    return textSplit;
  });

  return elements;
}

/**
 * Handles finding links within the given text string and returns the text
 * converted into JSX text and link elements.
 * @param {string} text input string to be converted into linkified JSX
 * @param {number} index key value of the returned JSX element
 * @param {boolean} openLinksInNewTab are generated links opened in new tabs
 * @param {boolean} allowNamedLinks are named links converted into links
 */
function renderParagraph(text, index, openLinksInNewTab, allowNamedLinks) {
  const properties = openLinksInNewTab
    ? {
      rel: 'noopener noreferrer',
      target: '_blank',
    }
    : {};

  return (
    <div key={index}>
      <Linkify properties={properties}>
        {allowNamedLinks ? parseNamedLinks(text, properties) : text}
      </Linkify>
    </div>
  );
}

function WrappedText(
  { text, openLinksInNewTab = false, allowNamedLinks = false }
) {
  if (!text) {
    return <div />;
  }
  return (
    <div className="wrapped-text">
      {text
        .split('\n')
        .map((paragraph, index) => renderParagraph(
          paragraph, index, openLinksInNewTab, allowNamedLinks
        ))}
    </div>
  );
}

WrappedText.propTypes = {
  text: PropTypes.string,
  openLinksInNewTab: PropTypes.bool,
  allowNamedLinks: PropTypes.bool,
};

export default WrappedText;
