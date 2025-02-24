import React from 'react';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import ResourceTypeFilterContainer from './ResourceTypeFilterContainer';
import ResourceTypeFilterButton from './ResourceTypeFilterButton';


describe('shared/resource-type-filter/ResourceTypeFilterContainer', () => {
  const defaultProps = {
    onSelectResourceType: simple.mock(),
    onUnselectResourceType: simple.mock(),
    resourceTypes: ['a', 'b', 'c'],
    selectedResourceTypes: ['a'],
    externalResources: [],
    showExternalResources: false,
    toggleShowExternalResources: jest.fn(),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourceTypeFilterContainer {...defaultProps} {...props} />);
  }
  let wrapper;

  beforeAll(() => {
    wrapper = getWrapper();
  });

  test('renders ResourceTypeFilter components', () => {
    expect(wrapper.find(ResourceTypeFilterButton)).toHaveLength(3);
  });

  describe('ResourceTypeFilter', () => {
    let resourceTypeFilter;
    beforeAll(() => {
      resourceTypeFilter = wrapper.find(ResourceTypeFilterButton).at(0);
    });

    test('passes correct props', () => {
      expect(resourceTypeFilter.prop('onClick')).toBe(wrapper.instance().handleClick);
      expect(resourceTypeFilter.prop('resourceType')).toBe('a');
    });

    describe('selected', () => {
      beforeAll(() => {
        resourceTypeFilter = wrapper.find(ResourceTypeFilterButton).at(0);
      });

      test('passes correct active prop', () => {
        expect(resourceTypeFilter.prop('active')).toBe(true);
      });
    });
    describe('not selected', () => {
      beforeAll(() => {
        resourceTypeFilter = wrapper.find(ResourceTypeFilterButton).at(1);
      });

      test('passes correct active prop', () => {
        expect(resourceTypeFilter.prop('active')).toBe(false);
      });
    });
  });
  describe('ResourceTypeFilter when externalResources exist', () => {
    const mockProps = {
      toggleShowExternalResources: jest.fn(),
      showExternalResources: true,
      externalResources: ['resource1']
    };
    const viewerWrapper = getWrapper(mockProps);
    test('first Button is the toggle for externalResources and has correct props', () => {
      const element = viewerWrapper.find(ResourceTypeFilterButton).at(0);
      expect(element.prop('onClick')).toBe(mockProps.toggleShowExternalResources);
      expect(element.prop('resourceType')).toBe('AdminResourcesPage.external.toggle');
      expect(element.prop('active')).toBe(mockProps.showExternalResources);
    });
    test('the remaining buttons are rendered correctly', () => {
      const allButtons = viewerWrapper.find(ResourceTypeFilterButton);
      expect(allButtons).toHaveLength(4);
      expect(allButtons.at(1).prop('resourceType')).toBe('a');
      expect(allButtons.at(2).prop('resourceType')).toBe('b');
      expect(allButtons.at(3).prop('resourceType')).toBe('c');
    });
  });

  describe('handleClick', () => {
    let instance;

    beforeAll(() => {
      instance = wrapper.instance();
    });

    beforeEach(() => {
      defaultProps.onSelectResourceType.reset();
      defaultProps.onUnselectResourceType.reset();
    });

    test('calls onUnselectResourceType if resource was on selected list', () => {
      instance.handleClick(defaultProps.selectedResourceTypes[0]);
      expect(defaultProps.onUnselectResourceType.callCount).toBe(1);
      expect(
        defaultProps.onUnselectResourceType.lastCall.args
      ).toEqual([defaultProps.selectedResourceTypes[0]]);
      expect(defaultProps.onSelectResourceType.callCount).toBe(0);
    });

    test('calls onSelectResourceType if resource was not on selected list', () => {
      instance.handleClick(defaultProps.resourceTypes[-1]);
      expect(defaultProps.onSelectResourceType.callCount).toBe(1);
      expect(
        defaultProps.onSelectResourceType.lastCall.args
      ).toEqual([defaultProps.resourceTypes[-1]]);
      expect(defaultProps.onUnselectResourceType.callCount).toBe(0);
    });
  });
});
