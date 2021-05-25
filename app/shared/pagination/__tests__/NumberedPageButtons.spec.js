import constants from 'constants/AppConstants';

import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';

import NumberedPageButtons from '../NumberedPageButtons';


describe('app/shared/pagination/NumberedPageButtons', () => {
  const defaultProps = {
    pages: 3,
    currentPage: 1,
    onChange: jest.fn(),
  };

  function getWrapper(extraProps) {
    return shallow(<NumberedPageButtons {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('buttons with correct props', () => {
      const pages = 2;
      const buttons = getWrapper({ pages }).find(Button);
      expect(buttons).toHaveLength(2);
      buttons.forEach((button, index) => {
        expect(button.prop('className')).toBe(classNames(
          'app-SearchPagination__page', `app-SearchPagination__page-${index + 1}`, {
            'app-SearchPagination__selected': index + 1 === defaultProps.currentPage,
          }
        ));
        expect(button.prop('onClick')).toBeDefined();
        expect(button.props().children).toBe(index + 1);
      });
    });

    describe('correct amount of buttons', () => {
      const maxCount = constants.MANAGE_RESERVATIONS.MAX_SHOWN_PAGINATION_BUTTONS;
      test('when under defined max count', () => {
        const pages = 2;
        const buttons = getWrapper({ pages }).find(Button);
        expect(buttons).toHaveLength(2);
      });

      test('when equal to defined max count', () => {
        const pages = maxCount;
        const buttons = getWrapper({ pages }).find(Button);
        expect(buttons).toHaveLength(pages);
      });

      test('when over defined max count', () => {
        const pages = maxCount + 2;
        const buttons = getWrapper({ pages }).find(Button);
        expect(buttons).toHaveLength(maxCount);
      });
    });
  });

  describe('button onClick', () => {
    beforeEach(() => { defaultProps.onChange.mockClear(); });
    afterEach(() => { defaultProps.onChange.mockClear(); });

    test('calls correct function with correct params', () => {
      const pages = 3;
      const buttons = getWrapper({ pages }).find(Button);
      buttons.forEach((button) => {
        button.simulate('click');
      });
      expect(defaultProps.onChange.mock.calls.length).toBe(3);
      expect(defaultProps.onChange.mock.calls[0][0]).toBe(1);
      expect(defaultProps.onChange.mock.calls[1][0]).toBe(2);
      expect(defaultProps.onChange.mock.calls[2][0]).toBe(3);
    });
  });
});
