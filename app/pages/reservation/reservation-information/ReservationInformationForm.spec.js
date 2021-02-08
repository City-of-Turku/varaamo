import constants from 'constants/AppConstants';

import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import { Field } from 'redux-form';
import simple from 'simple-mock';

import TermsField from 'shared/form-fields/TermsField';
import { shallowWithIntl } from 'utils/testUtils';
import Resource from 'utils/fixtures/Resource';
import {
  UnconnectedReservationInformationForm as ReservationInformationForm,
  validate,
} from './ReservationInformationForm';
import ReservationSubmitButton from './ReservationSubmitButton';
import { hasProducts } from '../../../utils/reservationUtils';

describe('pages/reservation/reservation-information/ReservationInformationForm', () => {
  describe('validation', () => {
    const t = id => id;

    describe('if field value is missing', () => {
      describe('if user is reserving an staff event', () => {
        const values = { staffEvent: true };

        describe('if field belongs to REQUIRED_STAFF_EVENT_FIELDS', () => {
          const fieldName = constants.REQUIRED_STAFF_EVENT_FIELDS[0];

          test('returns an error', () => {
            const props = {
              fields: [fieldName],
              requiredFields: [],
              t,
            };
            const errors = validate(values, props);
            expect(errors[fieldName]).toBeDefined();
          });
        });

        describe('if field does not belong to REQUIRED_STAFF_EVENT_FIELDS', () => {
          const fieldName = 'someField';

          test('does not return an error', () => {
            const props = {
              fields: [fieldName],
              requiredFields: [],
              t,
            };
            const errors = validate(values, props);
            expect(errors[fieldName]).toBeFalsy();
          });
        });
      });

      describe('if user is reserving a regular event', () => {
        const values = {};

        test('returns an error if field is in requiredFields', () => {
          const fieldName = 'someField';
          const props = {
            fields: [fieldName],
            requiredFields: [fieldName],
            t,
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).toBeDefined();
        });

        test('returns correct error if field is termsAndConditions and required', () => {
          const fieldName = 'termsAndConditions';
          const props = {
            fields: [fieldName],
            requiredFields: [fieldName],
            t,
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).toBe('ReservationForm.termsAndConditionsError');
        });

        test('returns correct error if field is paymentTermsAndConditions and required', () => {
          const fieldName = 'paymentTermsAndConditions';
          const props = {
            fields: [fieldName],
            requiredFields: [fieldName],
            t,
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).toBe('ReservationForm.paymentTermsAndConditionsError');
        });

        test('does not return an error if field is not in requiredFields', () => {
          const fieldName = 'someField';
          const props = {
            fields: [fieldName],
            requiredFields: [],
            t,
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).toBeFalsy();
        });
      });
    });

    describe('if field has a value', () => {
      test('does not return an error even if field is required', () => {
        const props = {
          fields: ['name'],
          requiredFields: ['name'],
          t,
        };
        const values = { name: 'Luke' };
        const errors = validate(values, props);
        expect(errors.name).toBeFalsy();
      });

      test('returns an error if value is string and contains only white space', () => {
        const props = {
          fields: ['name'],
          requiredFields: ['name'],
          t,
        };
        const values = { name: '' };
        const errors = validate(values, props);
        expect(errors.name).toBeDefined();
      });
    });

    describe('reserverEmailAddress', () => {
      const props = {
        fields: ['reserverEmailAddress'],
        requiredFields: [],
        t,
      };

      test('returns an error if reserverEmailAddress is invalid', () => {
        const values = { reserverEmailAddress: 'luke@' };
        const errors = validate(values, props);
        expect(errors.reserverEmailAddress).toBeDefined();
      });

      test('does not return an error if reserverEmailAddress is valid', () => {
        const values = { reserverEmailAddress: 'luke@skywalker.com' };
        const errors = validate(values, props);
        expect(errors.reserverEmailAddress).toBeFalsy();
      });
    });

    describe('reserverPhoneNumber', () => {
      const props = {
        fields: ['reserverPhoneNumber'],
        requiredFields: [],
        t,
      };

      test('returns an error if reserverPhoneNumber is invalid', () => {
        const values = { reserverPhoneNumber: '+358-401-23123' };
        const errors = validate(values, props);
        expect(errors.reserverPhoneNumber).toBeDefined();
      });

      test('does not return an error if reserverPhoneNumber is valid', () => {
        const values = { reserverPhoneNumber: '+35840123123' };
        const errors = validate(values, props);
        expect(errors.reserverPhoneNumber).toBeFalsy();
      });
    });

    describe('numberOfParticipants', () => {
      const props = {
        fields: ['numberOfParticipants'],
        requiredFields: [],
        t,
        resource: Resource.build({
          peopleCapacity: 10,
        }),
      };

      test('returns an error if number of participants is too high', () => {
        const values = { numberOfParticipants: '11' };
        const errors = validate(values, props);
        expect(errors.numberOfParticipants).toBeDefined();
      });

      test('returns an error if number of participants is a negative number', () => {
        const values = { numberOfParticipants: '-1' };
        const errors = validate(values, props);
        expect(errors.numberOfParticipants).toBeDefined();
      });

      test('returns an error if number of participants is using a decimal', () => {
        const values = { numberOfParticipants: '1,5' };
        const errors = validate(values, props);
        expect(errors.numberOfParticipants).toBeDefined();
      });

      test('does not return an error if number of participants is valid', () => {
        const values = { numberOfParticipants: '1' };
        const errors = validate(values, props);
        expect(errors.numberOfParticipants).toBeFalsy();
      });
    });
  });

  describe('rendering', () => {
    const defaultProps = {
      fields: [],
      handleSubmit: simple.mock(),
      isEditing: false,
      isMakingReservations: false,
      onBack: simple.mock(),
      onCancel: simple.mock(),
      onConfirm: simple.mock(),
      openResourcePaymentTermsModal: simple.mock(),
      openResourceTermsModal: simple.mock(),
      requiredFields: [],
      resource: Resource.build(),
      paymentTermsAndConditions: '',
      termsAndConditions: '',
    };

    function getWrapper(extraProps) {
      return shallowWithIntl(<ReservationInformationForm {...defaultProps} {...extraProps} />);
    }

    test('renders a Form component with correct props', () => {
      const handleSubmit = () => null;
      const form = getWrapper({ handleSubmit }).find(Form);
      expect(form.length).toBe(1);
      expect(form.prop('onSubmit')).toBeDefined();
    });

    describe('form fields', () => {
      const reserverNameField = 'reserverName';
      const eventSubjectField = 'eventSubject';

      test('renders Reservation Information Form title', () => {
        const fields = [reserverNameField];
        const header = getWrapper({ fields }).find('.reservationers-Info');
        expect(header).toHaveLength(1);
        expect(header.text()).toBe('ReservationInformationForm.reserverInformationTitle');
      });

      test('renders Reservation Information Form when field is selected', () => {
        const fields = [eventSubjectField];
        const header = getWrapper({ fields }).find('.ReservationInformationForm');
        expect(header).toHaveLength(1);
        expect(header.text()).toBe('ReservationInformationForm.eventInformationTitle');
      });

      test('Does not render Reservation Information Form if not field selected', () => {
        const fields = [];
        const header = getWrapper({ fields }).find('.ReservationInformationForm');
        expect(header).toHaveLength(0);
      });

      test('renders a field if it is included in props.fields', () => {
        const fields = [reserverNameField];
        const input = getWrapper({ fields }).find(Field);
        expect(input.length).toBe(1);
      });

      test('does not render a field if it is not included in props.fields', () => {
        const fields = [];
        const input = getWrapper({ fields }).find(Field);
        expect(input.length).toBe(0);
      });

      describe('required fields', () => {
        test('displays an asterisk beside a required field label', () => {
          const props = {
            fields: [reserverNameField],
            requiredFields: [reserverNameField],
          };
          const input = getWrapper(props).find(Field);
          expect(input.props().label).toContain('*');
        });

        test('does not display an asterisk beside a non required field label', () => {
          const props = {
            fields: [reserverNameField],
            requiredFields: [],
          };
          const input = getWrapper(props).find(Field);
          expect(input.props().label).not.toContain('*');
        });

        describe('if staffEvent checkbox is checked', () => {
          const staffEventSelected = true;

          test('shows an asterisk beside REQUIRED_STAFF_EVENT_FIELDS', () => {
            const fields = [reserverNameField];
            const props = {
              fields,
              requiredFields: [reserverNameField],
              staffEventSelected,
            };
            const input = getWrapper(props).find(Field);
            expect(input.props().label).toContain('*');
          });

          test(
            'does not show an asterisk beside non REQUIRED_STAFF_EVENT_FIELDS',
            () => {
              const nonRequiredFieldName = 'reserverEmailAddress';
              const fields = [nonRequiredFieldName];
              const props = {
                fields,
                requiredFields: [nonRequiredFieldName],
                staffEventSelected,
              };
              const input = getWrapper(props).find(Field);
              expect(input.props().label).not.toContain('*');
            }
          );
        });
      });
    });

    describe('Additional info', () => {
      describe('if extra questions is included in props', () => {
        const resource = { reservationAdditionalInformation: 'info string' };
        const fields = ['reservationExtraQuestions'];
        const props = { resource, fields };
        const wrapper = getWrapper(props);

        test('renders additional info heading', () => {
          const heading = wrapper.find('#additional-info-heading');
          expect(heading.length).toBe(1);
          expect(heading.text()).toBe('common.additionalInfo.heading');
        });

        test('renders additional info WrappedText with correct props', () => {
          const wrappedText = wrapper.find('#additional-info-paragraph');
          expect(wrappedText.length).toBe(1);
          expect(wrappedText.prop('text')).toBe(resource.reservationAdditionalInformation);
          expect(wrappedText.prop('allowNamedLinks')).toBeDefined();
          expect(wrappedText.prop('openLinksInNewTab')).toBeDefined();
        });
      });

      describe('if extra questions is not included in props', () => {
        test('does not render additional info heading', () => {
          const heading = getWrapper().find('#additional-info-heading');
          expect(heading.length).toBe(0);
        });
        test('does not render additional info WrappedText', () => {
          const wrappedText = getWrapper().find('#additional-info-paragraph');
          expect(wrappedText.length).toBe(0);
        });
      });
    });

    describe('terms and conditions', () => {
      describe('when terms and conditions are given in props', () => {
        test('renders terms and conditions input wrapper', () => {
          const termsAndConditions = 'Some terms and conditions text';
          const wrapper = getWrapper({ termsAndConditions });
          const field = wrapper.find(Field).filter({ component: TermsField });

          expect(field.length).toBe(1);
          expect(field.prop('label')).toBe('ReservationInformationForm.termsAndConditionsLabel');
          expect(field.prop('labelLink')).toBe('ReservationInformationForm.termsAndConditionsLink');
          expect(field.prop('name')).toBe('termsAndConditions');
          expect(field.prop('onClick')).toBe(defaultProps.openResourceTermsModal);
        });
      });

      describe('when terms and conditions are not given in props', () => {
        test('does not render terms and conditions input wrapper', () => {
          const termsAndConditions = '';
          const wrapper = getWrapper({ termsAndConditions });
          const field = wrapper.find(Field).filter({ component: TermsField });

          expect(field.length).toBe(0);
        });
      });
    });

    describe('payment terms', () => {
      describe('when payment terms are given in props', () => {
        test('renders payment terms input wrapper', () => {
          const paymentTermsAndConditions = 'Some payment terms text';
          const wrapper = getWrapper({ paymentTermsAndConditions });
          const field = wrapper.find(Field).filter({ component: TermsField });

          expect(field.length).toBe(1);
          expect(field.prop('label')).toBe('ReservationInformationForm.termsAndConditionsLabel');
          expect(field.prop('labelLink')).toBe('ReservationInformationForm.paymentTermsAndConditionsLink');
          expect(field.prop('name')).toBe('paymentTermsAndConditions');
          expect(field.prop('onClick')).toBe(defaultProps.openResourcePaymentTermsModal);
        });
      });

      describe('when payment terms are not given in props', () => {
        test('does not render payment terms input wrapper', () => {
          const paymentTermsAndConditions = '';
          const wrapper = getWrapper({ paymentTermsAndConditions });
          const field = wrapper.find(Field).filter({ component: TermsField });

          expect(field.length).toBe(0);
        });
      });
    });

    describe('form buttons', () => {
      describe('when is editing is false', () => {
        const button = getWrapper({ isEditing: false }).find(Button);
        describe('renders a Button', () => {
          test('with correct props', () => {
            expect(button).toHaveLength(1);
            expect(button.prop('bsStyle')).toBe('warning');
            expect(button.props().children).toBe('common.cancel');
          });

          test('clicking it calls props.onCancel', () => {
            defaultProps.onCancel.reset();
            button.props().onClick();

            expect(defaultProps.onCancel.callCount).toBe(1);
          });
        });

        test('renders ReservationSubmitButton with correct props', () => {
          const submitButton = getWrapper().find(ReservationSubmitButton);
          expect(submitButton).toHaveLength(1);
          expect(submitButton.prop('handleSubmit')).toBe(defaultProps.handleSubmit);
          expect(submitButton.prop('hasPayment')).toBe(hasProducts(defaultProps.resource));
          expect(submitButton.prop('isMakingReservations')).toBe(defaultProps.isMakingReservations);
          expect(submitButton.prop('onConfirm')).toBe(defaultProps.onConfirm);
        });
      });

      describe('when is editing is true', () => {
        const buttons = getWrapper({ isEditing: true }).find(Button);
        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });

        describe('the first button', () => {
          const button = buttons.at(0);

          test('has correct text', () => {
            expect(button.props().children).toBe('ReservationInformationForm.cancelEdit');
          });

          test('clicking it calls props.onCancel', () => {
            defaultProps.onCancel.reset();
            button.props().onClick();

            expect(defaultProps.onCancel.callCount).toBe(1);
          });
        });

        describe('the second button', () => {
          const button = buttons.at(1);

          test('has correct text', () => {
            expect(button.props().children).toBe('common.previous');
          });

          test('clicking it calls props.onBack', () => {
            defaultProps.onBack.reset();
            button.props().onClick();

            expect(defaultProps.onBack.callCount).toBe(1);
          });
        });

        test('renders ReservationSubmitButton with correct props', () => {
          const submitButton = getWrapper({ isEditing: true }).find(ReservationSubmitButton);
          expect(submitButton).toHaveLength(1);
          expect(submitButton.prop('handleSubmit')).toBe(defaultProps.handleSubmit);
          expect(submitButton.prop('hasPayment')).toBe(hasProducts(defaultProps.resource));
          expect(submitButton.prop('isMakingReservations')).toBe(defaultProps.isMakingReservations);
          expect(submitButton.prop('onConfirm')).toBe(defaultProps.onConfirm);
        });
      });
    });
  });
});
