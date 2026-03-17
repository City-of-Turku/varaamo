import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import InfoPopover from 'shared/info-popover';
import SelectField from './SelectField';
import { shallowWithIntl } from 'utils/testUtils';

describe('shared/form-fields/SelectField', () => {
  const options = [
    { id: 'option-1-id', name: 'option-1-name-fi' },
    { id: 'option-2-id', name: 'option-2-name-fi' },
    { id: 'option-3-id', name: 'option-3-name-fi' },
  ];

  const defaultProps = {
    controlProps: { someprop: 'some', otherprop: 'other', options },
    fieldName: 'home-municipality-name',
    id: 'home-municipality-id',
    label: 'Home municipality',
    labelErrorPrefix: 'Error: ',
    validationState: 'error',
  };

  function getWrapper(props) {
    return (shallowWithIntl(<SelectField {...defaultProps} {...props} />));
  }

  describe('FormGroup component', () => {
    test('is rendered', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup.length).toBe(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(FormGroup).props();
      expect(actualProps.controlId).toBe(defaultProps.id);
      expect(actualProps.validationState).toBe(defaultProps.validationState);
    });
  });

  describe('Col components', () => {
    test('renders 2 Col components', () => {
      const cols = getWrapper().find(Col);
      expect(cols.length).toBe(2);
    });

    describe('the first Col', () => {
      function getColWrapper(props) {
        return getWrapper(props).find(Col).at(0);
      }

      test('gets correct props', () => {
        expect(getColWrapper().props().componentClass).toBe(ControlLabel);
        expect(getColWrapper().props().sm).toBe(3);
      });

      test('contains the label text given in props', () => {
        expect(
          getColWrapper().props().children
        ).toEqual(expect.arrayContaining([defaultProps.label]));
      });

      describe('labelErrorPrefix text', () => {
        test('is included in label text when field has an error', () => {
          expect(
            getColWrapper().props().children
          ).toEqual(expect.arrayContaining([defaultProps.labelErrorPrefix]));
        });

        test('is not included in label text when field doesnt have an error', () => {
          expect(
            getColWrapper({ validationState: undefined }).props().children
          ).toEqual(expect.not.arrayContaining([defaultProps.labelErrorPrefix]));
        });
      });

      test('does not contain InfoPopover if info not given', () => {
        const popover = getColWrapper().find(InfoPopover);
        expect(popover).toHaveLength(0);
      });

      test('contains InfoPopover if info is given', () => {
        const info = 'Some info';
        const popover = getColWrapper({ info }).find(InfoPopover);
        expect(popover).toHaveLength(1);
        expect(popover.prop('text')).toBe(info);
      });
    });

    describe('the second Col', () => {
      let col;

      beforeAll(() => {
        col = getWrapper().find(Col).at(1);
      });

      test('gets correct props', () => {
        expect(col.props().sm).toBe(9);
      });
    });
  });

  describe('select element', () => {
    test('is rendered', () => {
      const selectElement = getWrapper().find('select');
      expect(selectElement.length).toBe(1);
      expect(selectElement.prop('name')).toEqual(defaultProps.fieldName);
      expect(selectElement.prop('className')).toEqual('select-input');
      expect(selectElement.prop('id')).toEqual(defaultProps.id);
    });

    describe('when input error has occurred', () => {
      test('gets correct aria props', () => {
        const selectElement = getWrapper({ validationState: 'error' }).find('select');
        expect(selectElement.length).toBe(1);
        expect(selectElement.prop('aria-invalid')).toBe('true');
        expect(selectElement.prop('aria-describedby')).toEqual(`${defaultProps.id}-help-block`);
      });
    });

    describe('when input error has not occurred', () => {
      test('gets correct aria props', () => {
        const selectElement = getWrapper({ validationState: undefined }).find('select');
        expect(selectElement.length).toBe(1);
        expect(selectElement.prop('aria-invalid')).toBe('false');
        expect(selectElement.prop('aria-describedby')).toEqual(`${defaultProps.id}-help-block`);
      });
    });
  });

  describe('HelpBlock component', () => {
    const help = 'some help';

    test('is rendered', () => {
      const helpBlock = getWrapper({ help }).find(HelpBlock);
      expect(helpBlock.length).toBe(1);
      expect(helpBlock.prop('id')).toEqual(`${defaultProps.id}-help-block`);
    });

    test('displays the help text given in props', () => {
      const helpBlock = getWrapper({ help }).find(HelpBlock);
      expect(helpBlock.props().children).toBe(help);
    });
  });
  describe('Additional Universal fields', () => {
    let universalFieldData;
    beforeEach(() => {
      universalFieldData = {
        data: null,
        description: 'This is the description text of a universal field.'
      };
    });
    test('description p element is rendered if it exists', () => {
      const wrapper = getWrapper({ universalFieldData });
      const element = wrapper.find('p');
      expect(element).toHaveLength(1);
      expect(element.prop('className')).toBe('preserve-rows');
      expect(element.text()).toBe(universalFieldData.description);
    });
    test('an img element is rendered if data & data.url exists', () => {
      universalFieldData.data = {
        url: 'url to an image that is rendered',
      };
      const wrapper = getWrapper({ universalFieldData });
      const element = wrapper.find('img');
      expect(element).toHaveLength(1);
      expect(element.prop('alt')).toBe('ReservationForm.universalField.pictureAlt');
      expect(element.prop('className')).toBe('universal-data-image');
      expect(element.prop('src')).toBe(universalFieldData.data.url);
    });
    test('an iframe is rendered if data & data.iframe exist', () => {
      universalFieldData.data = {
        iframe: '<iframe title="example iframe" src="www.google.com"></iframe>'
      };
      const wrapper = getWrapper({ universalFieldData });
      const element = wrapper.html();
      // expect(element.html()).toBe('www.google.com');
      expect(element).toContain(universalFieldData.data.iframe);
    });
    test('two skip-link anchor elements are rendered if an iframe is rendered', () => {
      universalFieldData.data = {
        iframe: '<iframe title="example iframe" src="www.google.com"></iframe>'
      };
      const wrapper = getWrapper({ universalFieldData });
      // expect(wrapper.find('iframe')).toHaveLength(1);
      const anchors = wrapper.find('a');
      expect(anchors).toHaveLength(2);
      expect(anchors.at(0).prop('id')).toBe('skip-start');
      // eslint-disable-next-line no-script-url
      expect(anchors.at(0).prop('href')).toBe("javascript:document.getElementById('skip-end').focus()");
      expect(anchors.at(0).prop('className')).toBe('visually-hidden');
    });
  });
});
