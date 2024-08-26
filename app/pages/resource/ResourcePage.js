import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component, Suspense, lazy } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { bindActionCreators } from 'redux';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Lightbox from 'lightbox-react';
import 'lightbox-react/style.css';
import Button from 'react-bootstrap/lib/Button';

import { addNotification } from 'actions/notificationsActions';
import { fetchResource } from 'actions/resourceActions';
import { clearReservations, toggleResourceMap } from 'actions/uiActions';
import PageWrapper from 'pages/PageWrapper';
import NotFoundPage from 'pages/not-found';
import ResourceCalendar from 'shared/resource-calendar';
import { injectT } from 'i18n';
import userManager from 'utils/userManager';
import {
  getMaxPeriodText, getResourcePageUrl, getMinPeriodText, getEquipment,
  showMinPeriod
} from 'utils/resourceUtils';
import ReservationCalendar from './reservation-calendar';
import ResourceHeader from './resource-header';
import ResourceInfo from './resource-info';
import ResourceMapInfo from './resource-map-info';
import resourcePageSelector from './resourcePageSelector';
import {
  createResourceOutlookCalendarLink,
  removeResourceOutlookCalendarLink,
  fetchResourceOutlookCalendarLinks,
} from 'resource-outlook-linker/actions';
import NextFreeTimesButton from './next-free-times-button/NextFreeTimesButton';
import OvernightCalendar from '../../shared/overnight-calendar/OvernightCalendar';

const ResourceMap = lazy(() => import('shared/resource-map'));

class UnconnectedResourcePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false,
    };

    this.fetchResource = this.fetchResource.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.createResourceOutlookCalendarLink = this.createResourceOutlookCalendarLink.bind(this);
    this.removeResourceOutlookCalendarLink = this.removeResourceOutlookCalendarLink.bind(this);
    this.fetchResourceOutlookCalendarLinks = this.fetchResourceOutlookCalendarLinks.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
  }

  componentDidMount() {
    this.props.actions.clearReservations();
    this.fetchResource();

    // NOTE: uncomment to get Outlook integration back
    // this.fetchResourceOutlookCalendarLinks();
    window.scrollTo(0, 0);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.date !== this.props.date || nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.fetchResource(nextProps.date);
    }
  }

  getImageThumbnailUrl(image) {
    const width = 700;
    const height = 420;

    return `${image.url}?dim=${width}x${height}`;
  }

  disableDays = (day) => {
    const { resource: { reservableAfter } } = this.props;
    const beforeDate = reservableAfter || moment();
    return moment(day).isBefore(beforeDate);
  }

  handleDateChange = (newDate) => {
    const { resource, history } = this.props;
    const day = newDate.toISOString().substring(0, 10);
    history.replace(getResourcePageUrl(resource, day));
  };

  handleBackButton() {
    this.props.history.goBack();
  }

  handleImageClick(photoIndex) {
    this.setState(() => ({ isOpen: true, photoIndex }));
  }

  orderImages(images) {
    return [].concat(
      images.filter(image => image.type === 'main'),
      images.filter(image => image.type !== 'main')
    );
  }

  renderImage = (image, index, { mainImageMobileVisibility = false }) => {
    const isMainImage = image.type === 'main';
    const className = classNames('app-ResourceInfo__image-wrapper', {
      'app-ResourceInfo__image-wrapper--main-image': isMainImage,
      'app-ResourceInfo__image-wrapper--mobile-main-image':
        isMainImage && mainImageMobileVisibility,
    });

    return (
      <div className={className} key={image.url}>
        <button
          className="app-ResourceInfo__image-button"
          onClick={() => this.handleImageClick(index)}
          type="button"
        >
          <img
            alt={image.caption}
            className="app-ResourceInfo__image"
            src={this.getImageThumbnailUrl(image)}
          />
        </button>
      </div>
    );
  };

  fetchResourceOutlookCalendarLinks() {
    return this.props.actions.fetchResourceOutlookCalendarLinks(this.props.id);
  }

  createResourceOutlookCalendarLink() {
    return this.props.actions.createResourceOutlookCalendarLink(this.props.resource.id);
  }

  removeResourceOutlookCalendarLink() {
    const link = this.props.calendarLink;
    return this.props.actions.removeResourceOutlookCalendarLink(link.resource, link.id);
  }

  async handleLoginClick() {
    const { currentLanguage, actions } = this.props;
    try {
      await userManager.signinRedirect({
        data: {
          redirectUrl: window.location.pathname
        },
        extraQueryParams: {
          ui_locales: currentLanguage
        },
      });
    } catch (error) {
      actions.addNotification({
        messageId: 'Notifications.loginErrorMessage',
        type: 'error',
        timeOut: 10000,
      });
    }
  }

  fetchResource(date = this.props.date) {
    const { actions, id } = this.props;
    const start = moment(date)
      .subtract(2, 'M')
      .startOf('month')
      .format();
    const end = moment(date)
      .add(2, 'M')
      .endOf('month')
      .format();

    actions.fetchResource(id, { start, end });
  }

  /**
   * Return text prompting user to login using strong authentication
   * if the resource requires it in order to make reservations.
   * @returns {JSX.Element}
   */
  renderLogin() {
    const {
      isLoggedIn, isStrongAuthSatisfied, resource, t
    } = this.props;
    /**
     * login text is only displayed on reservable resources
     * when the user does not fulfill strong auth requirement needed to make a reservation.
     */
    if (isStrongAuthSatisfied && (isLoggedIn || resource.authentication === 'unauthenticated')) {
      return null;
    }
    const message = isStrongAuthSatisfied ? t('ReservationInfo.loginMessage') : t('ReservationInfo.loginMessageStrongAuth');
    const messageParts = message.split('<a>');
    // if message has three parts e.g. "start of message <a>link text<a> end of message"
    const isMultiPartMessage = messageParts.length === 3;
    return (
      <p className="login-text">
        <Glyphicon aria-hidden="true" glyph="exclamation-sign" />
        {isMultiPartMessage && messageParts[0]}
        <Button bsStyle="link" className="login-button" onClick={this.handleLoginClick}>{isMultiPartMessage ? messageParts[1] : message}</Button>
        {isMultiPartMessage && messageParts[2]}
      </p>
    );
  }

  render() {
    const {
      actions,
      date,
      isFetchingResource,
      isLoggedIn,
      isStrongAuthSatisfied,
      location,
      match,
      resource,
      showMap,
      t,
      unit,
      history,
      contrast,
      currentLanguage,
    } = this.props;
    const { params } = match;
    const { isOpen, photoIndex } = this.state;

    if (isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    const maxPeriodText = getMaxPeriodText(t, resource);
    const minPeriodText = getMinPeriodText(t, resource);
    const images = this.orderImages(resource.images || []);
    const equipment = getEquipment(resource);

    const mainImageIndex = findIndex(images, image => image.type === 'main');
    const mainImage = mainImageIndex != null ? images[mainImageIndex] : null;
    const showBackButton = !!location.state && !!location.state.fromSearchResults;
    const showOutlookCalendarLinkButton = false;
    /* NOTE: uncomment to get Outlook integration back
    const showOutlookCalendarLinkButton = this.props.resource.userPermissions
      && (
        this.props.resource.userPermissions.isManager
        || this.props.resource.userPermissions.isAdmin
      )
      && (
        !!this.props.calendarLink
        || this.props.canCreateCalendarLink
      );
      */

    return (
      <div className="app-ResourcePage">
        <Loader loaded={!isEmpty(resource)}>
          <ResourceHeader
            contrast={contrast}
            isLoggedIn={isLoggedIn}
            onBackClick={this.handleBackButton}
            onMapClick={actions.toggleResourceMap}
            onOutlookCalendarLinkCreateClick={this.createResourceOutlookCalendarLink}
            onOutlookCalendarLinkRemoveClick={this.removeResourceOutlookCalendarLink}
            outlookLinkExists={!!this.props.calendarLink}
            resource={resource}
            showBackButton={showBackButton}
            showMap={showMap}
            showOutlookCalendarLinkButton={showOutlookCalendarLinkButton}
            unit={unit}
          />
          {showMap && unit && <ResourceMapInfo currentLanguage={currentLanguage} unit={unit} />}
          {showMap && (
            <Suspense fallback={<Loader className="loader-ease-in" />}>
              <ResourceMap
                location={location}
                resourceIds={[resource.id]}
                selectedUnitId={unit ? unit.id : null}
                showMap={showMap}
              />
            </Suspense>
          )}
          {!showMap && (
            <PageWrapper
              canonicalUrl={window.location.origin + window.location.pathname}
              title={resource.name || ''}
              transparent
            >
              <div>
                <Col className="app-ResourcePage__content" lg={9} md={9} xs={12}>
                  {mainImage
                    && this.renderImage(mainImage, mainImageIndex, {
                      mainImageMobileVisibility: true,
                    })}
                  <ResourceInfo
                    addNotification={actions.addNotification}
                    currentLanguage={currentLanguage}
                    equipment={equipment}
                    isLoggedIn={isLoggedIn}
                    isStrongAuthSatisfied={isStrongAuthSatisfied}
                    resource={resource}
                    unit={unit}
                  />

                  <Panel defaultExpanded header={t('ResourceInfo.reserveTitle')} id="reservation-panel" role="region">
                    <Panel.Heading>
                      <Panel.Title componentClass="h2">
                        {t('ResourceCalendar.header')}
                      </Panel.Title>
                    </Panel.Heading>
                    {resource.externalReservationUrl && (
                    <form action={resource.externalReservationUrl}>
                      <input
                        className="btn btn-primary"
                        type="submit"
                        value="Siirry ulkoiseen ajanvarauskalenteriin"
                      />
                    </form>
                    )}
                    {!resource.externalReservationUrl && (
                    <div>
                      {/* Show reservation min period text */}
                      {showMinPeriod(resource.minPeriod, resource.overnightReservations) && (
                        <div className="app-ResourcePage__content-min-period">
                          <p>{`${t('ReservationInfo.reservationMinLength')} ${minPeriodText}`}</p>
                        </div>
                      )}
                      {/* Show reservation max period text */}
                      {resource.maxPeriod && (
                      <div className="app-ResourcePage__content-max-period">
                        <p>{`${t('ReservationInfo.reservationMaxLength')} ${maxPeriodText}`}</p>
                      </div>
                      )}
                      {resource.reservable && this.renderLogin()}
                      {resource.overnightReservations ? (
                        <OvernightCalendar
                          handleDateChange={this.handleDateChange}
                          history={history}
                          params={params}
                          resource={resource}
                          selectedDate={date}
                        />
                      )
                        : (
                          <React.Fragment>
                            <ResourceCalendar
                              disableDays={this.disableDays}
                              onDateChange={this.handleDateChange}
                              resourceId={resource.id}
                              selectedDate={date}
                            />
                            <NextFreeTimesButton
                              addNotification={actions.addNotification}
                              handleDateChange={this.handleDateChange}
                              resource={resource}
                              selectedDate={date}
                            />
                            <ReservationCalendar
                              history={history}
                              location={location}
                              params={params}
                            />
                          </React.Fragment>
                        )
                      }
                    </div>
                    )}
                  </Panel>
                </Col>
                <Col className="app-ResourceInfo__images" lg={3} md={3} xs={12}>
                  <section>
                    {images.map(this.renderImage)}
                  </section>
                </Col>
              </div>
            </PageWrapper>
          )}
        </Loader>

        <div>
          {isOpen && (
            <Lightbox
              imageCaption={images[photoIndex].caption}
              mainSrc={images[photoIndex].url}
              nextSrc={images[(photoIndex + 1) % images.length].url}
              onCloseRequest={() => this.setState(() => ({ isOpen: false }))}
              onMoveNextRequest={() => this.setState(state => ({
                photoIndex: (state.photoIndex + 1) % images.length,
              }))
              }
              onMovePrevRequest={() => this.setState(state => ({
                photoIndex: (state.photoIndex + (images.length - 1)) % images.length,
              }))
              }
              prevSrc={images[(photoIndex + (images.length - 1)) % images.length].url}
              reactModalStyle={{ overlay: { zIndex: 2000 } }}
            />
          )}
        </div>
      </div>
    );
  }
}

UnconnectedResourcePage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isStrongAuthSatisfied: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  showMap: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  contrast: PropTypes.string,
  currentLanguage: PropTypes.string,
  calendarLink: PropTypes.object,
  // canCreateCalendarLink: PropTypes.bool, // NOTE: uncomment to get Outlook integration back
};
UnconnectedResourcePage = injectT(UnconnectedResourcePage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    clearReservations,
    fetchResource,
    toggleResourceMap,
    fetchResourceOutlookCalendarLinks,
    createResourceOutlookCalendarLink,
    removeResourceOutlookCalendarLink,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedResourcePage };
export default connect(
  resourcePageSelector,
  mapDispatchToProps
)(UnconnectedResourcePage);
