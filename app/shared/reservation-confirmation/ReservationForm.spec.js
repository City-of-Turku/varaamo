import constants from 'constants/AppConstants';

import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import { Field } from 'redux-form';
import simple from 'simple-mock';

import WrappedText from 'shared/wrapped-text';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedReservationForm as ReservationForm, validate } from './ReservationForm';
import Resource from 'utils/fixtures/Resource';

describe('shared/reservation-confirmation/ReservationForm', () => {
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
      onCancel: simple.mock(),
      onConfirm: simple.mock(),
      requiredFields: [],
      resource: Resource.build(),
      termsAndConditions: '',
    };

    function getWrapper(extraProps) {
      return shallowWithIntl(<ReservationForm {...defaultProps} {...extraProps} />);
    }

    test('renders a Form component with correct props', () => {
      const handleSubmit = () => null;
      const form = getWrapper({ handleSubmit }).find(Form);
      expect(form.length).toBe(1);
      expect(form.prop('onSubmit')).toBeDefined();
    });

    describe('form fields', () => {
      const fieldName = 'reserverName';

      test('renders a field if it is included in props.fields', () => {
        const fields = [fieldName];
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
            fields: [fieldName],
            requiredFields: [fieldName],
          };
          const input = getWrapper(props).find(Field);
          expect(input.props().label).toContain('*');
        });

        test('does not display an asterisk beside a non required field label', () => {
          const props = {
            fields: [fieldName],
            requiredFields: [],
          };
          const input = getWrapper(props).find(Field);
          expect(input.props().label).not.toContain('*');
        });

        describe('if staffEvent checkbox is checked', () => {
          const staffEventSelected = true;

          test('shows an asterisk beside REQUIRED_STAFF_EVENT_FIELDS', () => {
            const fields = [fieldName];
            const props = {
              fields,
              requiredFields: [fieldName],
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

    describe('billing info', () => {
      const billingFields = [
        'billingFirstName',
        'billingLastName',
        'billingPhoneNumber',
        'billingEmailAddress',
        'billingAddressStreet',
        'billingAddressZip',
        'billingAddressCity'
      ];
      test('renders billing info Well when any of the billing fields are given in props', () => {
        billingFields.forEach((billingField) => {
          const fields = [billingField];
          const billingInfoWell = getWrapper({ fields }).find('#billing-info-well');
          expect(billingInfoWell).toHaveLength(1);
          const billingInfoHeading = billingInfoWell.find('p');
          expect(billingInfoHeading).toHaveLength(1);
          expect(billingInfoHeading.text()).toBe('common.billingAddressLabel');
        });
      });

      test('does not render billing info Well when none of the billing fields are given in props', () => {
        const fields = [];
        const billingInfoWell = getWrapper({ fields }).find('#billing-info-well');
        expect(billingInfoWell).toHaveLength(0);
      });
    });

    describe('terms and conditions', () => {
      describe('when terms and conditions are given in props', () => {
        const termsAndConditions = 'Some terms and conditions text';
        const wrapper = getWrapper({ termsAndConditions });
        const termsAndConditionsDiv = wrapper.find('.terms-and-conditions');

        test('renders a div for terms and conditions', () => {
          expect(termsAndConditionsDiv.length).toBe(1);
        });

        test('renders a header for terms and conditions', () => {
          const header = termsAndConditionsDiv.find('h5');

          expect(header.length).toBe(1);
          expect(header.text()).toBe('ReservationForm.termsAndConditionsHeader');
        });

        test(
          'renders the terms and conditions text inside WrappedText component',
          () => {
            const wrappedText = termsAndConditionsDiv.find(WrappedText);

            expect(wrappedText.length).toBe(1);
            expect(wrappedText.prop('text')).toBe(termsAndConditions);
            expect(wrappedText.prop('allowNamedLinks')).toBeDefined();
            expect(wrappedText.prop('openLinksInNewTab')).toBeDefined();
          }
        );

        test('renders terms and conditions input wrapper', () => {
          const inputWrapper = wrapper.find('.terms-and-conditions-input-wrapper');

          expect(inputWrapper.length).toBe(1);
        });
      });

      describe('when terms and conditions are not given in props', () => {
        const termsAndConditions = '';
        const wrapper = getWrapper({ termsAndConditions });

        test('does not render a div for terms and conditions', () => {
          const termsAndConditionsDiv = wrapper.find('.terms-and-conditions');

          expect(termsAndConditionsDiv.length).toBe(0);
        });

        test('does not render terms and conditions input wrapper', () => {
          const inputWrapper = wrapper.find('.terms-and-conditions-input-wrapper');

          expect(inputWrapper.length).toBe(0);
        });
      });
    });

    describe('form buttons', () => {
      const buttons = getWrapper().find(Button);

      test('renders two buttons', () => {
        expect(buttons.length).toBe(2);
      });

      describe('the first button', () => {
        const button = buttons.at(0);

        test('has correct text', () => {
          expect(button.props().children).toBe('common.back');
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
          expect(button.props().children).toBe('common.save');
        });
      });
    });
  });
});
