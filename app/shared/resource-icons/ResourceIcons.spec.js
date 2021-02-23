import React from 'react';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceIcons from './ResourceIcons';

describe('shared/resource-list/ResourceIcons', () => {
  const defaultProps = {
    resource: Immutable(Resource.build({
      peopleCapacity: 10,
      maxPeriod: '02:00:00',
      minPrice: '10.00',
      maxPrice: '25.00',
      priceType: 'hourly',
    })),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResourceIcons {...defaultProps} {...extraProps} />);
  }
  let wrapper;
  let wrapperNoProps;
  beforeAll(() => {
    wrapper = getWrapper();
    wrapperNoProps = getWrapper({
      resource: Immutable(Resource.build({
        peopleCapacity: null,
        maxPeriod: null,
        minPricePerHour: null,
        maxPricePerHour: null,
      })),
    });
  });

  test('is rendered as a div', () => {
    expect(wrapper.is('div')).toBe(true);
  });

  test('has icons class', () => {
    expect(wrapper.prop('className')).toBe('resource-icons');
  });

  describe('capacity icon', () => {
    let userIcon;
    let spanText;
    beforeAll(() => {
      userIcon = wrapper.find({ glyph: 'user' });
      spanText = userIcon.closest('span').find('.text');
    });

    test('is rendered', () => {
      expect(userIcon).toHaveLength(1);
    });

    test('renders correct text', () => {
      expect(spanText.text()).toBe('10');
    });

    test('is not rendered if prop is not passed', () => {
      expect(wrapperNoProps.find({ glyph: 'user' })).toHaveLength(0);
    });
  });

  describe('time icon', () => {
    let timeIcon;
    let spanText;
    beforeAll(() => {
      timeIcon = wrapper.find({ glyph: 'time' });
      spanText = timeIcon.closest('span').find('.text');
    });

    test('is rendered', () => {
      expect(timeIcon).toHaveLength(1);
    });

    test('renders correct text', () => {
      expect(spanText.text()).toBe('2 h');
    });

    test('is not rendered if prop is not passed', () => {
      expect(wrapperNoProps.find({ glyph: 'time' })).toHaveLength(0);
    });
  });

  describe('euro icon', () => {
    let euroIcon;
    let spanText;

    function getSpanTextWithProps(resourceProps) {
      const resource = defaultProps.resource.merge(resourceProps);
      return getWrapper({ resource }).find({ glyph: 'euro' }).closest('span').find('.text');
    }
    beforeAll(() => {
      euroIcon = wrapper.find({ glyph: 'euro' });
      spanText = euroIcon.closest('span').find('.text');
    });

    test('is rendered', () => {
      expect(euroIcon).toHaveLength(1);
    });

    test('renders range of prices', () => {
      expect(spanText.text()).toBe('10 - 25 €/common.unit.time.hour');
    });

    test('renders max euro if no min price', () => {
      const props = {
        maxPrice: '25.00',
        minPrice: null,
      };
      expect(getSpanTextWithProps(props).text()).toBe('25 €/common.unit.time.hour');
    });

    test('renders min price if no max price', () => {
      const props = {
        maxPrice: '10.00',
        minPric: null,
      };
      expect(getSpanTextWithProps(props).text()).toBe('10 €/common.unit.time.hour');
    });

    test('renders one price if min and max prices are the same', () => {
      const props = {
        maxPrice: '10.00',
        minPrice: '10.00',
      };
      expect(getSpanTextWithProps(props).text()).toBe('10 €/common.unit.time.hour');
    });

    test('renders "free" message if price is 0', () => {
      const props = {
        maxPrice: null,
        minPrice: '0.00',
      };
      expect(getSpanTextWithProps(props).text()).toBe('ResourceIcons.free');
    });

    test('renders "free" message if price prop is not passed', () => {
      const props = {
        maxPrice: null,
        minPrice: null,
      };
      expect(getSpanTextWithProps(props).text()).toBe('ResourceIcons.free');
    });
  });
});
