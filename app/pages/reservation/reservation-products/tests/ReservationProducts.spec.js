import React from 'react';
import Immutable from 'seamless-immutable';
import { Button, Col } from 'react-bootstrap';
import Loader from 'react-loader';
import { isEmpty } from 'lodash';

import { shallowWithIntl } from 'utils/testUtils';
import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import ReservationProducts from '../ReservationProducts';
import MandatoryProducts from '../mandatory-products/MandatoryProducts';
import ExtraProducts from '../extra-products/ExtraProducts';
import ProductsSummary from '../ProductsSummary';
import ReservationDetails from '../../reservation-details/ReservationDetails';
import CustomerGroupSelect from '../CustomerGroupSelect';
import ProductCustomerGroup from 'utils/fixtures/ProductCustomerGroup';
import CustomerGroup from 'utils/fixtures/CustomerGroup';
import ProductsValidationErrors from '../ProductsValidationErrors';
import PaymentMethodSelect from '../PaymentMethodSelect';
import constants from '../../../../constants/AppConstants';

describe('reservation-products/ProductsSummary', () => {
  const resource = Immutable(Resource.build());
  const rentProduct = Product.build({
    type: 'rent',
    price: {
      type: 'fixed', tax_percentage: '24.00', amount: '8.00'
    }
  });
  const extraProductOne = Product.build({
    type: 'extra',
    price: {
      type: 'fixed', tax_percentage: '20.00', amount: '15.00'
    },
    max_quantity: 10,
  });
  const extraProductTwo = Product.build({
    type: 'extra',
    price: {
      type: 'fixed', tax_percentage: '0.00', amount: '55.00'
    },
    max_quantity: 1,
  });
  const orderLines = [
    OrderLine.build({ product: rentProduct, quantity: 1, price: 8.00 }),
    OrderLine.build({ product: extraProductOne, quantity: 3, price: 45.00 }),
    OrderLine.build({ product: extraProductTwo, quantity: 1, price: 55.00 }),
  ];
  const defaultProps = {
    changeProductQuantity: () => {},
    currentCustomerGroup: '',
    currentPaymentMethod: constants.PAYMENT_METHODS.ONLINE,
    currentLanguage: 'fi',
    customerGroupError: false,
    isEditing: false,
    isStaff: false,
    onBack: () => {},
    onCancel: () => {},
    onConfirm: () => {},
    onCustomerGroupChange: () => {},
    onPaymentMethodChange: () => {},
    onStaffSkipChange: () => {},
    order: {
      begin: '2021-09-24T11:00:00+03:00',
      end: '2021-09-24T11:30:00+03:00',
      order_lines: orderLines,
      price: '5.00'
    },
    resource,
    selectedTime: {
      begin: '2021-09-24T07:00:00.000Z',
      end: '2021-09-24T07:30:00.000Z',
    },
    skipMandatoryProducts: false,
    unit: Unit.build()
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationProducts {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const div = getWrapper().find('div.app-ReservationProducts');
      expect(div).toHaveLength(1);
    });

    test('heading', () => {
      const heading = getWrapper().find('h2#reservation-products-page-heading');
      expect(heading).toHaveLength(1);
      expect(heading.prop('className')).toBe('visually-hidden');
      expect(heading.text()).toBe('ReservationPhase.productsTitle');
    });

    const productsSection = getWrapper().find('#reservation-products-page-main-row');
    test('products main Row', () => {
      expect(productsSection).toHaveLength(1);
    });

    const cols = productsSection.find(Col);
    test('correct amount of Cols', () => {
      expect(cols).toHaveLength(2);
    });

    test('products section first Col', () => {
      const col = cols.at(0);
      expect(col).toHaveLength(1);
      expect(col.prop('lg')).toBe(8);
      expect(col.prop('sm')).toBe(12);
    });

    describe('when order has an error', () => {
      test('error message', () => {
        const message = getWrapper({ order: { error: true } }).find('#products-error-message');
        expect(message).toHaveLength(1);
        expect(message.text()).toBe('Notifications.errorMessage');
      });
    });

    describe('when order has no error', () => {
      test('Loader', () => {
        const loader = getWrapper().find(Loader);
        expect(loader).toHaveLength(1);
        expect(loader.prop('loaded')).toBe(!defaultProps.order.loadingData);
      });

      describe('CustomerGroupSelect', () => {
        test('when there are no unique customer groups in resource products', () => {
          const select = getWrapper().find(CustomerGroupSelect);
          expect(select).toHaveLength(0);
        });

        test('when there are unique customer groups in resource products', () => {
          const customerGroupA = CustomerGroup.build();
          const customerGroupB = CustomerGroup.build();
          const pcgA = ProductCustomerGroup.build({ customerGroup: customerGroupA });
          const pcgB = ProductCustomerGroup.build({ customerGroup: customerGroupB });
          const productA = Product.build({ productCustomerGroups: [pcgA, pcgB] });
          const resourceA = Resource.build({ products: [productA] });
          const select = getWrapper({ resource: resourceA }).find(CustomerGroupSelect);
          expect(select).toHaveLength(1);
          expect(select.prop('currentlySelectedGroup')).toBe(defaultProps.currentCustomerGroup);
          expect(select.prop('customerGroups')).toStrictEqual([customerGroupA, customerGroupB]);
          expect(select.prop('hasError')).toBe(defaultProps.customerGroupError);
          expect(select.prop('isRequired')).toBe(true);
          expect(select.prop('onChange')).toBe(defaultProps.onCustomerGroupChange);
        });
      });

      test('MandatoryProducts', () => {
        const mandatoryProducts = getWrapper().find(MandatoryProducts);
        expect(mandatoryProducts).toHaveLength(1);
        expect(mandatoryProducts.prop('currentCustomerGroup')).toBe(defaultProps.currentCustomerGroup);
        expect(mandatoryProducts.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
        expect(mandatoryProducts.prop('isStaff')).toBe(defaultProps.isStaff);
        expect(mandatoryProducts.prop('onStaffSkipChange')).toBe(defaultProps.onStaffSkipChange);
        expect(mandatoryProducts.prop('orderLines')).toEqual([orderLines[0]]);
        expect(mandatoryProducts.prop('skipProducts')).toBe(defaultProps.skipMandatoryProducts);
      });

      test('ExtraProducts', () => {
        const extraProducts = getWrapper().find(ExtraProducts);
        expect(extraProducts).toHaveLength(1);
        expect(extraProducts.prop('changeProductQuantity')).toBe(defaultProps.changeProductQuantity);
        expect(extraProducts.prop('currentCustomerGroup')).toBe(defaultProps.currentCustomerGroup);
        expect(extraProducts.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
        expect(extraProducts.prop('orderLines')).toEqual([orderLines[1], orderLines[2]]);
      });

      test('ProductsSummary', () => {
        const productsSummary = getWrapper().find(ProductsSummary);
        expect(productsSummary).toHaveLength(1);
        expect(productsSummary.prop('order')).toBe(defaultProps.order);
      });

      describe('PaymentMethodSelect', () => {
        test('when resource allows cash payments', () => {
          const resourceA = Resource.build();
          resourceA.cashPaymentsAllowed = true;
          const select = getWrapper({ resource: resourceA }).find(PaymentMethodSelect);
          expect(select).toHaveLength(1);
          expect(select.prop('currentPaymentMethod')).toBe(defaultProps.currentPaymentMethod);
          expect(select.prop('onPaymentMethodChange')).toBe(defaultProps.onPaymentMethodChange);
        });

        test('when resource does not allow cash payments', () => {
          const resourceA = Resource.build();
          resourceA.cashPaymentsAllowed = false;
          const select = getWrapper({ resource: resourceA }).find(PaymentMethodSelect);
          expect(select).toHaveLength(0);
        });
      });
    });

    describe('form controls', () => {
      test('wrapping div', () => {
        const formControls = getWrapper().find('div.form-controls');
        expect(formControls).toHaveLength(1);
      });

      describe('when editing reservation', () => {
        const formControls = getWrapper({ isEditing: true }).find('div.form-controls');
        const buttons = formControls.find(Button);
        test('correct amount of Buttons', () => {
          expect(buttons).toHaveLength(3);
        });

        test('first Button', () => {
          const button = buttons.at(0);
          expect(button.prop('bsStyle')).toBe('warning');
          expect(button.prop('onClick')).toBe(defaultProps.onCancel);
          expect(button.prop('children')).toBe('ReservationInformationForm.cancelEdit');
        });

        test('2nd Button', () => {
          const button = buttons.at(1);
          expect(button.prop('bsStyle')).toBe('default');
          expect(button.prop('onClick')).toBe(defaultProps.onBack);
          expect(button.prop('children')).toBe('common.previous');
        });

        test('3rd Button', () => {
          const button = buttons.at(2);
          expect(button.prop('bsStyle')).toBe('primary');
          expect(button.prop('className')).toBe('next_Button');
          expect(button.prop('disabled')).toBe(isEmpty(defaultProps.selectedTime) || !!defaultProps.order.error);
          expect(button.prop('onClick')).toBe(defaultProps.onConfirm);
          expect(button.prop('children')).toBe('common.continue');
        });
      });

      describe('when not editing reservation', () => {
        const formControls = getWrapper({ isEditing: false }).find('div.form-controls');
        const buttons = formControls.find(Button);
        test('correct amount of Buttons', () => {
          expect(buttons).toHaveLength(2);
        });

        test('first Button', () => {
          const button = buttons.at(0);
          expect(button.prop('bsStyle')).toBe('warning');
          expect(button.prop('onClick')).toBe(defaultProps.onCancel);
          expect(button.prop('children')).toBe('common.cancel');
        });

        test('2nd Button', () => {
          const button = buttons.at(1);
          expect(button.prop('bsStyle')).toBe('primary');
          expect(button.prop('className')).toBe('next_Button');
          expect(button.prop('disabled')).toBe(isEmpty(defaultProps.selectedTime) || !!defaultProps.order.error);
          expect(button.prop('onClick')).toBe(defaultProps.onConfirm);
          expect(button.prop('children')).toBe('common.continue');
        });
      });
    });

    describe('ProductsValidationErrors', () => {
      test('when customerGroupError is true', () => {
        const validationErrors = getWrapper({ customerGroupError: true })
          .find(ProductsValidationErrors);
        expect(validationErrors).toHaveLength(1);
        expect(validationErrors.prop('errorFields')).toStrictEqual(['ReservationProducts.select.clientGroup.label']);
      });

      test('when customerGroupError is false', () => {
        const validationErrors = getWrapper({ customerGroupError: false })
          .find(ProductsValidationErrors);
        expect(validationErrors).toHaveLength(1);
        expect(validationErrors.prop('errorFields')).toStrictEqual([]);
      });
    });

    test('reservation details', () => {
      const details = getWrapper().find(ReservationDetails);
      expect(details).toHaveLength(1);
      expect(details.prop('selectedTime')).toBe(defaultProps.selectedTime);
      expect(details.prop('resourceName')).toBe(defaultProps.resource.name);
      expect(details.prop('unitName')).toBe(defaultProps.unit.name);
    });
  });
});
