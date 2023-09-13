import React from 'react';
import { Button } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import { getLocalizedFieldValue } from '../../../utils/languageUtils';
import { ServiceAnnouncementWithT as ServiceAnnouncement } from '../ServiceAnnouncement';
import { fetchAnnouncement } from '../serviceAnnouncementUtils';

jest.mock('../serviceAnnouncementUtils', () => {
  const originalModule = jest.requireActual('../serviceAnnouncementUtils');
  return {
    __esModule: true,
    ...originalModule,
    fetchAnnouncement: jest.fn(() => Promise.resolve({
      data: { results: [{ message: { fi: 'test' }, is_maintenance_mode_on: true }] },
    })),
  };
});

describe('shared/service-announcement/ServiceAnnouncement', () => {
  const defaultProps = {
    contrast: '',
    currentLanguage: 'fi',
    actions: { setMaintenanceMode: jest.fn() }
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ServiceAnnouncement {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test.each([
      [false, null],
      [true, null],
      [true, {}],
    ])('null when state show is %p and state announcement is %p', (show, announcement) => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ show, announcement });
      expect(wrapper.isEmptyRender()).toBe(true);
    });

    describe('when state.show is true and state.announcement.message is defined', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const announcement = {
        message: {
          fi: 'Tämä on ilmoitus',
          en: 'This is a notice',
          sv: 'Detta är ett meddelande'
        }
      };
      instance.setState({ show: true, announcement });

      test('wrapping Alert with correct props', () => {
        const alert = wrapper.find('.service-announcement');
        expect(alert).toHaveLength(1);
        expect(alert.prop('bsStyle')).toBe('danger');
        expect(alert.prop('className')).toBe(`service-announcement ${defaultProps.contrast}`);
        expect(alert.prop('onDismiss')).toBe(instance.handleDismiss);
      });

      test('container div', () => {
        const div = wrapper.find('div.container');
        expect(div).toHaveLength(1);
      });

      test('paragraph in container div', () => {
        const paragraph = wrapper.find('div.container').find('p');
        expect(paragraph).toHaveLength(1);
      });

      test('service announcement title span', () => {
        const span = wrapper.find('span#service-announcement-title');
        expect(span).toHaveLength(1);
        expect(span.text()).toBe('ServiceAnnouncement.title: ');
      });

      test('service announcement message span', () => {
        const span = wrapper.find('span#service-announcement-message');
        expect(span).toHaveLength(1);
        expect(span.text()).toBe(
          getLocalizedFieldValue(announcement.message, defaultProps.currentLanguage)
        );
      });

      test('close button', () => {
        const button = wrapper.find(Button);
        expect(button).toHaveLength(1);
        expect(button.prop('aria-label')).toBe('ServiceAnnouncement.close ServiceAnnouncement.title');
        expect(button.prop('onClick')).toBe(instance.handleDismiss);
        expect(button.children().text()).toBe('ServiceAnnouncement.close');
      });
    });
  });

  describe('functions', () => {
    describe('handleDismiss', () => {
      test('sets correct state', () => {
        const instance = getWrapper().instance();
        instance.setState({ show: true });
        instance.handleDismiss();
        expect(instance.state.show).toBe(false);
      });
    });

    describe('componentDidMount', () => {
      afterEach(() => {
        fetchAnnouncement.mockClear();
        defaultProps.actions.setMaintenanceMode.mockClear();
      });

      test('calls fetchAnnouncement and setState', async () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        await instance.componentDidMount();
        expect(fetchAnnouncement).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      test('calls props.actions.setMaintenanceMode', async () => {
        const instance = getWrapper().instance();
        await instance.componentDidMount();
        expect(defaultProps.actions.setMaintenanceMode).toHaveBeenCalledTimes(1);
      });
    });
  });
});
