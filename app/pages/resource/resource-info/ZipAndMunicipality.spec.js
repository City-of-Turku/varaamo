import { shallow } from 'enzyme';
import React from 'react';

import Unit from '../../../utils/fixtures/Unit';
import ZipAndMunicipality from './ZipAndMunicipality';

describe('pages/resource/resource-info/ZipAndMunicipality', () => {
  const defaultProps = {
    unit: Unit.build()
  };

  function getWrapper(extraProps) {
    return shallow(<ZipAndMunicipality {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    describe('null', () => {
      test('when unit is falsy', () => {
        const component = getWrapper({ unit: undefined });
        expect(component.isEmptyRender()).toBe(true);
      });

      test('when unit exists but its zip and municipality are falsy', () => {
        const unit = Unit.build({ addressZip: null, municipality: null });
        const component = getWrapper({ unit });
        expect(component.isEmptyRender()).toBe(true);
      });
    });

    describe('correct span text', () => {
      test.each([
        [123456, null, '123456'],
        [null, 'turku', 'Turku'],
        [123456, 'turku', '123456 Turku'],
      ])('when zip is %p and municipality is %p', (addressZip, municipality, expected) => {
        const unit = Unit.build({ addressZip, municipality });
        const wrapper = getWrapper({ unit });
        const span = wrapper.find('span');
        expect(span).toHaveLength(1);
        expect(span.text()).toBe(expected);
      });
    });
  });
});
