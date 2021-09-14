import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import NumberedPageButtons from '../NumberedPageButtons';
import Pagination from '../Pagination';


describe('ManageReservationsFilters', () => {
  const defaultProps = {
    pages: 3,
    currentPage: 1,
    onChange: jest.fn(),
  };

  function getWrapper(props) {
    return shallowWithIntl(<Pagination {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-SearchPagination');
      expect(wrapper).toHaveLength(1);
    });

    test('previous button', () => {
      const prevButton = getWrapper().find('.app-SearchPagination__prev');
      expect(prevButton).toHaveLength(1);
      expect(prevButton.prop('disabled')).toBe(defaultProps.currentPage === 1);
      expect(prevButton.prop('onClick')).toBeDefined();
      expect(prevButton.props().children).toBe('common.previous');
    });

    test('next button', () => {
      const prevButton = getWrapper().find('.app-SearchPagination__next');
      expect(prevButton).toHaveLength(1);
      expect(prevButton.prop('disabled')).toBe(defaultProps.currentPage >= defaultProps.pages);
      expect(prevButton.prop('onClick')).toBeDefined();
      expect(prevButton.props().children).toBe('common.next');
    });

    describe('NumberedPageButtons', () => {
      test('when pages is 0', () => {
        const pages = 0;
        const numButtons = getWrapper({ pages }).find(NumberedPageButtons);
        expect(numButtons).toHaveLength(0);
      });

      test('when pages is more than 0', () => {
        const pages = 5;
        const numButtons = getWrapper({ pages }).find(NumberedPageButtons);
        expect(numButtons).toHaveLength(1);
        expect(numButtons.prop('currentPage')).toBe(defaultProps.currentPage);
        expect(numButtons.prop('onChange')).toBe(defaultProps.onChange);
        expect(numButtons.prop('pages')).toBe(pages);
      });
    });
  });

  describe('button onClick', () => {
    beforeEach(() => { defaultProps.onChange.mockClear(); });
    afterEach(() => { defaultProps.onChange.mockClear(); });

    describe('previous button calls correct function with correct params', () => {
      test('when current page is over 1', () => {
        const currentPage = 3;
        const prevButton = getWrapper({ currentPage }).find('.app-SearchPagination__prev');
        prevButton.simulate('click');
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange.mock.calls[0][0]).toBe(currentPage - 1);
      });

      test('when current page is under 1', () => {
        const currentPage = 1;
        const prevButton = getWrapper({ currentPage }).find('.app-SearchPagination__prev');
        prevButton.simulate('click');
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange.mock.calls[0][0]).toBe(1);
      });
    });

    describe('next button calls correct function with correct params', () => {
      test('when current page is over pages count', () => {
        const currentPage = 5;
        const pages = 3;
        const nextButton = getWrapper({ currentPage, pages }).find('.app-SearchPagination__next');
        nextButton.simulate('click');
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange.mock.calls[0][0]).toBe(pages);
      });

      test('when current page is under pages count', () => {
        const currentPage = 1;
        const pages = 4;
        const nextButton = getWrapper({ currentPage, pages }).find('.app-SearchPagination__next');
        nextButton.simulate('click');
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange.mock.calls[0][0]).toBe(currentPage + 1);
      });
    });
  });
});
