import React from 'react';
import Well from 'react-bootstrap/lib/Well';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import NotFoundPage from './NotFoundPage';

describe('pages/not-found/NotFoundPage', () => {
  function getWrapper() {
    return shallowWithIntl(<NotFoundPage />);
  }

  test('renders PageWrapper with correct title', () => {
    const pageWrapper = getWrapper().find(PageWrapper);
    expect(pageWrapper).toHaveLength(1);
    expect(pageWrapper.prop('title')).toBe('NotFoundPage.title');
  });

  test('renders correct title inside h1 tags', () => {
    const h1 = getWrapper().find('h1');
    expect(h1.props().children).toBe('NotFoundPage.title');
  });

  test('renders a Well component', () => {
    const well = getWrapper().find(Well);
    expect(well.length).toBe(1);
  });

  test('renders correct help header text within Well', () => {
    const p = getWrapper().find(Well).find('p');
    expect(p.length).toBe(1);
    expect(p.prop('className')).toBe('h4');
    expect(p.props().children).toBe('NotFoundPage.helpHeader');
  });

  test('renders a list and list elements for displaying help to user', () => {
    const ul = getWrapper().find('ul');
    const lis = getWrapper().find('li');
    expect(ul.length).toBe(1);
    expect(lis.length).toBe(3);
  });
});
