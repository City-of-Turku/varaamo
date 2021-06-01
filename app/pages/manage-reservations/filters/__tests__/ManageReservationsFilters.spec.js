import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { get } from 'lodash';

import { shallowWithIntl } from 'utils/testUtils';
import { UnwrappedManageReservationsFilters } from '../ManageReservationsFilters';
import Unit from 'utils/fixtures/Unit';
import ButtonGroupField from '../../inputs/ButtonGroupField';
import { getShowOnlyOptions, getStatusOptions } from '../filterUtils';
import DateField from '../../inputs/DateField';
import TextField from '../../inputs/TextField';
import SelectField from '../../inputs/SelectField';

describe('ManageReservationsFilters', () => {
  const defaultProps = {
    filters: {},
    units: [Unit.build()],
    onSearchChange: jest.fn(),
    onShowOnlyFiltersChange: jest.fn(),
    t: key => key,
    showOnlyFilters: [],
  };

  function getWrapper(props) {
    return shallowWithIntl(<UnwrappedManageReservationsFilters {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-ManageReservationsFilters');
      expect(wrapper).toHaveLength(1);
    });

    test('one Grid element', () => {
      const grid = getWrapper().find(Grid);
      expect(grid).toHaveLength(1);
    });

    test('two Row elements', () => {
      const rows = getWrapper().find(Row);
      expect(rows).toHaveLength(2);
    });

    describe('first Row element', () => {
      const rows = getWrapper().find(Row);
      const firstRow = rows.first();

      test('Cols with correct props', () => {
        const cols = firstRow.find(Col);
        expect(cols).toHaveLength(3);
        expect(cols.at(0).prop('md')).toBe(3);
        expect(cols.at(1).prop('md')).toBe(5);
        expect(cols.at(2).prop('md')).toBe(4);
      });

      test('ButtonGroupField', () => {
        const btnGroupField = firstRow.find(ButtonGroupField);
        expect(btnGroupField).toHaveLength(1);
        expect(btnGroupField.prop('id')).toBe('stateField');
        expect(btnGroupField.prop('label')).toBe('ManageReservationsFilters.statusLabel');
        expect(btnGroupField.prop('onChange')).toBeDefined();
        expect(btnGroupField.prop('options')).toStrictEqual(getStatusOptions(defaultProps.t));
        expect(btnGroupField.prop('type')).toBe('checkbox');
        expect(btnGroupField.prop('value')).toBe(null);
      });

      test('date picker wrapper div', () => {
        const div = firstRow.find('.app-ManageReservationsFilters__datePickers');
        expect(div).toHaveLength(1);
      });

      test('date picker separator div', () => {
        const div = firstRow.find('.separator');
        expect(div).toHaveLength(1);
      });

      describe('DateFields', () => {
        const dateFields = firstRow.find(DateField);
        test('start and end', () => {
          expect(dateFields).toHaveLength(2);
        });

        test('start with correct props', () => {
          const startField = dateFields.first();
          expect(startField.prop('id')).toBe('startDateField');
          expect(startField.prop('label')).toBe('ManageReservationsFilters.startDateLabel');
          expect(startField.prop('locale')).toBeDefined();
          expect(startField.prop('onChange')).toBeDefined();
          expect(startField.prop('placeholder')).toBe('common.select');
          expect(startField.prop('value')).toBe(null);
        });

        test('end with correct props', () => {
          const endField = dateFields.last();
          expect(endField.prop('id')).toBe('endDateField');
          expect(endField.prop('label')).toBe('ManageReservationsFilters.endDateLabel');
          expect(endField.prop('locale')).toBeDefined();
          expect(endField.prop('onChange')).toBeDefined();
          expect(endField.prop('placeholder')).toBe('common.select');
          expect(endField.prop('value')).toBe(null);
        });
      });

      test('TextField', () => {
        const textField = firstRow.find(TextField);
        expect(textField).toHaveLength(1);
        expect(textField.prop('id')).toBe('searchField');
        expect(textField.prop('label')).toBe('ManageReservationsFilters.searchLabel');
        expect(textField.prop('onChange')).toBeDefined();
        expect(textField.prop('value')).toBe(get(defaultProps.filters, 'reserver_name', ''));
      });
    });

    describe('last Row element', () => {
      const rows = getWrapper().find(Row);
      const lastRow = rows.last();

      test('Cols with correct props', () => {
        const cols = lastRow.find(Col);
        expect(cols).toHaveLength(3);
        expect(cols.at(0).prop('md')).toBe(3);
        expect(cols.at(1).prop('md')).toBe(5);
        expect(cols.at(2).prop('md')).toBe(4);
      });

      test('TextField', () => {
        const textField = lastRow.find(SelectField);
        const expectedOptions = defaultProps.units.map(unit => ({
          value: unit.id,
          label: unit.name,
        }));

        expect(textField).toHaveLength(1);
        expect(textField.prop('id')).toBe('unitField');
        expect(textField.prop('label')).toBe('ManageReservationsFilters.unitLabel');
        expect(textField.prop('onChange')).toBeDefined();
        expect(textField.prop('options')).toStrictEqual(expectedOptions);
        expect(textField.prop('value')).toBe(get(defaultProps.filters, 'unit', null));
      });

      test('ButtonGroupField', () => {
        const btnGroupField = lastRow.find(ButtonGroupField);
        expect(btnGroupField).toHaveLength(1);
        expect(btnGroupField.prop('id')).toBe('showOnlyField');
        expect(btnGroupField.prop('label')).toBe('ManageReservationsFilters.showOnly.title');
        expect(btnGroupField.prop('onChange')).toBeDefined();
        expect(btnGroupField.prop('options')).toStrictEqual(getShowOnlyOptions(defaultProps.t));
        expect(btnGroupField.prop('type')).toBe('checkbox');
        expect(btnGroupField.prop('value')).toBe(defaultProps.showOnlyFilters);
      });

      describe('reset filter button', () => {
        test('when there are no filters', () => {
          const filters = {};
          const showOnlyFilters = [];
          const resetButton = getWrapper({ filters, showOnlyFilters }).find('.app-ManageReservationsFilters__resetButton');
          expect(resetButton).toHaveLength(0);
        });

        describe('when there are filters', () => {
          const filters = { test: 'abc' };
          const showOnlyFilters = ['favorite'];
          const resetButton = getWrapper({ filters, showOnlyFilters }).find('.app-ManageReservationsFilters__resetButton');

          test('Button with correct props', () => {
            expect(resetButton).toHaveLength(1);
            expect(resetButton.prop('bsStyle')).toBe('link');
            expect(resetButton.prop('onClick')).toBeDefined();
          });

          test('img with correct props and text', () => {
            const img = resetButton.find('img');
            expect(img).toHaveLength(1);
            expect(img.prop('alt')).toBe('');
            expect(img.prop('src')).toBeDefined();
          });
        });
      });
    });
  });
});
