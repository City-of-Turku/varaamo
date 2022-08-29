import constants from 'constants/AppConstants';

import React from 'react';
import Loader from 'react-loader';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import { first, isEmpty, last } from 'lodash';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import User from 'utils/fixtures/User';
import ReservationConfirmation from './reservation-confirmation/ReservationConfirmation';
import ReservationInformation from './reservation-information/ReservationInformation';
import ReservationPhases from './reservation-phases/ReservationPhases';
import ReservationTime from './reservation-time/ReservationTime';
import { UnconnectedReservationPage as ReservationPage } from './ReservationPage';
import {
  checkOrderPrice, createOrder, getInitialProducts, createOrderLines, hasProducts
} from 'utils/reservationUtils';
import userManager from 'utils/userManager';
import ReservationProducts from './reservation-products/ReservationProducts';
import Product from '../../utils/fixtures/Product';
import ProductCustomerGroup from '../../utils/fixtures/ProductCustomerGroup';
import CustomerGroup from '../../utils/fixtures/CustomerGroup';

jest.mock('utils/reservationUtils', () => {
  const originalModule = jest.requireActual('utils/reservationUtils');
  return {
    __esModule: true,
    ...originalModule,
    checkOrderPrice: jest.fn(() => Promise.resolve({
      id: 'test',
    })),
  };
});

