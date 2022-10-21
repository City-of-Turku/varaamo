import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from 'react-loader';

import { getFeedbackForm, postFeedback } from './qualityToolsUtils';
import { currentLanguageSelector } from '../../state/selectors/translationSelectors';
import injectT from '../../i18n/injectT';
import QualityToolsForm from './QualityToolsForm';

class QualityToolsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stars: 3,
      textFeedback: '',
      hoverTargetStar: -1,
      isFormSubmitted: false,
      isFormLoaded: false,
      formData: {},
    };

    this.handleSetStars = this.handleSetStars.bind(this);
    this.handleHoverEnter = this.handleHoverEnter.bind(this);
    this.handleHoverLeave = this.handleHoverLeave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    const { state } = this.props;
    getFeedbackForm(state).then(
      data => this.setState({ formData: data, isFormLoaded: true })
    );
  }

  handleSetStars(event) {
    const { value } = event.target;
    this.setState({ stars: Number(value) });
  }

  handleHoverEnter(targetStar) {
    this.setState({ hoverTargetStar: targetStar });
  }

  handleHoverLeave() {
    this.setState({ hoverTargetStar: -1 });
  }

  handleTextChange(event) {
    const { value } = event.target;
    this.setState({ textFeedback: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { stars, textFeedback } = this.state;
    const { reservation, state } = this.props;
    postFeedback(reservation.id, stars, textFeedback, state);
    this.setState({ isFormSubmitted: true });
  }

  render() {
    const {
      stars, hoverTargetStar, textFeedback, isFormSubmitted, formData, isFormLoaded
    } = this.state;
    const { currentLanguage, t } = this.props;

    if (isFormLoaded && formData && 'errorOccurred' in formData && formData.errorOccurred) {
      return null;
    }

    return (
      <div id="quality-tools-container">
        {!isFormSubmitted && (
          <Loader loaded={isFormLoaded}>
            <QualityToolsForm
              currentLanguage={currentLanguage}
              formData={formData}
              handleHoverEnter={this.handleHoverEnter}
              handleHoverLeave={this.handleHoverLeave}
              handleSetStars={this.handleSetStars}
              handleSubmit={this.handleSubmit}
              handleTextChange={this.handleTextChange}
              hoverTargetStar={hoverTargetStar}
              stars={stars}
              textFeedback={textFeedback}
            />
          </Loader>
        )}
        <div id="quality-tools-feedback-post-thank-you" role="alert">
          <p className={isFormSubmitted ? '' : 'hidden'}>{t('qualityTools.thankYouForFeedback')}</p>
        </div>
      </div>
    );
  }
}

QualityToolsContainer.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  reservation: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    currentLanguage: currentLanguageSelector(state),
    state,
  };
}

// eslint-disable-next-line no-class-assign
QualityToolsContainer = injectT(QualityToolsContainer);

export { QualityToolsContainer as UnconnectedQualityToolsForm };
export default connect(mapStateToProps, null)(injectT(QualityToolsContainer));
