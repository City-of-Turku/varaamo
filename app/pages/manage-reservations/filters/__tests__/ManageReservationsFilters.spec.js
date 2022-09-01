import constants from 'constants/AppConstants';

import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { get } from 'lodash';

import { shallowWithIntl } from 'utils/testUtils';
import { UnwrappedManageReservationsFilters } from '../ManageReservationsFilters';
import Unit from 'utils/fixtures/Unit';
import ButtonGroupField from '../../inputs/ButtonGroupField';
import { getStatusOptions } from '../filterUtils';
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

    test('four Row elements', () => {
      const rows = getWrapper().find(Row);
      expect(rows).toHaveLength(4);
    });

    describe('first Row element', () => {
      const rows = getWrapper().find(Row);
      const firstRow = rows.first();

      test('Cols with correct props', () => {
        const cols = firstRow.find(Col);
        expect(cols).toHaveLength(1);
        expect(cols.at(0).prop('md')).toBe(12);
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
    });

    describe('second Row element', () => {
      const rows = getWrapper().find(Row);
      const secondRow = rows.at(1);

      test('Cols with correct props', () => {
        const cols = secondRow.find(Col);
        expect(cols).toHaveLength(2);
        expect(cols.at(0).prop('md')).toBe(7);
        expect(cols.at(1).prop('md')).toBe(5);
      });

      test('date picker wrapper div', () => {
        const div = secondRow.find('.app-ManageReservationsFilters__datePickers');
        expect(div).toHaveLength(1);
      });

      test('date picker separator div', () => {
        const div = secondRow.find('.separator');
        expect(div).toHaveLength(1);
      });

      describe('DateFields', () => {
        const dateFields = secondRow.find(DateField);
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
        const textField = secondRow.find(TextField);
        expect(textField).toHaveLength(1);
        expect(textField.prop('id')).toBe('searchField');
        expect(textField.prop('label')).toBe('ManageReservationsFilters.searchLabel');
        expect(textField.prop('onChange')).toBeDefined();
        expect(textField.prop('value')).toBe(get(defaultProps.filters, 'reserver_name', ''));
      });
    });

    describe('third Row element', () => {
      const rows = getWrapper().find(Row);
      const thirdRow = rows.at(2);

      test('Cols with correct props', () => {
        const cols = thirdRow.find(Col);
        expect(cols).toHaveLength(2);
        expect(cols.at(0).prop('md')).toBe(3);
        expect(cols.at(1).prop('md')).toBe(9);
      });

      test('TextField', () => {
        const textField = thirdRow.find(SelectField);
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

      test('favorites toggle', () => {
        const favoritesToggle = getWrapper().find('#favorite-toggle-field');
        expect(favoritesToggle).toHaveLength(1);
        expect(favoritesToggle.prop('label')).toBe('ManageReservationsFilters.favoritesLabel');
        expect(favoritesToggle.prop('onChange')).toBeDefined();
        expect(favoritesToggle.prop('value')).toBe(get(defaultProps.filters, 'is_favorite_resource', true) !== 'no');
      });

      test('can modify toggle', () => {
        const canModify = constants.RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY;
        const canModifyToggle = getWrapper().find('#can-modify-toggle-field');
        expect(canModifyToggle).toHaveLength(1);
        expect(canModifyToggle.prop('label')).toBe('ManageReservationsFilters.showOnly.canModifyLabel');
        expect(canModifyToggle.prop('onChange')).toBeDefined();
        expect(canModifyToggle.prop('value')).toBe(defaultProps.showOnlyFilters.includes(canModify));
      });
    });

    describe('last Row element', () => {
      const rows = getWrapper().find(Row);
      const lastRow = rows.last();

      test('Cols with correct props', () => {
        const cols = lastRow.find(Col);
        expect(cols).toHaveLength(1);
        expect(cols.at(0).prop('md')).toBe(12);
      });

      describe('reset filter button', () => {
        test('when there are no active filters', () => {
          const filters = { is_favorite_resource: 'no' };
          const showOnlyFilters = [];
          const resetButton = getWrapper({ filters, showOnlyFilters }).find('.app-ManageReservationsFilters__resetButton');
          expect(resetButton).toHaveLength(0);
        });

        describe('when there are filters', () => {
          const filters = { test: 'abc' };
          const showOnlyFilters = [constants.RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY];
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