describe('pages/reservation/ReservationPage', () => {
  const resource = Immutable(Resource.build());
  const history = {
    replace: () => { },
  };
  const defaultProps = {
    history,
    actions: {
      addNotification: jest.fn(),
      clearReservations: simple.mock(),
      closeReservationSuccessModal: simple.mock(),
      fetchResource: simple.mock(),
      handleRedirect: simple.mock(),
      openResourcePaymentTermsModal: simple.mock(),
      openResourceTermsModal: simple.mock(),
      putReservation: simple.mock(),
      postReservation: simple.mock(),
    },
    contrast: '',
    currentLanguage: 'fi',
    date: '2016-10-10',
    isAdmin: false,
    isLoggedIn: false,
    isStaff: false,
    isFetchingResource: false,
    isMakingReservations: false,
    location: {},
    match: { search: '' },
    reservationToEdit: null,
    reservationCreated: null,
    reservationEdited: null,
    resource,
    selected: [
      {
        begin: '2016-10-10T10:00:00+03:00',
        end: '2016-10-10T11:00:00+03:00',
        resource: resource.id,
      },
      {
        begin: '2016-10-10T11:00:00+03:00',
        end: '2016-10-10T12:00:00+03:00',
        resource: resource.id,
      },
    ],
    state: {},
    unit: Immutable(Unit.build()),
    user: Immutable(User.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationPage {...defaultProps} {...extraProps} />);
  }

  describe('PageWrapper title', () => {
    test(
      'renders new reservation title when reservationToEdit and reservationEdited is empty',
      () => {
        const pageWrapper = getWrapper({
          reservationToEdit: null,
          reservationEdited: null,
        }).find(PageWrapper);

        expect(pageWrapper).toHaveLength(1);
        expect(pageWrapper.prop('title')).toBe('ReservationPage.newReservationTitle');
      }
    );

    test('renders edit reservation title when reservationToEdit not empty', () => {
      const pageWrapper = getWrapper({
        reservationToEdit: Reservation.build(),
      }).find(PageWrapper);

      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('title')).toBe('ReservationPage.editReservationTitle');
    });

    test('renders edit reservation title when reservationEdited not empty', () => {
      const pageWrapper = getWrapper({
        reservationEdited: Reservation.build(),
      }).find(PageWrapper);

      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('title')).toBe('ReservationPage.editReservationTitle');
    });
  });

  describe('__content ', () => {
    const defClass = 'app-ReservationPage__content ';

    test('does not get additional class when high-contrast: false', () => {
      const element = getWrapper().find('div').at(1);
      expect(element.prop('className')).toBe(defClass);
    });

    test('gets additional class when high-contrast: true', () => {
      const element = getWrapper({ contrast: 'high-contrast' }).find('div').at(1);
      expect(element.prop('className')).toBe(`${defClass}high-contrast`);
    });
  });

  describe('Loader', () => {
    test('prop loaded true when resource not empty', () => {
      const loader = getWrapper({
        resource,
      }).find(Loader);

      expect(loader).toHaveLength(1);
      expect(loader.prop('loaded')).toBe(true);
    });

    test('not rendered when resource empty', () => {
      const loader = getWrapper({
        resource: {},
      }).find(Loader);

      expect(loader).toHaveLength(0);
    });
  });

  describe('ReservationPhases', () => {
    const resourceA = Resource.build();
    test('renders correct props when reservationToEdit null', () => {
      const reservationPhases = getWrapper({
        reservationToEdit: null,
        resource: resourceA
      }).find(ReservationPhases);
      expect(reservationPhases).toHaveLength(1);
      expect(reservationPhases.prop('currentPhase')).toBe('information');
      expect(reservationPhases.prop('hasProducts')).toBe(hasProducts(resourceA));
      expect(reservationPhases.prop('isEditing')).toBe(false);
      expect(reservationPhases.prop('needManualConfirmation')).toBe(resourceA.needManualConfirmation);
    });

    test('renders correct props when reservationToEdit not null', () => {
      const reservationPhases = getWrapper({
        reservationToEdit: Reservation.build(),
        resource: resourceA
      }).find(ReservationPhases);
      expect(reservationPhases).toHaveLength(1);
      expect(reservationPhases.prop('currentPhase')).toBe('time');
      expect(reservationPhases.prop('hasProducts')).toBe(hasProducts(resourceA));
      expect(reservationPhases.prop('isEditing')).toBe(true);
      expect(reservationPhases.prop('needManualConfirmation')).toBe(resourceA.needManualConfirmation);
    });
  });

  describe('ReservationTime', () => {
    test('renders ReservationTime when reservationToEdit not empty', () => {
      const reservationTime = getWrapper({
        reservationToEdit: Reservation.build(),
      }).find(ReservationTime);
      expect(reservationTime).toHaveLength(1);
    });

    test('does not render ReservationTime when reservationToEdit is empty', () => {
      const reservationTime = getWrapper({
        reservationToEdit: null,
      }).find(ReservationTime);
      expect(reservationTime).toHaveLength(0);
    });
  });

  describe('ReservationProducts', () => {
    test('renders when view is products and selected time is not empty', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      wrapper.setState({ view: 'products' });
      const { selected } = defaultProps;
      const begin = !isEmpty(selected) ? first(selected).begin : null;
      const end = !isEmpty(selected) ? last(selected).end : null;
      const expectedSelectedTime = begin && end ? { begin, end } : null;
      const reservationProducts = wrapper.find(ReservationProducts);
      expect(reservationProducts).toHaveLength(1);
      expect(reservationProducts.prop('changeProductQuantity')).toBe(instance.handleChangeProductQuantity);
      expect(reservationProducts.prop('currentCustomerGroup')).toBe(instance.state.currentCustomerGroup);
      expect(reservationProducts.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
      expect(reservationProducts.prop('currentPaymentMethod')).toBe(instance.state.currentPaymentMethod);
      expect(reservationProducts.prop('customerGroupError')).toBe(instance.state.customerGroupError);
      expect(reservationProducts.prop('isEditing')).toBe(!isEmpty(defaultProps.reservationToEdit));
      expect(reservationProducts.prop('isStaff')).toBe(defaultProps.isStaff);
      expect(reservationProducts.prop('onBack')).toBe(instance.handleBack);
      expect(reservationProducts.prop('onCancel')).toBe(instance.handleCancel);
      expect(reservationProducts.prop('onConfirm')).toBe(instance.handleProductsConfirm);
      expect(reservationProducts.prop('onCustomerGroupChange')).toBe(instance.handleCustomerGroupChange);
      expect(reservationProducts.prop('onPaymentMethodChange')).toBe(instance.handlePaymentMethodChange);
      expect(reservationProducts.prop('onStaffSkipChange')).toBe(instance.HandleToggleMandatoryProducts);
      expect(reservationProducts.prop('order')).toBe(instance.state.order);
      expect(reservationProducts.prop('resource')).toBe(defaultProps.resource);
      expect(reservationProducts.prop('selectedTime')).toStrictEqual(expectedSelectedTime);
      expect(reservationProducts.prop('skipMandatoryProducts')).toBe(instance.state.skipMandatoryProducts);
      expect(reservationProducts.prop('unit')).toBe(defaultProps.unit);
    });
  });

  describe('ReservationInformation', () => {
    test(
      'renders ReservationInformation when view is information and selected not empty',
      () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        const reservationInformation = wrapper.find(ReservationInformation);
        expect(reservationInformation).toHaveLength(1);
        expect(reservationInformation.prop('currentCustomerGroup')).toBe(instance.state.currentCustomerGroup);
        expect(reservationInformation.prop('currentPaymentMethod')).toBe(instance.state.currentPaymentMethod);
        expect(reservationInformation.prop('isAdmin')).toBe(defaultProps.isAdmin);
        expect(reservationInformation.prop('isEditing')).toBeDefined();
        expect(reservationInformation.prop('isMakingReservations')).toBe(defaultProps.isMakingReservations);
        expect(reservationInformation.prop('isStaff')).toBe(defaultProps.isStaff);
        expect(reservationInformation.prop('onBack')).toBeDefined();
        expect(reservationInformation.prop('onCancel')).toBeDefined();
        expect(reservationInformation.prop('onConfirm')).toBeDefined();
        expect(reservationInformation.prop('openResourcePaymentTermsModal'))
          .toBe(defaultProps.actions.openResourcePaymentTermsModal);
        expect(reservationInformation.prop('openResourceTermsModal')).toBe(defaultProps.actions.openResourceTermsModal);
        expect(reservationInformation.prop('order')).toBe(instance.state.order);
        expect(reservationInformation.prop('reservation')).toBe(defaultProps.reservationToEdit);
        expect(reservationInformation.prop('resource')).toBe(defaultProps.resource);
        expect(reservationInformation.prop('selectedTime')).toBeDefined();
        expect(reservationInformation.prop('unit')).toBe(defaultProps.unit);
        expect(reservationInformation.prop('user')).toBe(defaultProps.user);
      }
    );

    test(
      'does not render ReservationInformation by default when reservationToEdit is not empty',
      () => {
        const reservationInformation = getWrapper({
          reservationToEdit: Reservation.build(),
        }).find(ReservationInformation);
        expect(reservationInformation).toHaveLength(0);
      }
    );
  });

  describe('ReservationConfirmation', () => {
    test('does not render ReservationConfirmation by default', () => {
      const reservationConfirmation = getWrapper().find(ReservationConfirmation);
      expect(reservationConfirmation).toHaveLength(0);
    });

    test('renders ReservationConfirmation with correct props when view is confirmation', () => {
      const reservationEdited = {};
      const wrapper = getWrapper({ reservationEdited });
      wrapper.setState({ view: 'confirmation' });
      const reservationConfirmation = wrapper.find(ReservationConfirmation);
      const isEdited = Object.keys(reservationEdited).length !== 0;

      expect(reservationConfirmation).toHaveLength(1);
      expect(reservationConfirmation.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
      expect(reservationConfirmation.prop('history')).toBe(defaultProps.history);
      expect(reservationConfirmation.prop('isEdited')).toBe(isEdited);
      expect(reservationConfirmation.prop('isLoggedIn')).toBe(defaultProps.isLoggedIn);
      expect(reservationConfirmation.prop('reservation')).toBe(reservationEdited);
      expect(reservationConfirmation.prop('resource')).toBe(defaultProps.resource);
      expect(reservationConfirmation.prop('user')).toBe(defaultProps.user);
    });
  });

  describe('constructor', () => {
    test('state view is time when prop reservationToEdit not empty', () => {
      const instance = getWrapper({
        reservationToEdit: Reservation.build(),
      }).instance();
      expect(instance.state.view).toBe('time');
    });

    test('state view is information when prop reservationToEdit empty', () => {
      const instance = getWrapper({
        reservationToEdit: null,
      }).instance();
      expect(instance.state.view).toBe('information');
    });
  });

  describe('componentDidMount', () => {
    describe('when state.view is', () => {
      const expectedPath = `/resources/${resource.id}/reservation`;
      function getInstance(created, edited) {
        const instance = getWrapper({
          reservationCreated: created,
          reservationEdited: edited,
          reservationToEdit: null,
          selected: [],
          location: {
            search: `?resource=${resource.id}`,
          },
        }).instance();
        return instance;
      }

      test('information and reservationCreated already exists', () => {
        const historyMock = simple.mock(history, 'push');
        const localInstance = getInstance(Reservation.build(), null);
        localInstance.componentDidMount();
        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      });

      test('information and reservationEdited already exists', () => {
        const historyMock = simple.mock(history, 'push');
        const localInstance = getInstance(null, Reservation.build());
        localInstance.componentDidMount();
        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      });
    });

    describe('when reservations and selected empty', () => {
      let historyMock;

      beforeAll(() => {
        historyMock = simple.mock(history, 'replace');
        const instance = getWrapper({
          reservationCreated: null,
          reservationEdited: null,
          reservationToEdit: null,
          selected: [],
        }).instance();
        instance.componentDidMount();
      });

      afterAll(() => {
        simple.restore();
      });

      test('calls history.replace() with /my-reservations', () => {
        const expectedPath = '/my-reservations';
        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      });
    });

    describe('when reservations and selected empty and location search has resource', () => {
      let historyMock;

      beforeAll(() => {
        historyMock = simple.mock(history, 'replace');
        const instance = getWrapper({
          location: {
            search: `?resource=${resource.id}`,
          },
          reservationCreated: null,
          reservationEdited: null,
          reservationToEdit: null,
          selected: [],
        }).instance();
        instance.componentDidMount();
      });

      afterAll(() => {
        simple.restore();
      });

      test('calls history.replace() with /resources/id', () => {
        const expectedPath = `/resources/${resource.id}`;
        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      });
    });

    describe('when reservations and selected empty and location search path is manage-reservations', () => {
      let historyMock;

      beforeAll(() => {
        historyMock = simple.mock(history, 'replace');
        const instance = getWrapper({
          location: {
            search: '?path=manage-reservations',
          },
          reservationCreated: null,
          reservationEdited: null,
          reservationToEdit: null,
          selected: [],
        }).instance();
        instance.componentDidMount();
      });

      afterAll(() => {
        simple.restore();
      });

      test('calls history.replace() with /manage-reservations', () => {
        const expectedPath = '/manage-reservations';
        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      });
    });

    describe('when selected not empty', () => {
      let instance;
      beforeAll(() => {
        instance = getWrapper({
          selected: defaultProps.selected,
        }).instance();
        instance.fetchResource = simple.mock();
        instance.handleCheckOrderPrice = simple.mock();
        instance.componentDidMount();
      });

      afterAll(() => {
        simple.restore();
      });

      test('calls fetch resource', () => {
        expect(instance.fetchResource.callCount).toBe(1);
        expect(instance.fetchResource.lastCall.args).toEqual([]);
      });

      test('calls handleCheckOrderPrice', () => {
        const { selected, reservationToEdit } = instance.props;
        const { mandatoryProducts, extraProducts } = instance.state;
        expect(instance.handleCheckOrderPrice.callCount).toBe(1);
        expect(instance.handleCheckOrderPrice.lastCall.args[0]).toStrictEqual(resource);
        expect(instance.handleCheckOrderPrice.lastCall.args[1]).toStrictEqual(selected);
        expect(instance.handleCheckOrderPrice.lastCall.args[2]).toStrictEqual(mandatoryProducts);
        expect(instance.handleCheckOrderPrice.lastCall.args[3]).toStrictEqual(extraProducts);
        expect(instance.handleCheckOrderPrice.lastCall.args[4])
          .toStrictEqual(!isEmpty(reservationToEdit));
      });
    });

    test('calls handleSigninRefresh', () => {
      const loginExpiresAt = 1612788418;
      const instance = getWrapper({ loginExpiresAt }).instance();
      const spy = jest.spyOn(instance, 'handleSigninRefresh');
      instance.componentDidMount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(defaultProps.isLoggedIn, loginExpiresAt, 20);
    });
  });

  describe('componentWillUpdate', () => {
    const realLocation = window.location;
    afterAll(() => {
      window.location = realLocation;
    });

    test(
      'sets state view confirmation when next props has reservationCreated',
      () => {
        const instance = getWrapper().instance();
        const nextProps = {
          reservationCreated: Reservation.build(),
        };
        instance.componentWillUpdate(nextProps);
        expect(instance.state.view).toBe('confirmation');
      }
    );

    test(
      'sets state view confirmation when next props has reservationEdited',
      () => {
        const instance = getWrapper().instance();
        const nextProps = {
          reservationCreated: Reservation.build(),
        };
        instance.componentWillUpdate(nextProps);
        expect(instance.state.view).toBe('confirmation');
      }
    );

    describe('window.location redirect', () => {
      const currentUrl = 'https://www.current-location.fi/';
      const paymentUrl = 'http://test-payment-url.fi';

      test('sets window.location to paymentUrl when next props has reservation with order.paymentUrl', () => {
        delete window.location;
        window.location = currentUrl;

        const instance = getWrapper().instance();
        const reservationCreated = Reservation.build();
        reservationCreated.order = { paymentUrl };
        const nextProps = { reservationCreated };
        instance.componentWillUpdate(nextProps);

        expect(window.location).toBe(paymentUrl);
      });

      describe('when user is not staff', () => {
        const isStaff = false;
        test('does not set window.location to paymentUrl when reservation needs manual confirmation', () => {
          delete window.location;
          window.location = currentUrl;

          const instance = getWrapper({ isStaff }).instance();
          const reservationCreated = Reservation.build();
          reservationCreated.needManualConfirmation = true;
          reservationCreated.order = { paymentUrl };
          const nextProps = { reservationCreated };
          instance.componentWillUpdate(nextProps);

          expect(window.location).toBe(currentUrl);
        });
      });

      describe('when user is staff', () => {
        const isStaff = true;
        test('sets window.location to paymentUrl when reservation needs manual confirmation', () => {
          delete window.location;
          window.location = currentUrl;

          const instance = getWrapper({ isStaff }).instance();
          const reservationCreated = Reservation.build();
          reservationCreated.needManualConfirmation = true;
          reservationCreated.order = { paymentUrl };
          const nextProps = { reservationCreated };
          instance.componentWillUpdate(nextProps);

          expect(window.location).toBe(paymentUrl);
        });

        test('does not set window.location to paymentUrl when reservation payment method is cash', () => {
          delete window.location;
          window.location = currentUrl;

          const instance = getWrapper({ isStaff }).instance();
          const reservationCreated = Reservation.build();
          reservationCreated.needManualConfirmation = true;
          reservationCreated.order = { paymentUrl, paymentMethod: constants.PAYMENT_METHODS.CASH };
          const nextProps = { reservationCreated };
          instance.componentWillUpdate(nextProps);

          expect(window.location).toBe(currentUrl);
        });
      });
    });
  });
  describe('componentWillUnmount when state.view is confirmation', () => {
    const clearReservations = simple.mock();
    const closeReservationSuccessModal = simple.mock();
    beforeAll(() => {
      const instance = getWrapper({
        actions: {
          clearReservations,
          closeReservationSuccessModal,
        },
      }).instance();
      instance.state.view = 'confirmation';
      instance.componentWillUnmount();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls clearReservations', () => {
      expect(clearReservations.callCount).toBe(1);
      expect(clearReservations.lastCall.args).toEqual([]);
    });

    test('calls closeReservationSuccessModal', () => {
      expect(closeReservationSuccessModal.callCount).toBe(1);
      expect(closeReservationSuccessModal.lastCall.args).toEqual([]);
    });
  });

  describe('componentWillUnmount when state.view is not confirmation', () => {
    const clearReservations = simple.mock();
    const closeReservationSuccessModal = simple.mock();
    beforeAll(() => {
      const instance = getWrapper({
        actions: {
          clearReservations,
          closeReservationSuccessModal,
        },
      }).instance();
      instance.componentWillUnmount();
    });

    afterAll(() => {
      simple.restore();
    });

    test('does not call clearReservations', () => {
      expect(clearReservations.callCount).toBe(0);
      expect(clearReservations.lastCall.args).toEqual([]);
    });

    test('calls closeReservationSuccessModal', () => {
      expect(closeReservationSuccessModal.callCount).toBe(1);
      expect(closeReservationSuccessModal.lastCall.args).toEqual([]);
    });
  });

  describe('fetchResource', () => {
    const fetchResource = simple.mock();
    beforeAll(() => {
      const instance = getWrapper({
        actions: {
          fetchResource,
        },
      }).instance();
      instance.fetchResource();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls actions.fetchResource', () => {
      expect(fetchResource.callCount).toBe(1);
      expect(fetchResource.lastCall.args).toHaveLength(2);
      expect(fetchResource.lastCall.args[0]).toEqual(resource.id);
    });
  });

  describe('getInitialView', () => {
    test('returns string time when reservation to edit is not empty', () => {
      const instance = getWrapper().instance();
      const reservationToEdit = Reservation.build();
      expect(instance.getInitialView(resource, reservationToEdit)).toBe('time');
    });

    describe('when reservation to edit is empty', () => {
      const reservationToEdit = null;

      test('returns string products when resource has products', () => {
        const instance = getWrapper().instance();
        const product = Product.build();
        const resourceA = Resource.build({ products: [product] });
        expect(instance.getInitialView(resourceA, reservationToEdit)).toBe('products');
      });

      test('returns string information when resource has no products', () => {
        const instance = getWrapper().instance();
        const resourceA = Resource.build({ products: [] });
        expect(instance.getInitialView(resourceA, reservationToEdit)).toBe('information');
      });
    });
  });

  describe('handleBack', () => {
    describe('when view is information and payments are involved', () => {
      test('sets state view to products', () => {
        const reservationToEdit = null;
        const product = Product.build();
        const resourceA = Resource.build({ products: [product] });
        const wrapper = getWrapper({ resource: resourceA, reservationToEdit });
        const instance = wrapper.instance();
        instance.state.view = 'information';
        instance.handleBack();
        expect(instance.state.view).toBe('products');
      });
    });

    describe('when view is not information and payments are not involved', () => {
      test('sets state view time when reservationToEdit is not empty', () => {
        const instance = getWrapper({
          reservationToEdit: Reservation.build(),
        }).instance();
        instance.handleBack();
        expect(instance.state.view).toBe('time');
      });
    });
  });

  describe('handleCancel', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'replace');
    });

    afterAll(() => {
      simple.restore();
    });

    describe('when reservationToEdit is not empty calls browserHistory.replace()', () => {
      test('with /my-reservations', () => {
        historyMock.reset();
        const expectedPath = '/my-reservations';
        const instance = getWrapper({
          reservationToEdit: Reservation.build(),
        }).instance();
        instance.handleCancel();

        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      });

      test('with /manage-reservations when location search path is manage-reservations', () => {
        historyMock.reset();
        const expectedPath = '/manage-reservations';
        const instance = getWrapper({
          reservationToEdit: Reservation.build(),
          location: {
            search: '?path=manage-reservations',
          },
        }).instance();
        instance.handleCancel();

        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      });
    });

    test(
      'calls history.replace() with /resources when reservationToEdit empty',
      () => {
        historyMock.reset();
        const expectedPath = `/resources/${resource.id}`;
        const instance = getWrapper({
          reservationToEdit: null,
        }).instance();
        instance.handleCancel();

        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      }
    );
  });

  describe('handleSigninRefresh', () => {
    const signinSilentMock = simple.mock();

    beforeEach(() => {
      signinSilentMock.reset();
      simple.mock(userManager, 'signinSilent', signinSilentMock);
    });

    test('calls userManager.signinSilent if isLoggedIn and loginExpiresAt are truthy', () => {
      const instance = getWrapper().instance();
      const isLoggedIn = true;
      const loginExpiresAt = 1612788418;
      instance.handleSigninRefresh(isLoggedIn, loginExpiresAt);
      expect(signinSilentMock.callCount).toBe(1);
    });

    test('does not call userManager.signinSilent if isLoggedIn or loginExpiresAt is falsy', () => {
      const instance = getWrapper().instance();
      const isLoggedIn = false;
      const loginExpiresAt = 1612788418;
      instance.handleSigninRefresh(isLoggedIn, loginExpiresAt);
      expect(signinSilentMock.callCount).toBe(0);
    });
  });

  describe('handleConfirmTime', () => {
    describe('when reservationToEdit is empty', () => {
      test('sets state view to information when resource has no products', () => {
        const instance = getWrapper().instance();
        instance.state.view = 'time';
        instance.handleConfirmTime();
        expect(instance.state.view).toBe('information');
      });

      test('sets state view to products when resource has products', () => {
        const product = Product.build();
        const resourceA = Resource.build({ products: [product] });
        const instance = getWrapper({ resource: resourceA }).instance();
        instance.state.view = 'time';
        instance.handleConfirmTime();
        expect(instance.state.view).toBe('products');
      });
    });
  });

  describe('handleProductsConfirm', () => {
    test('sets correct state when customer group is required and missing', () => {
      const cgA = CustomerGroup.build();
      const pcgA = ProductCustomerGroup.build({ customerGroup: cgA });
      const prodA = Product.build({ productCustomerGroups: [pcgA] });
      const resourceA = Resource.build({ products: [prodA] });
      const instance = getWrapper({ resource: resourceA }).instance();
      instance.state.currentCustomerGroup = '';
      instance.handleProductsConfirm();
      expect(instance.state.customerGroupError).toBe(true);
    });

    test('sets correct state when there are no validation errors', () => {
      const instance = getWrapper().instance();
      instance.handleProductsConfirm();
      expect(instance.state.view).toBe('information');
    });
  });

  describe('handleReservation', () => {
    const postReservation = simple.mock();
    const putReservation = simple.mock();
    const values = {
      someField: 'some value',
      comments: '',
    };

    test('calls putReservation action when reservationToEdit not empty', () => {
      const reservationToEdit = Reservation.build({ comments: 'some comment' });
      const instance = getWrapper({
        actions: {
          postReservation,
          putReservation,
        },
        reservationToEdit,
      }).instance();
      instance.handleReservation(values);
      expect(postReservation.callCount).toBe(0);
      expect(putReservation.callCount).toBe(1);
      expect(putReservation.lastCall.args[0].preferredLanguage).toEqual('fi');
      expect('order' in putReservation.lastCall.args[0]).toBe(false);
      expect(putReservation.lastCall.args[0].comments).toEqual('-');
      expect(putReservation.lastCall.args[0].someField).toEqual(values.someField);
    });

    test('calls postReservation action when reservationToEdit empty', () => {
      const products = [{ id: 'test-id', type: 'rent', quantity: 1 }];
      postReservation.reset();
      putReservation.reset();
      const instance = getWrapper({
        resource: Immutable(Resource.build({ products })),
        actions: {
          postReservation,
          putReservation,
        },
      }).instance();
      const { currentCustomerGroup, currentPaymentMethod } = instance.state;
      instance.handleReservation(values);
      expect(postReservation.callCount).toBe(1);
      expect(postReservation.lastCall.args[0].preferredLanguage).toEqual('fi');
      expect(postReservation.lastCall.args[0].order)
        .toEqual(createOrder(
          instance.props.resource.products, currentCustomerGroup, currentPaymentMethod
        ));
      expect(putReservation.callCount).toBe(0);
    });
  });

  describe('handleCreateErrorNotification', () => {
    afterEach(() => {
      defaultProps.actions.addNotification.mockClear();
    });

    test('calls actions.addNotification', () => {
      const instance = getWrapper().instance();
      instance.handleCreateErrorNotification();
      const expectedParams = { message: 'Notifications.errorMessage', timeOut: 10000, type: 'error' };
      expect(defaultProps.actions.addNotification).toHaveBeenCalledTimes(1);
      expect(defaultProps.actions.addNotification).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('handleCustomerGroupChange', () => {
    const event = { target: { value: 'cg-test' } };

    test('calls setState', () => {
      const instance = getWrapper().instance();
      const spy = jest.spyOn(instance, 'setState');
      instance.handleCustomerGroupChange(event);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        currentCustomerGroup: event.target.value,
        customerGroupError: false,
      });
    });

    test('calls handleCheckOrderPrice', () => {
      const instance = getWrapper().instance();
      const spy = jest.spyOn(instance, 'handleCheckOrderPrice');
      instance.handleCustomerGroupChange(event);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        defaultProps.resource, defaultProps.selected,
        instance.state.mandatoryProducts, instance.state.extraProducts,
        false, event.target.value
      );
    });
  });

  describe('handlePaymentMethodChange', () => {
    const event = { target: { value: 'payment-method-test' } };

    test('calls setState', () => {
      const instance = getWrapper().instance();
      const spy = jest.spyOn(instance, 'setState');
      instance.handlePaymentMethodChange(event);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        currentPaymentMethod: event.target.value,
      });
    });
  });

  describe('handleCheckOrderPrice', () => {
    describe('returns undefined and doesnt call checkOrderPrice', () => {
      afterEach(() => {
        checkOrderPrice.mockClear();
      });

      test('when resource has no products', () => {
        const instance = getWrapper().instance();
        const resourceA = Resource.build({ products: [] });
        expect(instance.handleCheckOrderPrice(
          resourceA, defaultProps.selected, [], []
        )).toBe(undefined);
        expect(checkOrderPrice).toHaveBeenCalledTimes(0);
      });

      test('when editing reservation', () => {
        const instance = getWrapper().instance();
        const resourceA = Resource.build({ products: [Product.build()] });
        const isEditing = true;
        expect(instance.handleCheckOrderPrice(
          resourceA, defaultProps.selected, [], [], isEditing
        )).toBe(undefined);
        expect(checkOrderPrice).toHaveBeenCalledTimes(0);
      });
    });

    describe('when resource has products', () => {
      const product = Product.build();
      const resourceA = Resource.build({ products: [product] });
      const mandatoryProducts = getInitialProducts(resourceA, constants.PRODUCT_TYPES.MANDATORY);
      const extraProducts = getInitialProducts(resourceA, constants.PRODUCT_TYPES.EXTRA);

      afterEach(() => {
        checkOrderPrice.mockClear();
      });

      test('checkOrderPrice is called', () => {
        const { selected } = defaultProps;
        const instance = getWrapper().instance();
        instance.handleCheckOrderPrice(
          resourceA, selected, mandatoryProducts, extraProducts
        );
        const begin = !isEmpty(selected) ? first(selected).begin : null;
        const end = !isEmpty(selected) ? last(selected).end : null;
        const orderLines = createOrderLines([...mandatoryProducts, ...extraProducts]);
        expect(checkOrderPrice).toHaveBeenCalledTimes(1);
        expect(checkOrderPrice).toHaveBeenCalledWith(
          begin, end, orderLines, {}, undefined
        );
      });

      test('calls setState', async () => {
        const { selected } = defaultProps;
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        await instance.handleCheckOrderPrice(
          resourceA, selected, mandatoryProducts, extraProducts
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ order: { id: 'test' } });
      });
    });
  });

  describe('HandleToggleMandatoryProducts', () => {
    const product = Product.build({ type: 'rent' });
    const resourceA = Resource.build({ products: [product] });
    const mandatoryProducts = getInitialProducts(resourceA, constants.PRODUCT_TYPES.MANDATORY);
    const extraProducts = getInitialProducts(resourceA, constants.PRODUCT_TYPES.EXTRA);

    test('sets correct state when skipMandatoryProducts is false', () => {
      const instance = getWrapper({ resource: resourceA }).instance();
      instance.state.mandatoryProducts = mandatoryProducts;
      instance.state.extraProducts = extraProducts;
      instance.state.skipMandatoryProducts = false;
      const spy = jest.spyOn(instance, 'setState');
      instance.HandleToggleMandatoryProducts();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(instance.state.mandatoryProducts).toStrictEqual([{ ...product, quantity: 0 }]);
      expect(instance.state.skipMandatoryProducts).toBe(true);
    });

    test('sets correct state when skipMandatoryProducts is true', () => {
      const instance = getWrapper({ resource: resourceA }).instance();
      instance.state.mandatoryProducts = [{ ...product, quantity: 0 }];
      instance.state.extraProducts = extraProducts;
      instance.state.skipMandatoryProducts = true;
      const spy = jest.spyOn(instance, 'setState');
      instance.HandleToggleMandatoryProducts();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(instance.state.mandatoryProducts).toStrictEqual([{ ...product, quantity: 1 }]);
      expect(instance.state.skipMandatoryProducts).toBe(false);
    });

    test('calls handleCheckOrderPrice', () => {
      const instance = getWrapper({ resource: resourceA }).instance();
      const spy = jest.spyOn(instance, 'handleCheckOrderPrice');
      const customerGroupId = 'cg-id-1';
      instance.state.currentCustomerGroup = customerGroupId;
      instance.state.mandatoryProducts = mandatoryProducts;
      instance.state.extraProducts = extraProducts;
      instance.HandleToggleMandatoryProducts();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        resourceA, defaultProps.selected, instance.state.mandatoryProducts,
        instance.state.extraProducts, false, customerGroupId
      );
    });
  });

  describe('handleChangeProductQuantity', () => {
    test('returns undefined when props.resource has no products', () => {
      const resourceA = Resource.build({ products: [] });
      const instance = getWrapper({ resource: resourceA }).instance();
      expect(instance.handleChangeProductQuantity()).toBe(undefined);
    });

    describe('when props.resource has products', () => {
      const extraProduct = Product.build({ type: constants.PRODUCT_TYPES.EXTRA });
      const mandatoryProduct = Product.build({ type: 'rent' });
      const resourceA = Resource.build({ products: [mandatoryProduct, extraProduct] });

      describe('when given type is mandatory', () => {
        const type = constants.PRODUCT_TYPES.MANDATORY;
        test('calls setState', () => {
          const instance = getWrapper({ resource: resourceA }).instance();
          const spy = jest.spyOn(instance, 'setState');
          instance.handleChangeProductQuantity(mandatoryProduct, 2, type);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(
            { mandatoryProducts: [{ ...mandatoryProduct, quantity: 2 }] }
          );
        });

        test('calls handleCheckOrderPrice', () => {
          const instance = getWrapper({ resource: resourceA }).instance();
          const spy = jest.spyOn(instance, 'handleCheckOrderPrice');
          instance.handleChangeProductQuantity(mandatoryProduct, 2, type);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(
            resourceA, defaultProps.selected,
            instance.state.mandatoryProducts, instance.state.extraProducts,
            false, instance.state.currentCustomerGroup
          );
        });
      });

      describe('when given type is extra', () => {
        const type = constants.PRODUCT_TYPES.EXTRA;
        test('calls setState', () => {
          const instance = getWrapper({ resource: resourceA }).instance();
          const spy = jest.spyOn(instance, 'setState');
          instance.handleChangeProductQuantity(extraProduct, 5, type);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(
            { extraProducts: [{ ...extraProduct, quantity: 5 }] }
          );
        });

        test('calls handleCheckOrderPrice', () => {
          const instance = getWrapper({ resource: resourceA }).instance();
          const spy = jest.spyOn(instance, 'handleCheckOrderPrice');
          instance.handleChangeProductQuantity(extraProduct, 4, type);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(
            resourceA, defaultProps.selected,
            instance.state.mandatoryProducts, instance.state.extraProducts,
            false, instance.state.currentCustomerGroup
          );
        });
      });
    });
  });
});
