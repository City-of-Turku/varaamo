import React from 'react';
import { shallow } from 'enzyme';

import SelectControl from './controls/SelectControl';
import { UnconnectedSort as Sort } from './Sort';
import CONSTANTS from '../../constants/AppConstants';

describe('pages/search/Sort', () => {
  const defaultProps = {
    sortValue: '',
    t: value => value,
    lang: 'en',
    onChange: () => {},
  };

  function getWrapper(props) {
    return shallow(<Sort {...defaultProps} {...props} />);
  }

  describe('pages/search/Sort', () => {
    test('renders accessability sorting header', () => {
      const wrapper = getWrapper();
      const label = wrapper.find('.Sorting_Accessability');
      expect(label).toHaveLength(1);
      expect(label.text()).toBe('SortBy.sortingStyleSortBy.premise.label');
      expect(label.prop('role')).toBe('status');
    });

    test('renders accessability sorting with different header', () => {
      const sortValue = CONSTANTS.SORT_BY_OPTIONS.NAME.replace('lang', defaultProps.lang);
      const wrapper = getWrapper({ sortValue });
      const label = wrapper.find('.Sorting_Accessability');
      expect(label.text()).toBe('SortBy.sortingStyleSortBy.name.label');
    });

    test('renders SelectControl for sort with correct props', () => {
      const wrapper = getWrapper({});
      const selectControl = wrapper.find(SelectControl);
      expect(selectControl).toHaveLength(1);
      expect(selectControl.prop('id')).toBe('app-Sort');
      expect(selectControl.prop('label')).toEqual('SortBy.label');
      expect(selectControl.prop('onChange')).toBeDefined();
      expect(selectControl.prop('options')).toBeDefined();
      expect(selectControl.prop('value')).toEqual(defaultProps.sortValue);
    });

    test('get translated options base on language', () => {
      const wrapper = getWrapper({ lang: 'foo' });
      const options = wrapper.find(SelectControl).prop('options');

      expect(options.length).toEqual(4);
      expect(options[0].value).toContain('foo');
      expect(options[3].value).not.toContain('foo');
    });
  });
});
