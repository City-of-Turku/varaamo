import React from 'react';
import simple from 'simple-mock';

import { mountWithIntl } from 'utils/testUtils';
import LanguageDropdown from './LanguageDropdown';

describe('shared/top-navbar/language-dropdown', () => {
  const defaults = {
    currentLanguage: 'fi',
    handleLanguageChange: simple.stub(),
    id: 'desktopLang',
    event: {
      preventDefault: simple.stub(),
    },
    handleLangClick: simple.stub(),
  };

  function getWrapper(props) {
    return mountWithIntl(<LanguageDropdown {...defaults} {...props} />);
  }

  describe('renders', () => {
    test('correct amount of elements', () => {
      const element = getWrapper();
      expect(element.find('li')).toHaveLength(4);
      expect(element.find('a')).toHaveLength(4);
      expect(element.find('span')).toHaveLength(1);
      expect(element.find('ul')).toHaveLength(1);
    });

    describe('state, lifecycle and other functions', () => {
      test('toggleDropdown toggles langOpen', () => {
        const element = getWrapper();
        expect(element.find('a').first().prop('aria-expanded')).toBe(false);
        element.find('a').first().simulate('click');
        expect(element.find('a').first().prop('aria-expanded')).toBe(true);
        element.find('a').first().simulate('click');
        expect(element.find('a').first().prop('aria-expanded')).toBe(false);
      });

      test('useEffect is called on mount', () => {
        const useEffect = jest.spyOn(React, 'useEffect');
        const addEventListener = jest.spyOn(document, 'addEventListener');
        const removeEventListener = jest.spyOn(document, 'removeEventListener');
        const element = getWrapper();
        element.find('a').first().simulate('click');
        expect(useEffect).toHaveBeenCalled();
        expect(addEventListener).toHaveBeenCalled();
        expect(removeEventListener).toHaveBeenCalled();
      });
    });


    describe('main li element', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = getWrapper();
      });

      test('with correct className when !langOpen', () => {
        const element = wrapper.find('li').first();
        expect(element.prop('className')).toBe('app-TopNavbar__lang closed');
      });

      test('with correct className when langOpen', () => {
        wrapper.find('a').first().simulate('click');
        const element = wrapper.find('li').first();
        expect(element.prop('className')).toBe('app-TopNavbar__lang open');
      });

      test('with id prop from defaultProps', () => {
        const element = wrapper.find('li').first();
        expect(element.prop('id')).toBe(defaults.id);
      });
    });

    describe('main a element ', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = getWrapper();
      });

      test('with correct aria-expanded prop when !langOpen', () => {
        const element = wrapper.find('a').first();
        expect(element.prop('aria-expanded')).toBe(false);
      });

      test('with correct aria-expanded prop when langOpen', () => {
        wrapper.find('a').first().simulate('click');
        const element = wrapper.find('a').first();
        expect(element.prop('aria-expanded')).toBe(true);
      });

      test('with default className prop if no props.class passed', () => {
        const element = wrapper.find('a').first();
        expect(element.prop('className')).toBe('langDrop');
      });

      test('with className prop from passed props.classNameOptional', () => {
        const extraProp = {
          classNameOptional: 'passedFromSomewhere'
        };
        const wrapperClass = getWrapper(extraProp);
        const element = wrapperClass.find('a').first();
        expect(element.prop('className')).toBe(extraProp.classNameOptional);
      });

      test('with correct props', () => {
        const element = wrapper.find('a').first();
        expect(element.prop('aria-haspopup')).toBe('true');
        expect(element.prop('aria-label')).toBe('Navbar.language.active');
        expect(element.prop('href')).toBe('#');
        expect(element.prop('id')).toBe(`${defaults.id}-langdropdown`);
        expect(element.prop('onClick')).toBeDefined();
      });
      test('with correct id prop based on props', () => {
        let element = wrapper.find('a').first();
        expect(element.prop('id')).toBe(`${defaults.id}-langdropdown`);
        wrapper.setProps({ id: 'mobile' });
        element = wrapper.find('a').first();
        expect(element.prop('id')).toBe('mobile-langdropdown');
      });

      test('with correct children', () => {
        const element = wrapper.find('a').first();
        expect(element.text()).toBe(defaults.currentLanguage);
        expect(element.find('span.caret')).toHaveLength(1);
      });
    });

    describe('dropdown menu', () => {
      test('ul', () => {
        const element = getWrapper().find('ul');
        expect(element).toHaveLength(1);
        expect(element.prop('className')).toBe('language-dropdown-menu');
      });

      test('all li elements', () => {
        const element = getWrapper().find('ul').find('li');
        expect(element).toHaveLength(3);
      });

      describe('<a> elements ', () => {
        function langWrap(props) {
          return getWrapper(props).find('ul').find('a');
        }

        test('first element with default props', () => {
          const element = langWrap().first();
          expect(element.prop('aria-label')).toBe('Navbar.language-finnish');
          expect(element.prop('href')).toBe('#');
          expect(element.prop('onClick')).toBeDefined();
          expect(element.text()).toBe('FI');
        });

        test('second element with default props', () => {
          const element = langWrap().at(1);
          expect(element.prop('aria-label')).toBe('Navbar.language-swedish');
          expect(element.prop('href')).toBe('#');
          expect(element.prop('onClick')).toBeDefined();
          expect(element.text()).toBe('SV');
        });

        test('third element with default props', () => {
          const element = langWrap().last();
          expect(element.prop('aria-label')).toBe('Navbar.language-english');
          expect(element.prop('href')).toBe('#');
          expect(element.prop('onClick')).toBeDefined();
          expect(element.text()).toBe('EN');
        });

        test('get different className props when defaultLang = true', () => {
          const first = langWrap().first();
          const second = langWrap().at(1);
          const third = langWrap().last();
          expect(first.prop('className')).toBe('active');
          expect(second.prop('className')).toBe('');
          expect(third.prop('className')).toBe('');
        });

        test('get different className props when defaultLang = false', () => {
          const currentLanguage = 'sv';
          const first = langWrap({ currentLanguage }).first();
          const second = langWrap({ currentLanguage }).at(1);
          const third = langWrap({ currentLanguage }).last();
          expect(first.prop('className')).toBe('');
          expect(second.prop('className')).toBe('active');
          expect(third.prop('className')).toBe('');
        });
      });
    });
  });
});
