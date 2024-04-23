import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import OvernightLegends from '../OvernightLegends';


describe('app/shared/overnight-calendar/OvernightLegends', () => {
  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<OvernightLegends {...extraProps} />);
  }

  describe('render', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper();
      expect(wrapper).toHaveLength(1);
      expect(wrapper.prop('className')).toBe('overnight-legends');
      expect(wrapper.prop('aria-hidden')).toBe(true);
    });

    test('rows', () => {
      const rows = getWrapper().find('div.overnight-row');
      expect(rows).toHaveLength(2);
    });

    test('legends', () => {
      const legends = getWrapper().find('div.overnight-legend');
      expect(legends).toHaveLength(4);
    });

    test('legend boxes', () => {
      const legends = getWrapper().find('div.overnight-legend-box');
      expect(legends).toHaveLength(4);
      const box1 = legends.at(0);
      expect(box1.prop('className')).toBe('overnight-legend-box overnight-free');
      expect(box1.text()).toBe('21');
      const box2 = legends.at(1);
      expect(box2.prop('className')).toBe('overnight-legend-box overnight-disabled');
      expect(box2.text()).toBe('21');
      const box3 = legends.at(2);
      expect(box3.prop('className')).toBe('overnight-legend-box overnight-booked');
      expect(box3.text()).toBe('21');
      const box4 = legends.at(3);
      expect(box4.prop('className')).toBe('overnight-legend-box overnight-selection');
      expect(box4.text()).toBe('21');
    });

    test('legend texts', () => {
      const legends = getWrapper().find('span.overnight-legend-text');
      expect(legends).toHaveLength(4);
      const text1 = legends.at(0);
      expect(text1.text()).toBe('Overnight.legend.available');
      const text2 = legends.at(1);
      expect(text2.text()).toBe('Overnight.legend.notSelectable');
      const text3 = legends.at(2);
      expect(text3.text()).toBe('Overnight.legend.reserved');
      const text4 = legends.at(3);
      expect(text4.text()).toBe('Overnight.legend.ownSelection');
    });
  });
});
