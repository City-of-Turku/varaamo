import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import MapToggle from './MapToggle';

describe('pages/search/results/MapToggle', () => {
  function getWrapper(props) {
    const defaults = {
      mapVisible: false,
      onClick: () => null,
      resultCount: 0,
      contrast: '',
      hideToggleButtons: false,
    };
    return shallowWithIntl(<MapToggle {...defaults} {...props} />);
  }

  test('renders section.app-MapToggle with correct props', () => {
    const wrapper = getWrapper();
    expect(wrapper).toHaveLength(1);
    expect(wrapper.is('section.app-MapToggle')).toBe(true);
  });

  test('div.app-MapToggle has no additional classes when isHighContrast = false', () => {
    expect(getWrapper().hasClass('high-contrast')).toBe(false);
  });

  test('div.app-MapToggle has high-contrast class when isHighContrast = true', () => {
    expect(getWrapper({ contrast: 'high-contrast' }).hasClass('high-contrast')).toBe(true);
  });

  describe('result count text', () => {
    function getResultsCountText(resultCount) {
      return getWrapper({ resultCount }).find('.app-MapToggle__results-count').text();
    }

    test('renders app-MapToggle__results-count with correct props', () => {
      const countElement = getWrapper().find('.app-MapToggle__results-count');
      expect(countElement).toHaveLength(1);
      expect(countElement.prop('role')).toBe('status');
    });

    test('renders correct string if there are results', () => {
      expect(getResultsCountText(12)).toBe('MapToggle.resultsText');
    });

    test('renders empty message string if no results', () => {
      expect(getResultsCountText(0)).toBe('MapToggle.noResultsText');
    });
  });

  describe('buttons', () => {
    test('renders list button as selected if map is not visible', () => {
      const wrapper = getWrapper({ mapVisible: false, hideToggleButtons: false });
      const listButton = wrapper.find('.app-MapToggle__button-list');
      const mapButton = wrapper.find('.app-MapToggle__button-map');

      expect(listButton.length).toBe(1);
      expect(listButton.prop('role')).toBe('tab');
      expect(listButton.prop('aria-selected')).toBe(true);
      expect(listButton.hasClass('active-tab')).toBe(true);

      expect(mapButton.length).toBe(1);
      expect(mapButton.prop('role')).toBe('tab');
      expect(mapButton.prop('aria-selected')).toBe(false);
      expect(mapButton.hasClass('active-tab')).toBe(false);
    });

    test('renders map button as selected if map is visible', () => {
      const wrapper = getWrapper({ mapVisible: true, hideToggleButtons: false });
      const listButton = wrapper.find('.app-MapToggle__button-list');
      const mapButton = wrapper.find('.app-MapToggle__button-map');

      expect(listButton.length).toBe(1);
      expect(listButton.prop('role')).toBe('tab');
      expect(listButton.prop('aria-selected')).toBe(false);
      expect(listButton.hasClass('active-tab')).toBe(false);

      expect(mapButton.length).toBe(1);
      expect(mapButton.prop('role')).toBe('tab');
      expect(mapButton.prop('aria-selected')).toBe(true);
      expect(mapButton.hasClass('active-tab')).toBe(true);
    });

    test('Hide Buttons when hideToggleButtons is true', () => {
      const wrapper = getWrapper({ hideToggleButtons: true });
      const listButton = wrapper.find('.app-MapToggle__button-list');
      const mapButton = wrapper.find('.app-MapToggle__button-map');

      expect(listButton.length).toBe(0);

      expect(mapButton.length).toBe(0);
    });
  });
});
