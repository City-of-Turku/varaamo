import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import constants from '../../constants/AppConstants';
import TestSiteMessage from './TestSiteMessage';

describe('shared/test-site-message/TestSiteMessage', () => {
  function getWrapper() {
    return shallowWithIntl(<TestSiteMessage />);
  }

  describe('TestSiteMessage ', () => {
    afterEach(() => {
      simple.restore();
    });

    test('renders an Alert when env SHOW_TEST_SITE_MESSAGE is true', () => {
      simple.mock(constants, 'SHOW_TEST_SITE_MESSAGE', true);
      const alert = getWrapper().find(Alert);
      const returnValue = getWrapper();
      expect(alert).toHaveLength(1);
      expect(returnValue.type()).toEqual(Alert);
      expect(alert.prop('children')).toBe('TestSiteMessage.text');
    });

    test('does not render an Alert and returns null instead when env SHOW_TEST_SITE_MESSAGE is false', () => {
      simple.mock(constants, 'SHOW_TEST_SITE_MESSAGE', false);
      const alert = getWrapper().find(Alert);
      const returnValue = getWrapper();
      expect(alert).toHaveLength(0);
      expect(returnValue.type()).toEqual(null);
    });
  });
});
