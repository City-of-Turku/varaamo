import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { injectT } from 'i18n';
import { fetchAnnouncement } from './serviceAnnouncementUtils';
import { getLocalizedFieldValue } from '../../utils/languageUtils';

class ServiceAnnouncement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      announcement: null,
      show: false,
    };

    this.handleDismiss = this.handleDismiss.bind(this);
  }

  componentDidMount() {
    fetchAnnouncement()
      .then(data => this.setState({
        announcement: (data.results && data.results[0]) ? data.results[0] : null,
        show: data.results && data.results.length > 0
      }))
      .catch(() => this.setState({ announcement: null, show: false }));
  }

  handleDismiss() {
    this.setState({ show: false });
  }

  render() {
    const { announcement, show } = this.state;
    const { contrast, currentLanguage, t } = this.props;

    if (show && announcement && announcement.message) {
      return (
        <Alert
          bsStyle="danger"
          className={`service-announcement ${contrast}`}
          closeLabel={`${t('ServiceAnnouncement.close')} ${t('ServiceAnnouncement.title')}`}
          onDismiss={this.handleDismiss}
        >
          <div className="container">
            <p>
              <span id="service-announcement-title">
                {`${t('ServiceAnnouncement.title')}: `}
              </span>
              <span id="service-announcement-message">
                {getLocalizedFieldValue(announcement.message, currentLanguage)}
              </span>
            </p>
            <Button
              aria-label={`${t('ServiceAnnouncement.close')} ${t('ServiceAnnouncement.title')}`}
              onClick={this.handleDismiss}
            >
              {t('ServiceAnnouncement.close')}
            </Button>
          </div>
        </Alert>
      );
    }

    return null;
  }
}

ServiceAnnouncement.propTypes = {
  contrast: PropTypes.string.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ServiceAnnouncement);
