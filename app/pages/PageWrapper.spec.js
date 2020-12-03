import { shallow } from 'enzyme';
import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import { Helmet } from 'react-helmet';

import PageWrapper from './PageWrapper';

describe('pages/PageWrapper', () => {
  const defaultProps = {
    className: 'test-page',
    title: 'Test title',
  };

  function getWrapper(extraProps) {
    return shallow(
      <PageWrapper {...defaultProps} {...extraProps}>
        <h1>Rendered content</h1>
      </PageWrapper>
    );
  }

  describe('Helmet', () => {
    const helmet = getWrapper().find(Helmet);

    test('is rendered', () => {
      expect(helmet).toHaveLength(1);
    });

    test('has child title', () => {
      const title = helmet.find('title');
      expect(title).toHaveLength(1);
      expect(title.text()).toBe(`${defaultProps.title} - Varaamo`);
    });

    test('has canonical link if canonicalUrl given in props', () => {
      const canonicalUrl = 'https://varaamo.fi/page';
      const canonicalLink = getWrapper({ canonicalUrl }).find('link');
      expect(canonicalLink).toHaveLength(1);
      expect(canonicalLink.prop('href')).toBe(canonicalUrl);
      expect(canonicalLink.prop('rel')).toBe('canonical');
    });

    test('does not have canonical link if canonicalUrl is not given in props', () => {
      const canonicalLink = helmet.find('link');
      expect(canonicalLink).toHaveLength(0);
    });
  });

  test('renders a div with the className given in props', () => {
    const div = getWrapper().find(`.${defaultProps.className}`);
    expect(div.length).toBe(1);
  });

  test('renders the page content', () => {
    const content = getWrapper().find('h1');
    expect(content).toHaveLength(1);
    expect(content.text()).toBe('Rendered content');
  });

  test('renders a normal Grid', () => {
    const gridWrapper = getWrapper().find(Grid);
    expect(gridWrapper).toHaveLength(1);
  });

  test('renders a fluid Grid if fluid prop', () => {
    const gridWrapper = getWrapper({ fluid: true }).find(Grid);
    expect(gridWrapper).toHaveLength(1);
  });
});
