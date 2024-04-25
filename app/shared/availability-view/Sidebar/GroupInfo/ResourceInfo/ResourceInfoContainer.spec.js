import React from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedResourceInfo as ResourceInfo, selector } from './ResourceInfoContainer';
import UnpublishedLabel from 'shared/label/Unpublished';
import Label from 'shared/label';

function getState() {
  return {
    data: {
      resources: {
        123456: {
          id: '123456',
          name: { fi: 'Resource Name' },
          extra: 'attribute',
          isFavorite: false,
          peopleCapacity: 9,
          public: true,
          userPermissions: {
            isAdmin: false,
            isManager: true,
            isViewer: false
          },
          overnightReservations: false,
        },
      },
    },
  };
}

describe('shared/availability-view/ResourceInfoContainer', () => {
  function getWrapper(props) {
    const defaults = {
      date: '2017-01-02',
      id: 'r-1',
      isFavorite: false,
      isSelected: false,
      name: 'Resource name',
      peopleCapacity: 19,
      public: true,
      hasStaffRights: true,
      overnightReservations: false,
    };
    return shallowWithIntl(<ResourceInfo {...defaults} {...props} />);
  }

  test('renders a div.resource-info', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.resource-info')).toBe(true);
  });

  test('has selected class if isSelected', () => {
    const wrapper = getWrapper({ isSelected: true });
    expect(wrapper.is('.resource-info-selected')).toBe(true);
  });

  test('has overnight class if overnightReservations is true', () => {
    const wrapper = getWrapper({ overnightReservations: true });
    expect(wrapper.is('.is-overnight')).toBe(true);
  });

  test('renders the name and link to resource page', () => {
    const date = '2017-02-03';
    const link = getWrapper({ date, id: 'r-1', name: 'Room 1' }).find(Link);
    expect(link).toHaveLength(1);
    expect(link.prop('to')).toBe(`/resources/r-1?date=${date}`);
    expect(link.prop('children')).toBe('Room 1');
  });

  test('renders the capacity in details', () => {
    const details = getWrapper({ peopleCapacity: 3 }).find('.details');
    expect(details).toHaveLength(1);
    expect(details.text()).toContain('3');
  });

  test('renders unpublished label if public is false', () => {
    const label = getWrapper({ public: false }).find(UnpublishedLabel);
    expect(label).toHaveLength(1);
  });

  test('does not render unpublished label if public is true', () => {
    const label = getWrapper({ public: true }).find(UnpublishedLabel);
    expect(label).toHaveLength(0);
  });

  test('renders external label if the user does not has staff rights for the resource', () => {
    const label = getWrapper({ hasStaffRights: false }).find(Label);
    expect(label).toHaveLength(1);
  });

  test('does not render external label if the user does has staff rights for the resource', () => {
    const label = getWrapper({ hasStaffRights: true }).find(Label);
    expect(label).toHaveLength(0);
  });

  describe('when overnightReservations is true', () => {
    test('renders unusable label', () => {
      const label = getWrapper({ overnightReservations: true }).find(Label);
      expect(label).toHaveLength(1);
      expect(label.prop('bsStyle')).toBe('default');
      expect(label.prop('className')).toBe('unusable-label');
      expect(label.prop('title')).toBe('AdminResourcesPage.label.notUsable');
      expect(label.prop('children')).toBe('AdminResourcesPage.label.notUsable');
    });

    test('does not render user icon', () => {
      const icon = getWrapper({ overnightReservations: true }).find(Glyphicon);
      expect(icon).toHaveLength(0);
    });

    test('does not render UnpublishedLabel', () => {
      const label = getWrapper({ overnightReservations: true }).find(UnpublishedLabel);
      expect(label).toHaveLength(0);
    });

    test('does not render external label', () => {
      const label = getWrapper({ overnightReservations: true, hasStaffRights: false })
        .find('.unpublished-label');
      expect(label).toHaveLength(0);
    });
  });

  describe('selector', () => {
    function getSelected(props) {
      const defaults = { id: '123456' };
      return selector()(getState(), { ...defaults, ...props });
    }

    test('returns resource info', () => {
      const actual = getSelected();
      expect(actual).toEqual({
        name: 'Resource Name',
        peopleCapacity: 9,
        public: true,
        hasStaffRights: true,
        overnightReservations: false,
      });
    });
  });
});
