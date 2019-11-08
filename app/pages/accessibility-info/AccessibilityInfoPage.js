
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import { FinnishText, SwedishText } from './content';
import { injectT } from 'i18n';
import PageWrapper from 'pages/PageWrapper';


class AccessibilityInfoPage extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    currentLanguage: PropTypes.string,
  };

  /**
   * Scrolls view to the top.
   */
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  /**
   * renders FinnishText/SwedishText according to currentLanguage
   * FinnishText/SwedishText are imported as strings, then given to
   * FormattedHTMLMessage to render the html strings.
   *
   * Normally FormattedHTMLMessage gets texts according to the id
   * from the .json files but in this case its only a nonexistant dummy id,
   * so it always uses the defaultMessage which changes with language.
   */
  render() {
    const { t, currentLanguage } = this.props;
    const content = currentLanguage === 'fi' ? FinnishText : SwedishText;
    return (
      <PageWrapper className="accessibility-info-page" title={t('AccessibilityInfo.title')}>
        <FormattedHTMLMessage defaultMessage={content} id="AccessibilityContent" />
      </PageWrapper>
    );
  }
}

export default injectT(AccessibilityInfoPage);
