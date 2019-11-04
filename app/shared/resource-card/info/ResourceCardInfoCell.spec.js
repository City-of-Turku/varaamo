import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import ResourceCardInfoCell from './ResourceCardInfoCell';
import iconMap from 'assets/icons/map.svg';

describe('/shared/resource-card/info/ResourceCardInfoCell', () => {
  const defaultProps = {
    className: 'app-ResourceCard__info-cell',
    alt: 'foo',
    icon: 'bar',
  };

  function getWrapper(props) {
    return shallow(<ResourceCardInfoCell {...defaultProps} {...props} />);
  }

  test('render normally', () => {
    const wrapper = getWrapper();
    expect(wrapper).toHaveLength(1);
    expect(wrapper).toBeDefined();
  });

  describe('if onClick is defined', () => {
    const onClick = () => { };
    test('renders Button', () => {
      const button = getWrapper({ onClick }).find(Button);
      expect(button.length).toBe(1);
    });

    test('contains correct title prop', () => {
      const wrapper = getWrapper({ onClick, titleText: 'some title text' });
      expect(wrapper.prop('title')).toBe('some title text');
    });

    test('contain onClick handler', () => {
      const mockFunc = jest.fn();
      const wrapper = getWrapper({ onClick: mockFunc });

      wrapper.simulate('click');
      expect(mockFunc).toBeCalled();
      expect(wrapper.prop('onClick')).toBeDefined();
      expect(mockFunc.mock.calls.length).toBe(1);
    });
  });

  describe('if onClick is not defined', () => {
    test('renders div', () => {
      const div = getWrapper().find('div');
      expect(div.length).toBe(1);
    });
  });

  test('contains default className, joined with passed className prop', () => {
    const wrapper = getWrapper({ className: 'foo' });
    const classnames = wrapper.prop('className');
    expect(classnames).toContain(defaultProps.className);
    expect(classnames).toContain('foo');
  });

  test('contains img with props', () => {
    const wrapper = getWrapper();
    const img = wrapper.find('img');

    expect(img.prop('alt')).toBe(defaultProps.alt);
    expect(img.prop('src')).toBe(defaultProps.icon);
    expect(img.prop('className')).toBe('app-ResourceCard__info-cell__icon');
  });

  test('accept external icon', () => {
    const wrapper = getWrapper({ icon: iconMap });
    const img = wrapper.find('img');

    expect(img.prop('src')).toBe(iconMap);
  });

  test('accept children as label', () => {
    const label = <span>This is label</span>;
    const wrapper = getWrapper({ children: label });

    expect(wrapper.contains(label)).toBeTruthy();
  });
});
